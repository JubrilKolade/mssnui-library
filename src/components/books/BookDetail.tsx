"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Download,
  Bookmark,
  BookMarked,
  ChevronLeft,
  Calendar,
  Globe,
  Hash,
  Building2,
  User,
  Eye,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";
import { PDFViewer } from "@/src/components/shared/PDFViewer";
import { formatDate, formatFileSize } from "@/src/lib/utils";
import { useToast } from "@/src/hooks/use-toast";

interface BookDetailProps {
  book: any;
  signedUrl: string;
  isBookmarked: boolean;
  userId: string;
}

export function BookDetail({
  book,
  signedUrl,
  isBookmarked: initialIsBookmarked,
  userId,
}: BookDetailProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPDF, setShowPDF] = useState(false);
  const { toast } = useToast();

  async function handleBookmark() {
    try {
      setIsBookmarking(true);
      const res = await fetch("/api/bookmarks", {
        method: isBookmarked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceType: "book",
          resourceId: book.id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsBookmarked(!isBookmarked);
        toast({
          title: isBookmarked
            ? "Removed from bookmarks"
            : "Added to bookmarks",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Something went wrong",
      });
    } finally {
      setIsBookmarking(false);
    }
  }

  async function handleDownload() {
    try {
      setIsDownloading(true);

      // Log download
      await fetch("/api/downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceType: "book",
          resourceId: book.id,
        }),
      });

      // Trigger download
      const link = document.createElement("a");
      link.href = signedUrl;
      link.download = `${book.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({ title: "Download started" });
    } catch {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Please try again",
      });
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/books"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Books
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Book Info */}
        <div className="lg:col-span-1 space-y-4">
          {/* Cover */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="relative h-64 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
              {book.coverImageUrl ? (
                <Image
                  src={book.coverImageUrl}
                  alt={book.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <BookOpen className="w-16 h-16 text-blue-300" />
              )}
            </div>

            <div className="p-4 space-y-3">
              {/* Actions */}
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => setShowPDF(true)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Read Online
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  onClick={handleBookmark}
                  disabled={isBookmarking}
                  className={
                    isBookmarked ? "text-yellow-600 border-yellow-300" : ""
                  }
                >
                  {isBookmarked ? (
                    <BookMarked className="w-4 h-4 mr-2" />
                  ) : (
                    <Bookmark className="w-4 h-4 mr-2" />
                  )}
                  {isBookmarked ? "Saved" : "Save"}
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              Statistics
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" />
                  Downloads
                </span>
                <span className="font-medium">
                  {book._count.downloads}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-1">
                  <Bookmark className="w-3.5 h-3.5" />
                  Bookmarks
                </span>
                <span className="font-medium">
                  {book._count.bookmarks}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  Views
                </span>
                <span className="font-medium">
                  {book._count.views}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Title & Author */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-start gap-3 mb-4">
              {book.category && (
                <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                  {book.category.name}
                </Badge>
              )}
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              {book.title}
            </h1>
            <p className="text-slate-600 mt-1">by {book.author}</p>

            {book.description && (
              <>
                <Separator className="my-4" />
                <p className="text-sm text-slate-600 leading-relaxed">
                  {book.description}
                </p>
              </>
            )}
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">
              Book Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {book.publishedYear && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">
                      Published Year
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      {book.publishedYear}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Globe className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">Language</p>
                  <p className="text-sm font-medium text-slate-900">
                    {book.language}
                  </p>
                </div>
              </div>

              {book.pages && (
                <div className="flex items-start gap-3">
                  <Hash className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Pages</p>
                    <p className="text-sm font-medium text-slate-900">
                      {book.pages}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Hash className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">File Size</p>
                  <p className="text-sm font-medium text-slate-900">
                    {formatFileSize(book.fileSize)}
                  </p>
                </div>
              </div>

              {book.department && (
                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Department</p>
                    <p className="text-sm font-medium text-slate-900">
                      {book.department.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {book.department.academicUnit.name}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">Uploaded by</p>
                  <p className="text-sm font-medium text-slate-900">
                    {book.uploadedBy.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatDate(book.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {showPDF && (
        <PDFViewer
          url={signedUrl}
          title={book.title}
          onClose={() => setShowPDF(false)}
        />
      )}
    </div>
  );
}