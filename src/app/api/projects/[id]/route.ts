import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { generateDownloadUrl } from "@/src/lib/r2";

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

    const project = await prisma.project.findUnique({
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

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Log view
    await prisma.resourceView
      .create({
        data: {
          userId: session.user.id,
          resourceType: "project",
          projectId: params.id,
        },
      })
      .catch(() => {});

    // Check bookmark
    const bookmark = await prisma.bookmark.findFirst({
      where: { userId: session.user.id, projectId: params.id },
    });

    // Generate signed URL
    const fileKey = project.fileUrl.replace(
      `${process.env.R2_PUBLIC_URL}/`,
      ""
    );
    const signedUrl = await generateDownloadUrl(fileKey, 7200);

    return NextResponse.json({
      success: true,
      data: {
        ...project,
        signedUrl,
        isBookmarked: !!bookmark,
      },
    });
  } catch (error) {
    console.error("Get project error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch project" },
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

    await prisma.project.delete({ where: { id: params.id } });

    return NextResponse.json({
      success: true,
      message: "Project deleted",
    });
  } catch (error) {
    console.error("Delete project error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete project" },
      { status: 500 }
    );
  }
}