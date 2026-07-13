import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { z } from "zod";

const schema = z.object({
  ids: z.array(z.string()).min(1),
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

    const { ids, type, action, reason } = validated.data;
    const status = action === "approve" ? "approved" : "rejected";
    const now = new Date();

    // Get uploaders before updating
    let items: { id: string; uploadedById: string; title: string }[] = [];

    if (type === "book") {
      const books = await prisma.book.findMany({
        where: { id: { in: ids } },
        select: { id: true, uploadedById: true, title: true },
      });
      items = books;

      await prisma.book.updateMany({
        where: { id: { in: ids } },
        data: {
          status,
          approvedById: session.user.id,
          approvedAt: now,
          rejectionReason: reason || null,
        },
      });
    } else if (type === "course") {
      const courses = await prisma.course.findMany({
        where: { id: { in: ids } },
        select: {
          id: true,
          uploadedById: true,
          courseCode: true,
          courseTitle: true,
        },
      });
      items = courses.map((c) => ({
        id: c.id,
        uploadedById: c.uploadedById,
        title: `${c.courseCode} — ${c.courseTitle}`,
      }));

      await prisma.course.updateMany({
        where: { id: { in: ids } },
        data: {
          status,
          approvedById: session.user.id,
          approvedAt: now,
          rejectionReason: reason || null,
        },
      });
    } else if (type === "project") {
      const projects = await prisma.project.findMany({
        where: { id: { in: ids } },
        select: { id: true, uploadedById: true, title: true },
      });
      items = projects;

      await prisma.project.updateMany({
        where: { id: { in: ids } },
        data: {
          status,
          approvedById: session.user.id,
          approvedAt: now,
          rejectionReason: reason || null,
        },
      });
    }

    // Notify all uploaders
    const notifications = items.map((item) => ({
      userId: item.uploadedById,
      message:
        action === "approve"
          ? `Your ${type} "${item.title}" has been approved ✅`
          : `Your ${type} "${item.title}" was rejected. Reason: ${reason}`,
      type: (action === "approve" ? "approval" : "rejection") as
        | "approval"
        | "rejection",
    }));

    if (notifications.length > 0) {
      await prisma.notification.createMany({ data: notifications });
    }

    return NextResponse.json({
      success: true,
      message: `${ids.length} items ${status}`,
      count: ids.length,
    });
  } catch (error) {
    console.error("Bulk approve error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process bulk approval" },
      { status: 500 }
    );
  }
}