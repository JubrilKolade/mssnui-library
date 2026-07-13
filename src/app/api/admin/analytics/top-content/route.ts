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
      topBooks,
      topCourses,
      topProjects,
      mostViewedBooks,
      topContributors,
    ] = await Promise.all([
      // Most downloaded books
      prisma.book.findMany({
        where: { status: "approved" },
        include: {
          _count: {
            select: { downloads: true, views: true, bookmarks: true },
          },
          category: { select: { name: true } },
        },
        orderBy: {
          downloads: { _count: "desc" },
        },
        take: 5,
      }),

      // Most downloaded courses
      prisma.course.findMany({
        where: { status: "approved" },
        include: {
          _count: {
            select: { downloads: true, views: true },
          },
          department: { select: { name: true } },
        },
        orderBy: {
          downloads: { _count: "desc" },
        },
        take: 5,
      }),

      // Most downloaded projects
      prisma.project.findMany({
        where: { status: "approved" },
        include: {
          _count: {
            select: { downloads: true, views: true },
          },
          department: { select: { name: true } },
        },
        orderBy: {
          downloads: { _count: "desc" },
        },
        take: 5,
      }),

      // Most viewed books
      prisma.book.findMany({
        where: { status: "approved" },
        include: {
          _count: {
            select: { views: true, downloads: true },
          },
        },
        orderBy: {
          views: { _count: "desc" },
        },
        take: 5,
      }),

      // Top contributors
      prisma.user.findMany({
        where: {
          role: { in: ["contributor", "admin", "super_admin"] },
        },
        include: {
          _count: {
            select: {
              uploadedBooks: true,
              uploadedCourses: true,
              uploadedProjects: true,
            },
          },
        },
        orderBy: {
          uploadedBooks: { _count: "desc" },
        },
        take: 5,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        topBooks,
        topCourses,
        topProjects,
        mostViewedBooks,
        topContributors,
      },
    });
  } catch (error) {
    console.error("Top content analytics error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch top content" },
      { status: 500 }
    );
  }
}