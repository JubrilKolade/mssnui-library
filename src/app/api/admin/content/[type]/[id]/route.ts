import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { r2Client } from "@/src/lib/r2";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

interface RouteContext {
  params: Promise<{ type: string; id: string }>;
}

async function deleteFromR2(url: string) {
  try {
    const key = url.replace(
      `${process.env.R2_PUBLIC_URL}/`,
      ""
    );
    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
      })
    );
  } catch (error) {
    console.error("R2 delete error:", error);
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

    const { type, id } = params;

    // Validate type
    if (!["book", "course", "project"].includes(type)) {
      return NextResponse.json(
        { success: false, error: "Invalid content type" },
        { status: 400 }
      );
    }

    let fileUrl: string | null = null;
    let coverImageUrl: string | null = null;

    if (type === "book") {
      const book = await prisma.book.findUnique({
        where: { id },
        select: { fileUrl: true, coverImageUrl: true },
      });

      if (!book) {
        return NextResponse.json(
          { success: false, error: "Book not found" },
          { status: 404 }
        );
      }

      fileUrl = book.fileUrl;
      coverImageUrl = book.coverImageUrl;

      await prisma.book.delete({ where: { id } });

    } else if (type === "course") {
      const course = await prisma.course.findUnique({
        where: { id },
        select: { fileUrl: true, coverImageUrl: true },
      });

      if (!course) {
        return NextResponse.json(
          { success: false, error: "Course not found" },
          { status: 404 }
        );
      }

      fileUrl = course.fileUrl;
      coverImageUrl = course.coverImageUrl;

      await prisma.course.delete({ where: { id } });

    } else if (type === "project") {
      const project = await prisma.project.findUnique({
        where: { id },
        select: { fileUrl: true, coverImageUrl: true },
      });

      if (!project) {
        return NextResponse.json(
          { success: false, error: "Project not found" },
          { status: 404 }
        );
      }

      fileUrl = project.fileUrl;
      coverImageUrl = project.coverImageUrl;

      await prisma.project.delete({ where: { id } });
    }

    // Delete files from R2
    if (fileUrl) await deleteFromR2(fileUrl);
    if (coverImageUrl) await deleteFromR2(coverImageUrl);

    return NextResponse.json({
      success: true,
      message: `${type} deleted successfully`,
    });

  } catch (error) {
    console.error("Delete content error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete content" },
      { status: 500 }
    );
  }
}

// GET single item (for admin content table)
export async function GET(
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

    const { type, id } = params;

    let item = null;

    if (type === "book") {
      item = await prisma.book.findUnique({
        where: { id },
        include: {
          category: { select: { name: true } },
          department: { select: { name: true } },
          uploadedBy: { select: { name: true } },
          approvedBy: { select: { name: true } },
        },
      });
    } else if (type === "course") {
      item = await prisma.course.findUnique({
        where: { id },
        include: {
          department: { select: { name: true } },
          uploadedBy: { select: { name: true } },
          approvedBy: { select: { name: true } },
        },
      });
    } else if (type === "project") {
      item = await prisma.project.findUnique({
        where: { id },
        include: {
          department: { select: { name: true } },
          uploadedBy: { select: { name: true } },
          approvedBy: { select: { name: true } },
        },
      });
    }

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Content not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: item });

  } catch (error) {
    console.error("Get content error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}