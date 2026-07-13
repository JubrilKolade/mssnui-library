import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { projectUploadSchema } from "@/src/lib/validations";
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
    const validated = projectUploadSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const {
      title,
      authorName,
      departmentId,
      year,
      supervisor,
      abstract,
      fileKey,
      coverKey,
      fileSize,
    } = validated.data;

    const project = await prisma.project.create({
      data: {
        title,
        authorName,
        departmentId,
        year,
        supervisor: supervisor || null,
        abstract: abstract || null,
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
            message: `New project uploaded: "${title}" by ${authorName}`,
            type: "new_upload" as const,
          })),
        })
      );

    return NextResponse.json(
      { success: true, data: project },
      { status: 201 }
    );
  } catch (error) {
    console.error("Project upload error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload project" },
      { status: 500 }
    );
  }
}