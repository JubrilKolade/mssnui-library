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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const department = searchParams.get("department") || "";
    const level = searchParams.get("level") || "";
    const semester = searchParams.get("semester") || "";
    const type = searchParams.get("type") || "";
    const skip = (page - 1) * limit;

    const where: any = {
      status: "approved",
      ...(search && {
        OR: [
          { courseCode: { contains: search, mode: "insensitive" } },
          { courseTitle: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(department && { departmentId: department }),
      ...(level && { level: parseInt(level) }),
      ...(semester && { semester }),
      ...(type && { type }),
    };

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          department: {
            include: {
              academicUnit: { select: { name: true } },
            },
          },
          uploadedBy: { select: { name: true } },
          _count: {
            select: { downloads: true, bookmarks: true, views: true },
          },
        },
        orderBy: [{ level: "asc" }, { courseCode: "asc" }],
        skip,
        take: limit,
      }),
      prisma.course.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: courses,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get courses error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}