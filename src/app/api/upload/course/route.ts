import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { courseUploadSchema } from "@/src/lib/validations";
import { getPublicUrl } from "@/src/lib/r2";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role === "member") {
      return NextResponse.json(
        { success: false, error: "Contributor access required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validated = courseUploadSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const {
      courseCode,
      courseTitle,
      departmentId,
      level,
      semester,
      type,
      fileKey,
      coverKey,
      fileSize,
    } = validated.data;

    // Check for duplicate
    const existing = await prisma.course.findFirst({
      where: {
        courseCode,
        departmentId,
        semester,
        type,
      },
    });

    if (existing && existing.status === "approved") {
      return NextResponse.json(
        {
          success: false,
          error:
            "This course material already exists. Consider uploading a different type or semester.",
        },
        { status: 409 }
      );
    }

    const course = await prisma.course.create({
      data: {
        courseCode,
        courseTitle,
        departmentId,
        level,
        semester,
        type,
        fileUrl: getPublicUrl(fileKey),
        coverImageUrl: coverKey ? getPublicUrl(coverKey) : null,
        fileSize,
        uploadedById: session.user.id,
        status: "pending",
      },
    });

    // Notify admins
    await prisma.user
      .findMany({
        where: { role: { in: ["admin", "super_admin"] }, isActive: true },
        select: { id: true },
      })
      .then((admins) =>
        prisma.notification.createMany({
          data: admins.map((a) => ({
            userId: a.id,
            message: `New course uploaded: "${courseCode} - ${courseTitle}"`,
            type: "new_upload" as const,
          })),
        })
      );

    return NextResponse.json(
      { success: true, data: course },
      { status: 201 }
    );
  } catch (error) {
    console.error("Course upload error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload course" },
      { status: 500 }
    );
  }
}