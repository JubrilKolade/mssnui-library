import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET() {
  try {
    const units = await prisma.academicUnit.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            departments: {
              select: { id: true, name: true },
              orderBy: { name: "asc" },
            },
          },
          orderBy: { name: "asc" },
        },
        departments: {
          select: { id: true, name: true },
          orderBy: { name: "asc" },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, data: units });
  } catch (error) {
    console.error("Fetch units error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch academic units" },
      { status: 500 }
    );
  }
}