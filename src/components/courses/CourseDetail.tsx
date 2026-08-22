"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  GraduationCap,
  Download,
  Ban,
  Bookmark,
  BookMarked,
  ChevronLeft,
  Building2,
  User,
  Eye,
  Hash,
  Calendar,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";
import { formatDate, formatFileSize } from "@/src/lib/utils";
import { useToast } from "@/src/hooks/use-toast";
import { cn } from "@/src/lib/utils";

const PDFViewer = dynamic(
  () => import("@/src/components/shared/PDFViewer").then((m) => m.PDFViewer),
  { ssr: false }
);

const typeLabels: Record<string, string> = {
  note: "Lecture Note",
  past_question: "Past Question",
  handout: "Handout",
  assignment: "Assignment",
};

const typeColors: Record<string, string> = {
  note: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  past_question: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  handout: "bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
  assignment: "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300",
};

const levelColors: Record<number, string> = {
  100: "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300",
  200: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
  300: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  400: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  500: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300",
  600: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
};

interface CourseDetailProps {
  course: any;
  viewUrl: string;
  downloadUrl: string;
  isBookmarked: boolean;
  downloadsPaused?: boolean;
}

export function CourseDetail({
  course,
  viewUrl,
  downloadUrl,
  isBookmarked: initialIsBookmarked,
  downloadsPaused = false,
}: CourseDetailProps) {
  const [isBookmarked, setIsBookmarked] = useState(
    initialIsBookmarked
  );
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
          resourceType: "course",
          resourceId: course.id,
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
      toast({ variant: "destructive", title: "Something went wrong" });
    } finally {
      setIsBookmarking(false);
    }
  }

  async function handleDownload() {
    try {
      setIsDownloading(true);

      const fileRes = await fetch(downloadUrl);
      if (!fileRes.ok) {
        const data = await fileRes.json().catch(() => null);
        toast({
          variant: "destructive",
          title: "Download unavailable",
          description: data?.error ?? "Please try again",
        });
        return;
      }

      await fetch("/api/downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceType: "course",
          resourceId: course.id,
        }),
      });

      const blob = await fileRes.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `${course.courseCode}-${course.courseTitle}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);

      toast({ title: "Download started" });
    } catch {
      toast({
        variant: "destructive",
        title: "Download failed",
      });
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/courses"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Courses
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-1 space-y-4">
          {/* Icon Card */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="h-44 bg-linear-to-br from-primary/10 to-primary/5 flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-card shadow-sm flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <div className="flex gap-2">
                <Badge
                  className={cn(
                    "text-xs",
                    typeColors[course.type] ||
                      "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300"
                  )}
                >
                  {typeLabels[course.type]}
                </Badge>
                <Badge
                  className={cn(
                    "text-xs",
                    levelColors[course.level] || "bg-slate-100 dark:bg-slate-500/15"
                  )}
                >
                  {course.level} Level
                </Badge>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <Button
                className="w-full"
                onClick={() => setShowPDF(true)}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Material
              </Button>

              {downloadsPaused ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleBookmark}
                    disabled={isBookmarking}
                    className={
                      isBookmarked
                        ? "w-full text-accent-foreground border-accent-foreground/40"
                        : "w-full"
                    }
                  >
                    {isBookmarked ? (
                      <BookMarked className="w-4 h-4 mr-2" />
                    ) : (
                      <Bookmark className="w-4 h-4 mr-2" />
                    )}
                    {isBookmarked ? "Saved" : "Save"}
                  </Button>
                  <p className="flex items-start gap-1.5 text-xs text-muted-foreground px-1">
                    <Ban className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    Downloads are currently paused for this material — view it
                    online instead.
                  </p>
                </>
              ) : (
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
                      isBookmarked
                        ? "text-accent-foreground border-accent-foreground/40"
                        : ""
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
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <h3 className="font-serif font-bold text-foreground text-sm mb-3">
              Statistics
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" />
                  Downloads
                </span>
                <span className="font-medium">
                  {course._count.downloads}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  Views
                </span>
                <span className="font-medium">
                  {course._count.views}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Bookmark className="w-3.5 h-3.5" />
                  Bookmarks
                </span>
                <span className="font-medium">
                  {course._count.bookmarks}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card rounded-2xl border border-border p-6">
            <h1 className="font-serif text-2xl font-bold text-foreground">
              {course.courseCode}
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              {course.courseTitle}
            </p>

            <Separator className="my-4" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Building2 className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="text-sm font-medium text-foreground">
                    {course.department.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {course.department.academicUnit.name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Hash className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Level</p>
                  <p className="text-sm font-medium text-foreground">
                    {course.level} Level
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Semester</p>
                  <p className="text-sm font-medium text-foreground capitalize">
                    {course.semester} Semester
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Hash className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">File Size</p>
                  <p className="text-sm font-medium text-foreground">
                    {formatFileSize(course.fileSize)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Uploaded by</p>
                  <p className="text-sm font-medium text-foreground">
                    {course.uploadedBy.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(course.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      {showPDF && (
        <PDFViewer
          url={viewUrl}
          title={`${course.courseCode} — ${course.courseTitle}`}
          onClose={() => setShowPDF(false)}
        />
      )}
    </div>
  );
}