import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { resetPasswordSchema } from "@/src/lib/validations";
import { rateLimit, getClientIp } from "@/src/lib/rate-limit";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limit = rateLimit(`reset-password:${ip}`, {
      windowMs: 15 * 60 * 1000,
      maxRequests: 10,
    });

    if (!limit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests. Please try again later.",
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validated = resetPasswordSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const { token, password } = validated.data;
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: { select: { id: true, password: true } } },
    });

    if (
      !resetToken ||
      resetToken.usedAt ||
      resetToken.expires < new Date() ||
      !resetToken.user.password
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This reset link is invalid or has expired. Please request a new one.",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
      // Invalidate any other outstanding tokens for this user
      prisma.passwordResetToken.deleteMany({
        where: { userId: resetToken.userId, usedAt: null },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
