import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { canChangeRole } from "@/src/lib/permissions";
import { z } from "zod";
import type { Role } from "@/types";

const schema = z.object({
  role: z.enum(["member", "contributor", "admin", "super_admin"]),
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
        { success: false, error: "Invalid role" },
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

    const check = canChangeRole(
      session.user.role as Role,
      targetUser.role as Role,
      validated.data.role,
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
      data: { role: validated.data.role },
      select: { id: true, name: true, role: true },
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("Update role error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update role" },
      { status: 500 }
    );
  }
}
