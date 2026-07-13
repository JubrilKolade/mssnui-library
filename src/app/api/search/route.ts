import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "all";

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        data: { books: [], courses: [], projects: [] },
      });
    }

    const searchFilter = {
      contains: query,
      mode: "insensitive" as const,
    };

    const [books, courses, projects] = await Promise.all([
      type === "all" || type === "books"
        ? prisma.book.findMany({
            where: {
              status: "approved",
              OR: [
                { title: searchFilter },
                { author: searchFilter },
                { description: searchFilter },
              ],
            },
            include: {
              category: { select: { id: true, name: true } },
              department: {
                select: {
                  id: true,
                  name: true,
                  academicUnit: { select: { name: true } },
                },
              },
              uploadedBy: { select: { name: true } },
              _count: {
                select: { downloads: true, bookmarks: true },
              },
            },
            take: 10,
          })
        : [],

      type === "all" || type === "courses"
        ? prisma.course.findMany({
            where: {
              status: "approved",
              OR: [
                { courseCode: searchFilter },
                { courseTitle: searchFilter },
              ],
            },
            include: {
              department: {
                include: {
                  academicUnit: { select: { name: true } },
                },
              },
              uploadedBy: { select: { name: true } },
              _count: {
                select: { downloads: true, bookmarks: true },
              },
            },
            take: 10,
          })
        : [],

      type === "all" || type === "projects"
        ? prisma.project.findMany({
            where: {
              status: "approved",
              OR: [
                { title: searchFilter },
                { authorName: searchFilter },
                { abstract: searchFilter },
              ],
            },
            include: {
              department: {
                include: {
                  academicUnit: { select: { name: true } },
                },
              },
              uploadedBy: { select: { name: true } },
              _count: {
                select: { downloads: true, bookmarks: true },
              },
            },
            take: 10,
          })
        : [],
    ]);

    return NextResponse.json({
      success: true,
      data: { books, courses, projects },
      query,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { success: false, error: "Search failed" },
      { status: 500 }
    );
  }
}