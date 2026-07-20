import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { z } from "zod";

const schema = z.object({
  id: z.string(),
  type: z.enum(["book", "course", "project"]),
  action: z.enum(["approve", "reject"]),
  reason: z.string().optional(),
});

export async function POST(req: NextRequest) {
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
    const validated = schema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const { id, type, action, reason } = validated.data;

    const status = action === "approve" ? "approved" : "rejected";
    const now = new Date();

    // Update the content
    let uploadedById: string | null = null;
    let contentTitle = "";

    if (type === "book") {
      const book = await prisma.book.update({
        where: { id },
        data: {
          status,
          approvedById: session.user.id,
          approvedAt: now,
          rejectionReason: reason || null,
        },
        select: { uploadedById: true, title: true },
      });
      uploadedById = book.uploadedById;
      contentTitle = book.title;
    } else if (type === "course") {
      const course = await prisma.course.update({
        where: { id },
        data: {
          status,
          approvedById: session.user.id,
          approvedAt: now,
          rejectionReason: reason || null,
        },
        select: {
          uploadedById: true,
          courseCode: true,
          courseTitle: true,
        },
      });
      uploadedById = course.uploadedById;
      contentTitle = `${course.courseCode} — ${course.courseTitle}`;
    } else if (type === "project") {
      const project = await prisma.project.update({
        where: { id },
        data: {
          status,
          approvedById: session.user.id,
          approvedAt: now,
          rejectionReason: reason || null,
        },
        select: { uploadedById: true, title: true },
      });
      uploadedById = project.uploadedById;
      contentTitle = project.title;
    }

    // Notify the uploader
    if (uploadedById) {
      const notificationMessage =
        action === "approve"
          ? `Your ${type} "${contentTitle}" has been approved and is now live! ✅`
          : `Your ${type} "${contentTitle}" was rejected. Reason: ${reason}`;

      await prisma.notification.create({
        data: {
          userId: uploadedById,
          message: notificationMessage,
          type: action === "approve" ? "approval" : "rejection",
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Content ${status} successfully`,
    });
  } catch (error) {
    console.error("Approve error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process approval" },
      { status: 500 }
    );
  }
}