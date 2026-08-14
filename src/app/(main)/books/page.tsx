// src/app/(main)/books/page.tsx

import { prisma } from "@/src/lib/prisma";
import { BooksGrid } from "@/src/components/books/BooksGrid";
import { BooksFilter } from "@/src/components/books/BooksFilter";
import { Suspense } from "react";
import { BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Books — MSSN UI Library",
};

interface BooksPageProps {
  searchParams: Promise<{
    category?: string;
    department?: string;
    search?: string;
    page?: string;
    language?: string;
    year?: string;
  }>;
}

async function getBooks(searchParams: Awaited<BooksPageProps["searchParams"]>) {
  const page = parseInt(searchParams.page || "1");
  const limit = 12;
  const skip = (page - 1) * limit;

  const where: any = {
    status: "approved",
    ...(searchParams.search && {
      OR: [
        { title: { contains: searchParams.search, mode: "insensitive" } },
        { author: { contains: searchParams.search, mode: "insensitive" } },
        { description: { contains: searchParams.search, mode: "insensitive" } },
      ],
    }),
    ...(searchParams.category && { categoryId: searchParams.category }),
    ...(searchParams.department && { departmentId: searchParams.department }),
    ...(searchParams.language && { language: searchParams.language }),
    ...(searchParams.year && { publishedYear: parseInt(searchParams.year) }),
  };

  const [books, total, categories, departments] = await Promise.all([
    prisma.book.findMany({
      where,
      include: {
        category: { select: { id: true, name: true } },
        department: {
          select: {
            id: true,
            name: true,
            academicUnit: { select: { name: true } },
          },
        },
        uploadedBy: { select: { name: true } },
        _count: {
          select: { downloads: true, bookmarks: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.book.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.department.findMany({
      orderBy: { name: "asc" },
      include: {
        academicUnit: { select: { name: true } },
      },
    }),
  ]);

  return {
    books,
    total,
    categories,
    departments,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export default async function BooksPage({
  searchParams,
}: BooksPageProps) {
  const resolvedSearchParams = await searchParams;
  const data = await getBooks(resolvedSearchParams);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Books
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {data.total.toLocaleString()} books available
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <BooksFilter
            categories={data.categories}
            departments={data.departments}
            searchParams={resolvedSearchParams}
          />
        </aside>

        {/* Books Grid */}
        <div className="flex-1 min-w-0">
          <Suspense fallback={<BooksGridSkeleton />}>
            <BooksGrid
              books={data.books}
              page={data.page}
              totalPages={data.totalPages}
              total={data.total}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function BooksGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-card rounded-2xl border border-border p-4 animate-pulse"
        >
          <div className="w-full h-40 bg-muted rounded-lg mb-4" />
          <div className="h-4 bg-muted rounded w-3/4 mb-2" />
          <div className="h-3 bg-muted rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}