import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const [books, courses, projects] = await Promise.all([
      prisma.book.findMany({
        where: { uploadedById: session.user.id },
        include: {
          category: { select: { name: true } },
          department: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.course.findMany({
        where: { uploadedById: session.user.id },
        include: {
          department: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.project.findMany({
        where: { uploadedById: session.user.id },
        include: {
          department: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: { books, courses, projects },
    });
  } catch (error) {
    console.error("My uploads error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch uploads" },
      { status: 500 }
    );
  }
}