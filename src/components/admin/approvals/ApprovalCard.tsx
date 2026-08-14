"use client";

import { useState } from "react";
import Image from "next/image";
import {
  BookOpen,
  GraduationCap,
  ScrollText,
  User,
  Calendar,
  FileText,
  Building2,
  Eye,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Download,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { RejectDialog } from "./RejectDialog";
import { PreviewDialog } from "./PreviewDialog";
import { formatDate, formatFileSize, getInitials } from "@/src/lib/utils";
import { useToast } from "@/src/hooks/use-toast";
import { cn } from "@/src/lib/utils";

interface ApprovalCardProps {
  item: any;
  type: "book" | "course" | "project";
  adminId: string;
  isSelected: boolean;
  onSelect: () => void;
  onProcessed: (id: string) => void;
}

const typeConfig = {
  book: {
    icon: BookOpen,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/15",
    label: "Book",
  },
  course: {
    icon: GraduationCap,
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-500/15",
    label: "Course",
  },
  project: {
    icon: ScrollText,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/15",
    label: "Project",
  },
};

function getTitle(item: any, type: string) {
  if (type === "book") return item.title;
  if (type === "course") return `${item.courseCode} — ${item.courseTitle}`;
  return item.title;
}

function getSubtitle(item: any, type: string) {
  if (type === "book") return `by ${item.author}`;
  if (type === "course")
    return `${item.department?.name} · Level ${item.level} · ${item.semester} Semester`;
  return `by ${item.authorName} · ${item.year}`;
}

export function ApprovalCard({
  item,
  type,
  adminId,
  isSelected,
  onSelect,
  onProcessed,
}: ApprovalCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toast } = useToast();

  const config = typeConfig[type];
  const Icon = config.icon;

  async function handleApprove() {
    try {
      setIsApproving(true);

      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          type,
          action: "approve",
          adminId,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast({
          variant: "destructive",
          title: "Approval failed",
          description: data.error,
        });
        return;
      }

      toast({
        title: "Content approved ✅",
        description: "The uploader has been notified",
      });

      onProcessed(item.id);
    } catch {
      toast({
        variant: "destructive",
        title: "Something went wrong",
      });
    } finally {
      setIsApproving(false);
    }
  }

  return (
    <div
      className={cn(
        "bg-card rounded-2xl border transition-all",
        isSelected
          ? "border-primary/60 shadow-sm shadow-primary/10"
          : "border-border"
      )}
    >
      {/* Card Header */}
      <div className="flex items-start gap-4 p-4">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="w-4 h-4 rounded accent-primary mt-1 shrink-0"
        />

        {/* Cover / Icon */}
        <div
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center shrink-0",
            config.bg
          )}
        >
          {item.coverImageUrl ? (
            <Image
              src={item.coverImageUrl}
              alt={getTitle(item, type)}
              width={48}
              height={48}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <Icon className={cn("w-6 h-6", config.color)} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  className={cn(
                    "text-xs",
                    config.bg,
                    config.color,
                    "hover:" + config.bg
                  )}
                >
                  {config.label}
                </Badge>
                <Badge className="text-xs bg-yellow-500/15 text-yellow-300 dark:bg-yellow-500/15 dark:text-yellow-300">
                  Pending
                </Badge>
              </div>
              <h3 className="font-semibold text-foreground text-sm truncate">
                {getTitle(item, type)}
              </h3>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {getSubtitle(item, type)}
              </p>
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 mt-2 flex-wrap">
            {/* Uploader */}
            <div className="flex items-center gap-1.5">
              <Avatar className="w-5 h-5">
                <AvatarImage src={item.uploadedBy?.avatar} />
                <AvatarFallback className="text-xs bg-muted">
                  {getInitials(item.uploadedBy?.name || "?")}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {item.uploadedBy?.name}
              </span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {formatDate(item.createdAt)}
            </div>

            {/* File Size */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <FileText className="w-3 h-3" />
              {formatFileSize(item.fileSize)}
            </div>

            {/* Department */}
            {item.department && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Building2 className="w-3 h-3" />
                {item.department.name}
              </div>
            )}
          </div>
        </div>

        {/* Expand Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-muted-foreground hover:text-foreground shrink-0 p-1"
        >
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border pt-3 space-y-3">
          {/* Description / Abstract */}
          {(item.description || item.abstract) && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                {type === "project" ? "Abstract" : "Description"}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description || item.abstract}
              </p>
            </div>
          )}

          {/* Book specific */}
          {type === "book" && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {item.category && (
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="text-sm font-medium">{item.category.name}</p>
                </div>
              )}
              {item.language && (
                <div>
                  <p className="text-xs text-muted-foreground">Language</p>
                  <p className="text-sm font-medium">{item.language}</p>
                </div>
              )}
              {item.publishedYear && (
                <div>
                  <p className="text-xs text-muted-foreground">Year</p>
                  <p className="text-sm font-medium">{item.publishedYear}</p>
                </div>
              )}
              {item.pages && (
                <div>
                  <p className="text-xs text-muted-foreground">Pages</p>
                  <p className="text-sm font-medium">{item.pages}</p>
                </div>
              )}
            </div>
          )}

          {/* Course specific */}
          {type === "course" && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Level</p>
                <p className="text-sm font-medium">{item.level} Level</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Semester</p>
                <p className="text-sm font-medium capitalize">
                  {item.semester}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="text-sm font-medium capitalize">
                  {item.type.replace("_", " ")}
                </p>
              </div>
            </div>
          )}

          {/* Project specific */}
          {type === "project" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Author</p>
                <p className="text-sm font-medium">{item.authorName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Year</p>
                <p className="text-sm font-medium">{item.year}</p>
              </div>
              {item.supervisor && (
                <div>
                  <p className="text-xs text-muted-foreground">Supervisor</p>
                  <p className="text-sm font-medium">{item.supervisor}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-border bg-muted rounded-b-xl">
        {/* Preview */}
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => setIsPreviewOpen(true)}
        >
          <Eye className="w-3.5 h-3.5" />
          Preview
        </Button>

        <div className="flex-1" />

        {/* Reject */}
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10"
          onClick={() => setIsRejectOpen(true)}
        >
          <XCircle className="w-3.5 h-3.5" />
          Reject
        </Button>

        {/* Approve */}
        <Button
          size="sm"
          className="gap-1.5"
          onClick={handleApprove}
          disabled={isApproving}
        >
          {isApproving ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Approving...
            </>
          ) : (
            <>
              <CheckCircle className="w-3.5 h-3.5" />
              Approve
            </>
          )}
        </Button>
      </div>

      {/* Dialogs */}
      <RejectDialog
        open={isRejectOpen}
        onOpenChange={setIsRejectOpen}
        item={item}
        type={type}
        adminId={adminId}
        onProcessed={onProcessed}
      />

      <PreviewDialog
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        item={item}
        type={type}
      />
    </div>
  );
}