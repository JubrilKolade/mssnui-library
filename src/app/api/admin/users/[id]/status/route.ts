import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { canToggleActive } from "@/src/lib/permissions";
import { z } from "zod";
import type { Role } from "@/types";

const schema = z.object({
  isActive: z.boolean(),
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
        { success: false, error: "Invalid data" },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: params.id },
      select: { role: true },
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const check = canToggleActive(
      session.user.role as Role,
      targetUser.role as Role,
      { isSelf: params.id === session.user.id }
    );

    if (!check.allowed) {
      return NextResponse.json(
        { success: false, error: check.reason },
        { status: 403 }
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