import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  type: z.enum(["college", "faculty", "institute", "centre", "school"]),
  parentId: z.string().nullable().optional(),
  description: z.string().optional(),
});

// GET all units
export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "super_admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const units = await prisma.academicUnit.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: {
              include: {
                departments: { orderBy: { name: "asc" } },
              },
              orderBy: { name: "asc" },
            },
            departments: { orderBy: { name: "asc" } },
          },
          orderBy: { name: "asc" },
        },
        departments: { orderBy: { name: "asc" } },
      },
      orderBy: [{ type: "asc" }, { name: "asc" }],
    });

    return NextResponse.json({ success: true, data: units });
  } catch (error) {
    console.error("Get units error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch units" },
      { status: 500 }
    );
  }
}

// POST create unit
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "super_admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = schema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, type, parentId, description } = validated.data;

    // Check duplicate
    const existing = await prisma.academicUnit.findFirst({
      where: {
        name,
        parentId: parentId || null,
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "A unit with this name already exists" },
        { status: 409 }
      );
    }

    const unit = await prisma.academicUnit.create({
      data: {
        name,
        type,
        parentId: parentId || null,
        description,
      },
    });

    return NextResponse.json(
      { success: true, data: unit },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create unit error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create unit" },
      { status: 500 }
    );
  }
}