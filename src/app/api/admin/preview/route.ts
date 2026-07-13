import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { generateDownloadUrl } from "@/src/lib/r2";

export async function POST(req: NextRequest) {
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

    const { fileUrl } = await req.json();

    if (!fileUrl) {
      return NextResponse.json(
        { success: false, error: "File URL required" },
        { status: 400 }
      );
    }

    // Extract key from URL
    const key = fileUrl.replace(
      `${process.env.R2_PUBLIC_URL}/`,
      ""
    );

    // Generate signed URL for viewing
    const signedUrl = await generateDownloadUrl(key, 3600);

    return NextResponse.json({
      success: true,
      data: { signedUrl },
    });
  } catch (error) {
    console.error("Preview error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate preview URL" },
      { status: 500 }
    );
  }
}