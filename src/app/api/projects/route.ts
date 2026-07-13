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
    const year = searchParams.get("year") || "";
    const skip = (page - 1) * limit;

    const where: any = {
      status: "approved",
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { authorName: { contains: search, mode: "insensitive" } },
          { abstract: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(department && { departmentId: department }),
      ...(year && { year: parseInt(year) }),
    };

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
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
        orderBy: [{ year: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.project.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: projects,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get projects error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}