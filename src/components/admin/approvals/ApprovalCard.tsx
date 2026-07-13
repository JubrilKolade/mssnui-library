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
    color: "text-blue-600",
    bg: "bg-blue-50",
    label: "Book",
  },
  course: {
    icon: GraduationCap,
    color: "text-purple-600",
    bg: "bg-purple-50",
    label: "Course",
  },
  project: {
    icon: ScrollText,
    color: "text-orange-600",
    bg: "bg-orange-50",
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
        "bg-white rounded-xl border transition-all",
        isSelected
          ? "border-green-300 shadow-sm shadow-green-100"
          : "border-slate-200"
      )}
    >
      {/* Card Header */}
      <div className="flex items-start gap-4 p-4">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="w-4 h-4 rounded accent-green-600 mt-1 flex-shrink-0"
        />

        {/* Cover / Icon */}
        <div
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
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
                <Badge className="text-xs bg-yellow-100 text-yellow-700">
                  Pending
                </Badge>
              </div>
              <h3 className="font-semibold text-slate-900 text-sm truncate">
                {getTitle(item, type)}
              </h3>
              <p className="text-xs text-slate-500 truncate mt-0.5">
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
                <AvatarFallback className="text-xs bg-slate-200">
                  {getInitials(item.uploadedBy?.name || "?")}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-slate-500">
                {item.uploadedBy?.name}
              </span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Calendar className="w-3 h-3" />
              {formatDate(item.createdAt)}
            </div>

            {/* File Size */}
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <FileText className="w-3 h-3" />
              {formatFileSize(item.fileSize)}
            </div>

            {/* Department */}
            {item.department && (
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Building2 className="w-3 h-3" />
                {item.department.name}
              </div>
            )}
          </div>
        </div>

        {/* Expand Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-400 hover:text-slate-600 flex-shrink-0 p-1"
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
        <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-3">
          {/* Description / Abstract */}
          {(item.description || item.abstract) && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                {type === "project" ? "Abstract" : "Description"}
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                {item.description || item.abstract}
              </p>
            </div>
          )}

          {/* Book specific */}
          {type === "book" && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {item.category && (
                <div>
                  <p className="text-xs text-slate-400">Category</p>
                  <p className="text-sm font-medium">{item.category.name}</p>
                </div>
              )}
              {item.language && (
                <div>
                  <p className="text-xs text-slate-400">Language</p>
                  <p className="text-sm font-medium">{item.language}</p>
                </div>
              )}
              {item.publishedYear && (
                <div>
                  <p className="text-xs text-slate-400">Year</p>
                  <p className="text-sm font-medium">{item.publishedYear}</p>
                </div>
              )}
              {item.pages && (
                <div>
                  <p className="text-xs text-slate-400">Pages</p>
                  <p className="text-sm font-medium">{item.pages}</p>
                </div>
              )}
            </div>
          )}

          {/* Course specific */}
          {type === "course" && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <p className="text-xs text-slate-400">Level</p>
                <p className="text-sm font-medium">{item.level} Level</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Semester</p>
                <p className="text-sm font-medium capitalize">
                  {item.semester}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Type</p>
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
                <p className="text-xs text-slate-400">Author</p>
                <p className="text-sm font-medium">{item.authorName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Year</p>
                <p className="text-sm font-medium">{item.year}</p>
              </div>
              {item.supervisor && (
                <div>
                  <p className="text-xs text-slate-400">Supervisor</p>
                  <p className="text-sm font-medium">{item.supervisor}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-slate-100 bg-slate-50 rounded-b-xl">
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
          className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
          onClick={() => setIsRejectOpen(true)}
        >
          <XCircle className="w-3.5 h-3.5" />
          Reject
        </Button>

        {/* Approve */}
        <Button
          size="sm"
          className="gap-1.5 bg-green-600 hover:bg-green-700"
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