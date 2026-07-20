import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { z } from "zod";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const schema = z.object({
  name: z.string().min(2).optional(),
  isDLC: z.boolean().optional(),
  isPostgraduate: z.boolean().optional(),
});

export async function PATCH(
  req: NextRequest,
  context: RouteContext
) {
  const params = await context.params;
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

    const department = await prisma.department.update({
      where: { id: params.id },
      data: validated.data,
    });

    return NextResponse.json({ success: true, data: department });
  } catch (error) {
    console.error("Update department error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update department" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: RouteContext
) {
  const params = await context.params;
  try {
    const session = await auth();
    if (!session || session.user.role !== "super_admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check for content
    const dept = await prisma.department.findUnique({
      where: { id: params.id },
      include: {
        books: { take: 1 },
        courses: { take: 1 },
        projects: { take: 1 },
        users: { take: 1 },
      },
    });

    if (!dept) {
      return NextResponse.json(
        { success: false, error: "Department not found" },
        { status: 404 }
      );
    }

    const hasContent =
      dept.books.length > 0 ||
      dept.courses.length > 0 ||
      dept.projects.length > 0;

    if (hasContent) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Cannot delete department with existing content",
        },
        { status: 400 }
      );
    }

    await prisma.department.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Department deleted",
    });
  } catch (error) {
    console.error("Delete department error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete department" },
      { status: 500 }
    );
  }
}