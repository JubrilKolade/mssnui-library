import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
});

// PATCH update unit
export async function PATCH(
  req: NextRequest,
  context: any
) {
  const params = await Promise.resolve(context.params);
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

    const unit = await prisma.academicUnit.update({
      where: { id: params.id },
      data: validated.data,
    });

    return NextResponse.json({ success: true, data: unit });
  } catch (error) {
    console.error("Update unit error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update unit" },
      { status: 500 }
    );
  }
}

// DELETE unit
export async function DELETE(
  req: NextRequest,
  context: any
) {
  const params = await Promise.resolve(context.params);
  try {
    const session = await auth();
    if (!session || session.user.role !== "super_admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if unit has content
    const unit = await prisma.academicUnit.findUnique({
      where: { id: params.id },
      include: {
        departments: {
          include: {
            books: { take: 1 },
            courses: { take: 1 },
            projects: { take: 1 },
          },
        },
      },
    });

    if (!unit) {
      return NextResponse.json(
        { success: false, error: "Unit not found" },
        { status: 404 }
      );
    }

    // Check if any department has content
    const hasContent = unit.departments.some(
      (dept) =>
        dept.books.length > 0 ||
        dept.courses.length > 0 ||
        dept.projects.length > 0
    );

    if (hasContent) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Cannot delete unit with existing content. Remove all books, courses and projects first.",
        },
        { status: 400 }
      );
    }

    await prisma.academicUnit.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Unit deleted successfully",
    });
  } catch (error) {
    console.error("Delete unit error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete unit" },
      { status: 500 }
    );
  }
}