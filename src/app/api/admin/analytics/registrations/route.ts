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
    const months = parseInt(searchParams.get("months") || "6");

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const users = await prisma.user.findMany({
      where: { createdAt: { gte: startDate } },
      select: {
        createdAt: true,
        role: true,
      },
      orderBy: { createdAt: "asc" },
    });

    // Group by month
    const grouped: Record<
      string,
      {
        month: string;
        total: number;
        member: number;
        contributor: number;
      }
    > = {};

    // Pre-fill months
    for (let i = months; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      grouped[key] = {
        month: key,
        total: 0,
        member: 0,
        contributor: 0,
      };
    }

    users.forEach((u) => {
      const key = `${u.createdAt.getFullYear()}-${String(
        u.createdAt.getMonth() + 1
      ).padStart(2, "0")}`;
      if (grouped[key]) {
        grouped[key].total++;
        if (u.role === "member") grouped[key].member++;
        if (u.role === "contributor") grouped[key].contributor++;
      }
    });

    return NextResponse.json({
      success: true,
      data: Object.values(grouped),
    });
  } catch (error) {
    console.error("Registrations analytics error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch registration data" },
      { status: 500 }
    );
  }
}