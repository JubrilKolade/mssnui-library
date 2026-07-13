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

interface BookCardProps {
  book: any;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/books/${book.id}`}>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md hover:border-slate-300 transition-all group">
        {/* Cover Image */}
        <div className="relative h-44 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center overflow-hidden">
          {book.coverImageUrl ? (
            <Image
              src={book.coverImageUrl}
              alt={book.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <BookOpen className="w-12 h-12 text-blue-300" />
          )}

          {/* Category Badge */}
          {book.category && (
            <div className="absolute top-2 left-2">
              <Badge className="text-xs bg-white/90 text-slate-700 hover:bg-white/90">
                {book.category.name}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
            {book.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 truncate">
            {book.author}
          </p>

          {/* Department */}
          {book.department && (
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {book.department.name}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100">
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Download className="w-3 h-3" />
              {book._count.downloads}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Bookmark className="w-3 h-3" />
              {book._count.bookmarks}
            </span>
            {book.pages && (
              <span className="text-xs text-slate-400">
                {book.pages} pages
              </span>
            )}
            <span className="ml-auto text-xs text-slate-400">
              {formatFileSize(book.fileSize)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}