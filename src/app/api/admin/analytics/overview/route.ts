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

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );
    const lastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );
    const endOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0
    );

    const [
      totalUsers,
      newUsersThisMonth,
      newUsersLastMonth,
      totalBooks,
      totalCourses,
      totalProjects,
      pendingApprovals,
      totalDownloads,
      downloadsToday,
      downloadsThisWeek,
      downloadsThisMonth,
      totalViews,
      totalBookmarks,
      activeUsers,
    ] = await Promise.all([
      // Users
      prisma.user.count(),
      prisma.user.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: lastMonth,
            lte: endOfLastMonth,
          },
        },
      }),

      // Content
      prisma.book.count({ where: { status: "approved" } }),
      prisma.course.count({ where: { status: "approved" } }),
      prisma.project.count({ where: { status: "approved" } }),

      // Pending
      prisma.book
        .count({ where: { status: "pending" } })
        .then(async (books) => {
          const courses = await prisma.course.count({
            where: { status: "pending" },
          });
          const projects = await prisma.project.count({
            where: { status: "pending" },
          });
          return books + courses + projects;
        }),

      // Downloads
      prisma.download.count(),
      prisma.download.count({
        where: { downloadedAt: { gte: startOfToday } },
      }),
      prisma.download.count({
        where: { downloadedAt: { gte: startOfWeek } },
      }),
      prisma.download.count({
        where: { downloadedAt: { gte: startOfMonth } },
      }),

      // Views
      prisma.resourceView.count(),

      // Bookmarks
      prisma.bookmark.count(),

      // Active users (last 30 days)
      prisma.download
        .findMany({
          where: { downloadedAt: { gte: startOfMonth } },
          select: { userId: true },
          distinct: ["userId"],
        })
        .then((r) => r.length),
    ]);

    // Growth calculation
    const userGrowth =
      newUsersLastMonth > 0
        ? Math.round(
            ((newUsersThisMonth - newUsersLastMonth) /
              newUsersLastMonth) *
              100
          )
        : 100;

    return NextResponse.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          newThisMonth: newUsersThisMonth,
          growth: userGrowth,
          active: activeUsers,
        },
        content: {
          total: totalBooks + totalCourses + totalProjects,
          books: totalBooks,
          courses: totalCourses,
          projects: totalProjects,
          pending: pendingApprovals,
        },
        downloads: {
          total: totalDownloads,
          today: downloadsToday,
          thisWeek: downloadsThisWeek,
          thisMonth: downloadsThisMonth,
        },
        engagement: {
          views: totalViews,
          bookmarks: totalBookmarks,
        },
      },
    });
  } catch (error) {
    console.error("Analytics overview error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}