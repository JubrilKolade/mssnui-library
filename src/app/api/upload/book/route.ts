import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { bookUploadSchema } from "@/src/lib/validations";
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
    const validated = bookUploadSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const {
      title,
      author,
      description,
      categoryId,
      departmentId,
      language,
      publishedYear,
      pages,
      fileKey,
      coverKey,
      fileSize,
    } = validated.data;

    const book = await prisma.book.create({
      data: {
        title,
        author,
        description,
        categoryId: categoryId || null,
        departmentId: departmentId || null,
        language,
        publishedYear: publishedYear || null,
        pages: pages || null,
        fileUrl: getPublicUrl(fileKey),
        coverImageUrl: coverKey ? getPublicUrl(coverKey) : null,
        fileSize,
        uploadedById: session.user.id,
        status: "pending",
      },
    });

    // Notify admins about new upload
    await notifyAdmins(
      `New book uploaded: "${title}" by ${session.user.name}`,
      "new_upload"
    );

    return NextResponse.json(
      { success: true, data: book },
      { status: 201 }
    );
  } catch (error) {
    console.error("Book upload error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload book" },
      { status: 500 }
    );
  }
}

async function notifyAdmins(message: string, type: "new_upload") {
  const admins = await prisma.user.findMany({
    where: {
      role: { in: ["admin", "super_admin"] },
      isActive: true,
    },
    select: { id: true },
  });

  await prisma.notification.createMany({
    data: admins.map((admin) => ({
      userId: admin.id,
      message,
      type,
    })),
  });
}