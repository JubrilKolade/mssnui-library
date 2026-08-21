"use client";

import { Badge } from "@/src/components/ui/badge";
import { formatDate, formatFileSize } from "@/src/lib/utils";
import {
  BookOpen,
  GraduationCap,
  ScrollText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface MyUploadsListProps {
  items: any[];
  type: "book" | "course" | "project";
}

const statusConfig = {
  pending: {
    label: "Pending Review",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle,
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    color: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  },
};

const typeIcons = {
  book: BookOpen,
  course: GraduationCap,
  project: ScrollText,
};

const typeColors = {
  book: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  course: "bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
  project: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
};

function getItemTitle(item: any, type: string) {
  if (type === "book") return item.title;
  if (type === "course") return `${item.courseCode} — ${item.courseTitle}`;
  return item.title;
}

function getItemSubtitle(item: any, type: string) {
  if (type === "book") return item.author;
  if (type === "course")
    return `${item.department?.name} · Level ${item.level}`;
  return `${item.authorName} · ${item.year}`;
}

export function MyUploadsList({ items, type }: MyUploadsListProps) {
  const Icon = typeIcons[type];

  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <Icon className="w-10 h-10 mx-auto mb-2 opacity-40" />
        <p className="font-medium">No {type}s uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border divide-y divide-border">
      {items.map((item) => {
        const status = statusConfig[item.status as keyof typeof statusConfig];
        const StatusIcon = status.icon;

        return (
          <div key={item.id} className="flex items-start gap-4 p-4">
            {/* Icon */}
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColors[type]}`}
            >
              <Icon className="w-5 h-5" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {getItemTitle(item, type)}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {getItemSubtitle(item, type)}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-muted-foreground">
                  {formatDate(item.createdAt)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatFileSize(item.fileSize)}
                </span>
              </div>

              {/* Rejection reason */}
              {item.status === "rejected" && item.rejectionReason && (
                <div className="flex items-start gap-1 mt-2 p-2 bg-red-50 dark:bg-red-500/10 rounded-lg">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {item.rejectionReason}
                  </p>
                </div>
              )}
            </div>

            {/* Status Badge */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${status.color}`}
            >
              <StatusIcon className="w-3 h-3" />
              {status.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}