"use client";

import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  ScrollText,
  Download,
} from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { formatDate } from "@/src/lib/utils";

interface DownloadHistoryProps {
  downloads: any[];
}

const typeConfig = {
  book: {
    icon: BookOpen,
    color: "text-blue-600",
    bg: "bg-blue-50",
    label: "Book",
    getTitle: (d: any) => d.book?.title || "Unknown",
    getHref: (d: any) => `/books/${d.bookId}`,
  },
  course: {
    icon: GraduationCap,
    color: "text-purple-600",
    bg: "bg-purple-50",
    label: "Course",
    getTitle: (d: any) =>
      d.course
        ? `${d.course.courseCode} — ${d.course.courseTitle}`
        : "Unknown",
    getHref: (d: any) => `/courses/${d.courseId}`,
  },
  project: {
    icon: ScrollText,
    color: "text-orange-600",
    bg: "bg-orange-50",
    label: "Project",
    getTitle: (d: any) => d.project?.title || "Unknown",
    getHref: (d: any) => `/projects/${d.projectId}`,
  },
};

export function DownloadHistory({ downloads }: DownloadHistoryProps) {
  if (downloads.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400">
        <Download className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p className="font-medium">No downloads yet</p>
        <p className="text-sm mt-1">
          Your download history will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 text-sm">
          Download History
        </h3>
        <span className="text-xs text-slate-400">
          Last {downloads.length} downloads
        </span>
      </div>

      <div className="divide-y divide-slate-50">
        {downloads.map((download) => {
          const config =
            typeConfig[download.resourceType as keyof typeof typeConfig];
          if (!config) return null;

          const Icon = config.icon;

          return (
            <Link
              key={download.id}
              href={config.getHref(download)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
            >
              {/* Icon */}
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bg}`}
              >
                <Icon className={`w-4 h-4 ${config.color}`} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {config.getTitle(download)}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {formatDate(download.downloadedAt)}
                </p>
              </div>

              {/* Type Badge */}
              <Badge
                className={`text-xs flex-shrink-0 ${config.bg} ${config.color} hover:${config.bg}`}
              >
                {config.label}
              </Badge>
            </Link>
          );
        })}
      </div>
    </div>
  );
}