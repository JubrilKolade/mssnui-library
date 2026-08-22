import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export async function GET(
  req: NextRequest,
  context: any
) {
  const params = await Promise.resolve(context.params);
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const course = await prisma.course.findUnique({
      where: { id: params.id, status: "approved" },
      include: {
        department: {
          include: {
            academicUnit: {
              include: {
                parent: { select: { name: true } },
              },
            },
          },
        },
        uploadedBy: { select: { name: true, avatar: true } },
        _count: {
          select: { downloads: true, bookmarks: true, views: true },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 }
      );
    }

    // Log view
    await prisma.resourceView
      .create({
        data: {
          userId: session.user.id,
          resourceType: "course",
          courseId: params.id,
        },
      })
      .catch(() => {});

    // Check bookmark
    const bookmark = await prisma.bookmark.findFirst({
      where: { userId: session.user.id, courseId: params.id },
    });

    // Point at our own gated streaming routes rather than handing back
    // a raw, reusable presigned R2 link — see src/app/api/files/[type]/[id]
    return NextResponse.json({
      success: true,
      data: {
        ...course,
        viewUrl: `/api/files/courses/${params.id}`,
        downloadUrl: `/api/files/courses/${params.id}/download`,
        isBookmarked: !!bookmark,
      },
    });
  } catch (error) {
    console.error("Get course error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: any
) {
  const params = await Promise.resolve(context.params);
  try {
    const session = await auth();
    if (
      !session ||
      (session.user.role !== "admin" &&
        session.user.role !== "super_admin")
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await prisma.course.delete({ where: { id: params.id } });

    return NextResponse.json({
      success: true,
      message: "Course deleted",
    });
  } catch (error) {
    console.error("Delete course error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete course" },
      { status: 500 }
    );
  }
}