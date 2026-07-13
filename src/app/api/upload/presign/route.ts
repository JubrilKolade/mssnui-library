import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { generateUploadUrl, generateFileKey } from "@/src/lib/r2";
import { z } from "zod";

const schema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1),
  fileType: z.enum(["books", "courses", "projects", "covers"]),
  fileSize: z.number().max(50 * 1024 * 1024, "File must be under 50MB"),
});

const ALLOWED_FILE_TYPES = {
  "application/pdf": true,
  "image/jpeg": true,
  "image/png": true,
  "image/webp": true,
};

const MAX_PDF_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only contributors and above can upload
    if (session.user.role === "member") {
      return NextResponse.json(
        {
          success: false,
          error: "You need contributor access to upload",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validated = schema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: validated.error.issues[0].message,
        },
        { status: 400 }
      );
    }

    const { fileName, contentType, fileType, fileSize } = validated.data;

    // Validate content type
    if (!ALLOWED_FILE_TYPES[contentType as keyof typeof ALLOWED_FILE_TYPES]) {
      return NextResponse.json(
        {
          success: false,
          error: "File type not allowed. Only PDF and images accepted",
        },
        { status: 400 }
      );
    }

    // Validate file size
    const isImage = contentType.startsWith("image/");
    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_PDF_SIZE;

    if (fileSize > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: `File too large. Max ${isImage ? "5MB" : "50MB"}`,
        },
        { status: 400 }
      );
    }

    // Generate unique key
    const key = generateFileKey(fileType, fileName);

    // Generate presigned URL
    const uploadUrl = await generateUploadUrl(key, contentType);

    return NextResponse.json({
      success: true,
      data: {
        uploadUrl,
        key,
        publicUrl: `${process.env.R2_PUBLIC_URL}/${key}`,
      },
    });
  } catch (error) {
    console.error("Presign error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}