"use client";

import { BookCard } from "./BookCard";
import { Pagination } from "@/src/components/shared/Pagination";
import { BookOpen } from "lucide-react";

interface BooksGridProps {
  books: any[];
  page: number;
  totalPages: number;
  total: number;
}

export function BooksGrid({
  books,
  page,
  totalPages,
  total,
}: BooksGridProps) {
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <BookOpen className="w-12 h-12 mb-3 opacity-40" />
        <p className="font-medium">No books found</p>
        <p className="text-sm mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
        />
      )}
    </div>
  );
}