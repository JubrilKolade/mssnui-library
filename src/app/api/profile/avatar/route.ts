import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { z } from "zod";

const schema = z.object({
  avatarUrl: z.string().url(),
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
        { success: false, error: "Invalid avatar URL" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { avatar: validated.data.avatarUrl },
      select: { id: true, avatar: true },
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("Avatar update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update avatar" },
      { status: 500 }
    );
  }
}