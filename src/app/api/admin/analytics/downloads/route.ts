import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || "30");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get downloads grouped by day
    const downloads = await prisma.download.findMany({
      where: { downloadedAt: { gte: startDate } },
      select: {
        downloadedAt: true,
        resourceType: true,
      },
      orderBy: { downloadedAt: "asc" },
    });

    // Group by date
    const grouped: Record<
      string,
      { date: string; total: number; book: number; course: number; project: number }
    > = {};

    // Pre-fill all dates
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split("T")[0];
      grouped[key] = {
        date: key,
        total: 0,
        book: 0,
        course: 0,
        project: 0,
      };
    }

    // Fill with actual data
    downloads.forEach((d) => {
      const key = d.downloadedAt.toISOString().split("T")[0];
      if (grouped[key]) {
        grouped[key].total++;
        grouped[key][d.resourceType as "book" | "course" | "project"]++;
      }
    });

    return NextResponse.json({
      success: true,
      data: Object.values(grouped),
    });
  } catch (error) {
    console.error("Downloads analytics error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch downloads data" },
      { status: 500 }
    );
  }
}