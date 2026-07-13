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

    const bookmark = await prisma.bookmark.create({
      data: {
        userId: session.user.id,
        resourceType,
        ...(resourceType === "book" && { bookId: resourceId }),
        ...(resourceType === "course" && { courseId: resourceId }),
        ...(resourceType === "project" && { projectId: resourceId }),
      },
    });

    return NextResponse.json({ success: true, data: bookmark });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "Already bookmarked" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to bookmark" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
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

    await prisma.bookmark.deleteMany({
      where: {
        userId: session.user.id,
        ...(resourceType === "book" && { bookId: resourceId }),
        ...(resourceType === "course" && { courseId: resourceId }),
        ...(resourceType === "project" && { projectId: resourceId }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Bookmark removed",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to remove bookmark" },
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

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: session.user.id },
      include: {
        book: {
          include: {
            category: { select: { id: true, name: true } },
            department: {
              select: {
                id: true,
                name: true,
                academicUnit: { select: { name: true } },
              },
            },
            uploadedBy: { select: { name: true } },
            _count: {
              select: { downloads: true, bookmarks: true },
            },
          },
        },
        course: {
          include: {
            department: {
              include: {
                academicUnit: { select: { name: true } },
              },
            },
            uploadedBy: { select: { name: true } },
            _count: {
              select: { downloads: true, bookmarks: true },
            },
          },
        },
        project: {
          include: {
            department: {
              include: {
                academicUnit: { select: { name: true } },
              },
            },
            uploadedBy: { select: { name: true } },
            _count: {
              select: { downloads: true, bookmarks: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: bookmarks,
    });
  } catch (error) {
    console.error("Get bookmarks error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}