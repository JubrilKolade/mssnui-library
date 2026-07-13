import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { z } from "zod";

const schema = z.object({
  resourceType: z.enum(["book", "course", "project"]),
  resourceId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = schema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Invalid data" },
        { status: 400 }
      );
    }

    const { resourceType, resourceId } = validated.data;

    const download = await prisma.download.create({
      data: {
        userId: session.user.id,
        resourceType,
        ...(resourceType === "book" && { bookId: resourceId }),
        ...(resourceType === "course" && { courseId: resourceId }),
        ...(resourceType === "project" && { projectId: resourceId }),
      },
    });

    return NextResponse.json({ success: true, data: download });
  } catch (error) {
    console.error("Download log error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to log download" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const downloads = await prisma.download.findMany({
      where: { userId: session.user.id },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            coverImageUrl: true,
          },
        },
        course: {
          select: {
            id: true,
            courseCode: true,
            courseTitle: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
            authorName: true,
          },
        },
      },
      orderBy: { downloadedAt: "desc" },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      data: downloads,
    });
  } catch (error) {
    console.error("Get downloads error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch downloads" },
      { status: 500 }
    );
  }
}