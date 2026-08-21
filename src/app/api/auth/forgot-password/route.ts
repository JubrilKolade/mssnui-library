import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { forgotPasswordSchema } from "@/src/lib/validations";
import { rateLimit, getClientIp } from "@/src/lib/rate-limit";
import { sendEmail, passwordResetEmail } from "@/src/lib/mail";
import crypto from "crypto";

const TOKEN_TTL_MS = 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limit = rateLimit(`forgot-password:${ip}`, {
      windowMs: 15 * 60 * 1000,
      maxRequests: 5,
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
    const validated = forgotPasswordSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email } = validated.data;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, name: true, password: true },
    });

    // Only issue a token for accounts that actually use a password
    // (Google-only accounts have nothing to reset). The response stays
    // identical either way so accounts can't be enumerated.
    if (user?.password) {
      await prisma.passwordResetToken.deleteMany({
        where: { userId: user.id, usedAt: null },
      });

      const token = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      await prisma.passwordResetToken.create({
        data: {
          tokenHash,
          userId: user.id,
          expires: new Date(Date.now() + TOKEN_TTL_MS),
        },
      });

      const origin =
        process.env.NEXT_PUBLIC_APP_URL ||
        process.env.AUTH_URL ||
        req.nextUrl.origin;
      const resetUrl = `${origin}/reset-password?token=${token}`;

      const { subject, html } = passwordResetEmail(user.name, resetUrl);
      const { sent } = await sendEmail({
        to: normalizedEmail,
        subject,
        html,
      });

      if (!sent) {
        console.warn(
          `[forgot-password] Email delivery failed for ${normalizedEmail}. Reset URL (dev only): ${resetUrl}`
        );
      }
    }

    return NextResponse.json({
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
