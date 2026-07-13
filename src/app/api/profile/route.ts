import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2).max(100),
  matricNumber: z.string().optional(),
  departmentId: z.string().optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
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

    const { name, matricNumber, departmentId } = validated.data;

    // Check matric number uniqueness
    if (matricNumber) {
      const existing = await prisma.user.findFirst({
        where: {
          matricNumber,
          id: { not: session.user.id },
        },
      });

      if (existing) {
        return NextResponse.json(
          {
            success: false,
            error: "Matric number already in use",
          },
          { status: 409 }
        );
      }
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        matricNumber: matricNumber || null,
        departmentId: departmentId || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        matricNumber: true,
        departmentId: true,
        role: true,
        avatar: true,
      },
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    );
  }
}