import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { z } from "zod";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const schema = z.object({
  role: z.enum(["member", "contributor", "admin", "super_admin"]),
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
        { success: false, error: "Invalid role" },
        { status: 400 }
      );
    }

    // Prevent admins from creating super_admins
    if (
      validated.data.role === "super_admin" &&
      session.user.role !== "super_admin"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Only super admins can assign super admin role",
        },
        { status: 403 }
      );
    }

    // Prevent modifying super admin accounts
    const targetUser = await prisma.user.findUnique({
      where: { id: params.id },
      select: { role: true },
    });

    if (
      targetUser?.role === "super_admin" &&
      session.user.role !== "super_admin"
    ) {
      return NextResponse.json(
        { success: false, error: "Cannot modify super admin accounts" },
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