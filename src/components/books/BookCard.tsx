"use client";

import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Download,
  Bookmark,
  BookMarked,
} from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { formatFileSize } from "@/src/lib/utils";
import { cn } from "@/src/lib/utils";
import type { Book } from "@/types";

type BookCardBook = Pick<Book, "id" | "title" | "author" | "fileSize"> & {
  coverImageUrl?: string | null;
  pages?: number | null;
  category?: { name: string } | null;
  department?: { name: string } | null;
  _count: { downloads: number; bookmarks: number };
};

interface BookCardProps {
  book: BookCardBook;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/books/${book.id}`}>
      <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md hover:border-border transition-all group">
        {/* Cover Image */}
        <div className="relative h-44 bg-linear-to-br from-primary/10 to-accent flex items-center justify-center overflow-hidden">
          {book.coverImageUrl ? (
            <Image
              src={book.coverImageUrl}
              alt={book.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <BookOpen className="w-12 h-12 text-primary/40" />
          )}

          {/* Category Badge */}
          {book.category && (
            <div className="absolute top-2 left-2">
              <Badge className="text-xs bg-background/90 text-primary hover:bg-background/90">
                {book.category.name}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 truncate">
            {book.author}
          </p>

          {/* Department */}
          {book.department && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {book.department.name}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Download className="w-3 h-3" />
              {book._count.downloads}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Bookmark className="w-3 h-3" />
              {book._count.bookmarks}
            </span>
            {book.pages && (
              <span className="text-xs text-muted-foreground">
                {book.pages} pages
              </span>
            )}
            <span className="ml-auto text-xs text-muted-foreground">
              {formatFileSize(book.fileSize)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}