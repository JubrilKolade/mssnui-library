import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { generateDownloadUrl } from "@/src/lib/r2";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  req: NextRequest,
  context: RouteContext
) {
  const params = await context.params;
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const book = await prisma.book.findUnique({
      where: { id: params.id, status: "approved" },
      include: {
        category: true,
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

    if (!book) {
      return NextResponse.json(
        { success: false, error: "Book not found" },
        { status: 404 }
      );
    }

    // Log view
    await prisma.resourceView
      .create({
        data: {
          userId: session.user.id,
          resourceType: "book",
          bookId: params.id,
        },
      })
      .catch(() => {});

    // Check bookmark
    const bookmark = await prisma.bookmark.findFirst({
      where: { userId: session.user.id, bookId: params.id },
    });

    // Generate signed URL
    const fileKey = book.fileUrl.replace(
      `${process.env.R2_PUBLIC_URL}/`,
      ""
    );
    const signedUrl = await generateDownloadUrl(fileKey, 7200);

    return NextResponse.json({
      success: true,
      data: {
        ...book,
        signedUrl,
        isBookmarked: !!bookmark,
      },
    });
  } catch (error) {
    console.error("Get book error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch book" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: RouteContext
) {
  const params = await context.params;
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

    const body = await req.json();

    const book = await prisma.book.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json({ success: true, data: book });
  } catch (error) {
    console.error("Update book error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update book" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: RouteContext
) {
  const params = await context.params;
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

    await prisma.book.delete({ where: { id: params.id } });

    return NextResponse.json({
      success: true,
      message: "Book deleted",
    });
  } catch (error) {
    console.error("Delete book error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete book" },
      { status: 500 }
    );
  }
}