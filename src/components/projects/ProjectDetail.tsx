"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ScrollText,
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
  BookOpen,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";
import { formatDate, formatFileSize } from "@/src/lib/utils";
import { useToast } from "@/src/hooks/use-toast";

const PDFViewer = dynamic(
  () => import("@/src/components/shared/PDFViewer").then((m) => m.PDFViewer),
  { ssr: false }
);

interface ProjectDetailProps {
  project: any;
  viewUrl: string;
  downloadUrl: string;
  isBookmarked: boolean;
  downloadsPaused?: boolean;
}

export function ProjectDetail({
  project,
  viewUrl,
  downloadUrl,
  isBookmarked: initialIsBookmarked,
  downloadsPaused = false,
}: ProjectDetailProps) {
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
          resourceType: "project",
          resourceId: project.id,
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
          resourceType: "project",
          resourceId: project.id,
        }),
      });

      const blob = await fileRes.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `${project.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);

      toast({ title: "Download started" });
    } catch {
      toast({ variant: "destructive", title: "Download failed" });
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Projects
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-1 space-y-4">
          {/* Icon Card */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="h-44 bg-linear-to-br from-accent to-accent/60 flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-card shadow-sm flex items-center justify-center">
                <ScrollText className="w-8 h-8 text-accent-foreground" />
              </div>
              <Badge className="bg-accent text-accent-foreground">
                {project.year}
              </Badge>
            </div>

            <div className="p-4 space-y-3">
              <Button
                className="w-full"
                onClick={() => setShowPDF(true)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Read Project
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
                    Downloads are currently paused for this project — read it
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
                  {project._count.downloads}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  Views
                </span>
                <span className="font-medium">
                  {project._count.views}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Bookmark className="w-3.5 h-3.5" />
                  Bookmarks
                </span>
                <span className="font-medium">
                  {project._count.bookmarks}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card rounded-2xl border border-border p-6">
            <h1 className="font-serif text-2xl font-bold text-foreground leading-snug">
              {project.title}
            </h1>

            <Separator className="my-4" />

            {/* Abstract */}
            {project.abstract && (
              <div className="mb-4">
                <h3 className="font-serif font-bold text-foreground text-sm mb-2">
                  Abstract
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.abstract}
                </p>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Author</p>
                  <p className="text-sm font-medium text-foreground">
                    {project.authorName}
                  </p>
                </div>
              </div>

              {project.supervisor && (
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Supervisor</p>
                    <p className="text-sm font-medium text-foreground">
                      {project.supervisor}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Building2 className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="text-sm font-medium text-foreground">
                    {project.department.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {project.department.academicUnit.name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Year</p>
                  <p className="text-sm font-medium text-foreground">
                    {project.year}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Hash className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">File Size</p>
                  <p className="text-sm font-medium text-foreground">
                    {formatFileSize(project.fileSize)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Uploaded by</p>
                  <p className="text-sm font-medium text-foreground">
                    {project.uploadedBy.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(project.createdAt)}
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
          title={project.title}
          onClose={() => setShowPDF(false)}
        />
      )}
    </div>
  );
}