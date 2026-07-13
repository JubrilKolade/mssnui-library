"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ScrollText,
  Download,
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
import { PDFViewer } from "@/src/components/shared/PDFViewer";
import { formatDate, formatFileSize } from "@/src/lib/utils";
import { useToast } from "@/src/hooks/use-toast";

interface ProjectDetailProps {
  project: any;
  signedUrl: string;
  isBookmarked: boolean;
}

export function ProjectDetail({
  project,
  signedUrl,
  isBookmarked: initialIsBookmarked,
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

      await fetch("/api/downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceType: "project",
          resourceId: project.id,
        }),
      });

      const link = document.createElement("a");
      link.href = signedUrl;
      link.download = `${project.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

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
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Projects
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-1 space-y-4">
          {/* Icon Card */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="h-44 bg-gradient-to-br from-orange-50 to-orange-100 flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                <ScrollText className="w-8 h-8 text-orange-600" />
              </div>
              <Badge className="bg-orange-100 text-orange-700">
                {project.year}
              </Badge>
            </div>

            <div className="p-4 space-y-3">
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => setShowPDF(true)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Read Project
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
                    isBookmarked
                      ? "text-yellow-600 border-yellow-300"
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
                  {project._count.downloads}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  Views
                </span>
                <span className="font-medium">
                  {project._count.views}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-1">
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
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h1 className="text-2xl font-bold text-slate-900 leading-snug">
              {project.title}
            </h1>

            <Separator className="my-4" />

            {/* Abstract */}
            {project.abstract && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">
                  Abstract
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {project.abstract}
                </p>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">Author</p>
                  <p className="text-sm font-medium text-slate-900">
                    {project.authorName}
                  </p>
                </div>
              </div>

              {project.supervisor && (
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Supervisor</p>
                    <p className="text-sm font-medium text-slate-900">
                      {project.supervisor}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Building2 className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">Department</p>
                  <p className="text-sm font-medium text-slate-900">
                    {project.department.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {project.department.academicUnit.name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">Year</p>
                  <p className="text-sm font-medium text-slate-900">
                    {project.year}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Hash className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">File Size</p>
                  <p className="text-sm font-medium text-slate-900">
                    {formatFileSize(project.fileSize)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">Uploaded by</p>
                  <p className="text-sm font-medium text-slate-900">
                    {project.uploadedBy.name}
                  </p>
                  <p className="text-xs text-slate-400">
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
          url={signedUrl}
          title={project.title}
          onClose={() => setShowPDF(false)}
        />
      )}
    </div>
  );
}