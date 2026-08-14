import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
});

export async function PATCH(
  req: NextRequest,
  context: any
) {
  const params = await Promise.resolve(context.params);
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

    const body = await req.json();
    const validated = schema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const category = await prisma.category.update({
      where: { id: params.id },
      data: validated.data,
    });

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error("Update category error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: any
) {
  const params = await Promise.resolve(context.params);
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

    // Check if category has books
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: { books: { take: 1 } },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    if (category.books.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete category with existing books",
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id: params.id } });

    return NextResponse.json({
      success: true,
      message: "Category deleted",
    });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete category" },
      { status: 500 }
    );
  }
}