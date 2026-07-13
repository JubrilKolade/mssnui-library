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
      booksByCategory,
      contentByType,
      usersByRole,
      coursesByLevel,
      approvalStats,
    ] = await Promise.all([
      // Books by category
      prisma.category.findMany({
        include: {
          _count: {
            select: { books: true },
          },
        },
        orderBy: {
          books: { _count: "desc" },
        },
      }),

      // Content by type
      Promise.all([
        prisma.book.count({ where: { status: "approved" } }),
        prisma.course.count({ where: { status: "approved" } }),
        prisma.project.count({ where: { status: "approved" } }),
      ]).then(([books, courses, projects]) => [
        { name: "Books", value: books, color: "#3b82f6" },
        { name: "Courses", value: courses, color: "#a855f7" },
        { name: "Projects", value: projects, color: "#f97316" },
      ]),

      // Users by role
      Promise.all([
        prisma.user.count({ where: { role: "member" } }),
        prisma.user.count({ where: { role: "contributor" } }),
        prisma.user.count({ where: { role: "admin" } }),
        prisma.user.count({ where: { role: "super_admin" } }),
      ]).then(([members, contributors, admins, superAdmins]) => [
        { name: "Members", value: members, color: "#64748b" },
        { name: "Contributors", value: contributors, color: "#3b82f6" },
        { name: "Admins", value: admins, color: "#a855f7" },
        { name: "Super Admins", value: superAdmins, color: "#22c55e" },
      ]),

      // Courses by level
      Promise.all(
        [100, 200, 300, 400, 500, 600].map((level) =>
          prisma.course
            .count({ where: { level, status: "approved" } })
            .then((count) => ({ level: `${level}L`, count }))
        )
      ),

      // Approval stats
      Promise.all([
        prisma.book.count({ where: { status: "approved" } }),
        prisma.book.count({ where: { status: "pending" } }),
        prisma.book.count({ where: { status: "rejected" } }),
        prisma.course.count({ where: { status: "approved" } }),
        prisma.course.count({ where: { status: "pending" } }),
        prisma.course.count({ where: { status: "rejected" } }),
        prisma.project.count({ where: { status: "approved" } }),
        prisma.project.count({ where: { status: "pending" } }),
        prisma.project.count({ where: { status: "rejected" } }),
      ]).then(
        ([
          bA, bP, bR,
          cA, cP, cR,
          pA, pP, pR,
        ]) => ({
          approved: bA + cA + pA,
          pending: bP + cP + pP,
          rejected: bR + cR + pR,
        })
      ),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        booksByCategory: booksByCategory
          .filter((c) => c._count.books > 0)
          .map((c) => ({
            name: c.name,
            value: c._count.books,
          })),
        contentByType,
        usersByRole,
        coursesByLevel,
        approvalStats,
      },
    });
  } catch (error) {
    console.error("Distribution analytics error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch distribution data" },
      { status: 500 }
    );
  }
}