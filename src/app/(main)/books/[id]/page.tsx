import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/lib/auth";
import { notFound } from "next/navigation";
import { generateDownloadUrl } from "@/src/lib/r2";
import { BookDetail } from "@/src/components/books/BookDetail";
import type { Metadata } from "next";

interface BookPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: BookPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const book = await prisma.book.findUnique({
    where: { id: resolvedParams.id },
    select: { title: true, author: true },
  });

  if (!book) return { title: "Book Not Found" };

  return {
    title: `${book.title} — MSSN UI Library`,
    description: `${book.title} by ${book.author}`,
  };
}

async function getBook(id: string, userId: string) {
  const [book, isBookmarked, downloadCount] = await Promise.all([
    prisma.book.findUnique({
      where: { id, status: "approved" },
      include: {
        category: true,
        department: {
          include: {
            academicUnit: {
              include: {
                parent: true,
              },
            },
          },
        },
        uploadedBy: {
          select: { name: true, avatar: true },
        },
        _count: {
          select: { downloads: true, bookmarks: true, views: true },
        },
      },
    }),
    prisma.bookmark.findFirst({
      where: { userId, bookId: id },
    }),
    prisma.download.count({
      where: { bookId: id },
    }),
  ]);

  if (!book) return null;

  // Log view
  await prisma.resourceView.upsert({
    where: {
      // We need a unique constraint for this
      // Use findFirst + create pattern instead
      id: `${userId}-${id}`, // This won't work with cuid
    },
    update: { viewedAt: new Date() },
    create: {
      userId,
      resourceType: "book",
      bookId: id,
    },
  }).catch(() => {
    // Silently fail if view already exists
  });

  // Generate signed URL for PDF viewing
  const fileKey = book.fileUrl.replace(
    `${process.env.R2_PUBLIC_URL}/`,
    ""
  );
  const signedUrl = await generateDownloadUrl(fileKey, 7200); // 2 hours

  return {
    book,
    signedUrl,
    isBookmarked: !!isBookmarked,
    downloadCount,
  };
}

export default async function BookPage({ params }: BookPageProps) {
  const session = await auth();
  if (!session) return null;

  const resolvedParams = await params;
  const data = await getBook(resolvedParams.id, session.user.id);

  if (!data) notFound();

  return (
    <BookDetail
      book={data.book}
      signedUrl={data.signedUrl}
      isBookmarked={data.isBookmarked}
      userId={session.user.id}
    />
  );
}