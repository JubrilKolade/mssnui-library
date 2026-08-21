import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import {
  isGlobalDownloadPaused,
  setGlobalDownloadPaused,
} from "@/src/lib/settings";
import { z } from "zod";

const patchSchema = z.object({
  paused: z.boolean(),
});

export async function GET() {
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

    return NextResponse.json({
      success: true,
      data: { paused: await isGlobalDownloadPaused() },
    });
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
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
    const validated = patchSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Invalid data" },
        { status: 400 }
      );
    }

    await setGlobalDownloadPaused(validated.data.paused);

    return NextResponse.json({
      success: true,
      message: validated.data.paused
        ? "Downloads paused for all content"
        : "Downloads resumed for all content",
      data: { paused: validated.data.paused },
    });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
