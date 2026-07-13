import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  academicUnitId: z.string(),
  isDLC: z.boolean().default(false),
  isPostgraduate: z.boolean().default(false),
});

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

    // Check duplicate
    const existing = await prisma.department.findFirst({
      where: {
        name: validated.data.name,
        academicUnitId: validated.data.academicUnitId,
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: "Department already exists in this unit",
        },
        { status: 409 }
      );
    }

    const department = await prisma.department.create({
      data: validated.data,
    });

    return NextResponse.json(
      { success: true, data: department },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create department error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create department" },
      { status: 500 }
    );
  }
}