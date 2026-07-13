import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export async function GET() {
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

    const [
      recentDownloads,
      recentRegistrations,
      recentUploads,
    ] = await Promise.all([
      // Recent downloads
      prisma.download.findMany({
        take: 8,
        orderBy: { downloadedAt: "desc" },
        include: {
          user: { select: { name: true, avatar: true } },
          book: { select: { title: true } },
          course: {
            select: { courseCode: true, courseTitle: true },
          },
          project: { select: { title: true } },
        },
      }),

      // Recent registrations
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          role: true,
          createdAt: true,
        },
      }),

      // Recent uploads (pending)
      Promise.all([
        prisma.book.findMany({
          where: { status: "pending" },
          take: 3,
          orderBy: { createdAt: "desc" },
          include: {
            uploadedBy: { select: { name: true } },
          },
        }),
        prisma.course.findMany({
          where: { status: "pending" },
          take: 3,
          orderBy: { createdAt: "desc" },
          include: {
            uploadedBy: { select: { name: true } },
          },
        }),
        prisma.project.findMany({
          where: { status: "pending" },
          take: 3,
          orderBy: { createdAt: "desc" },
          include: {
            uploadedBy: { select: { name: true } },
          },
        }),
      ]).then(([books, courses, projects]) => {
        const all = [
          ...books.map((b) => ({
            id: b.id,
            title: b.title,
            type: "book",
            uploadedBy: b.uploadedBy.name,
            createdAt: b.createdAt,
          })),
          ...courses.map((c) => ({
            id: c.id,
            title: `${c.courseCode} — ${c.courseTitle}`,
            type: "course",
            uploadedBy: c.uploadedBy.name,
            createdAt: c.createdAt,
          })),
          ...projects.map((p) => ({
            id: p.id,
            title: p.title,
            type: "project",
            uploadedBy: p.uploadedBy.name,
            createdAt: p.createdAt,
          })),
        ];
        return all
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          )
          .slice(0, 8);
      }),
    ]);

    // Format downloads
    const formattedDownloads = recentDownloads.map((d) => ({
      id: d.id,
      user: d.user,
      resourceType: d.resourceType,
      resourceTitle:
        d.book?.title ||
        (d.course
          ? `${d.course.courseCode} — ${d.course.courseTitle}`
          : null) ||
        d.project?.title ||
        "Unknown",
      downloadedAt: d.downloadedAt,
    }));

    return NextResponse.json({
      success: true,
      data: {
        recentDownloads: formattedDownloads,
        recentRegistrations,
        recentUploads,
      },
    });
  } catch (error) {
    console.error("Activity analytics error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch activity data" },
      { status: 500 }
    );
  }
}