import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { z } from "zod";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const schema = z.object({
  isActive: z.boolean(),
});

export async function PATCH(
  req: NextRequest,
  context: RouteContext
) {
  const params = await context.params;
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
        { success: false, error: "Invalid data" },
        { status: 400 }
      );
    }

    // Prevent deactivating yourself
    if (params.id === session.user.id) {
      return NextResponse.json(
        { success: false, error: "Cannot deactivate your own account" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: { isActive: validated.data.isActive },
      select: { id: true, name: true, isActive: true },
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("Update status error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update status" },
      { status: 500 }
    );
  }
}