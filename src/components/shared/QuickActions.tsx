import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  ScrollText,
  Upload,
  Search,
  Bookmark,
  FileQuestion,
  ClipboardList,
} from "lucide-react";
import { canUpload } from "@/src/lib/auth-helpers";
import type { Role } from "@/types";

interface QuickActionsProps {
  role: Role;
}

export function QuickActions({ role }: QuickActionsProps) {
  const actions = [
    {
      label: "Books",
      href: "/books",
      icon: BookOpen,
      color: "text-emerald-700",
      bg: "bg-emerald-50 hover:bg-emerald-100",
    },
    {
      label: "Course Materials",
      href: "/courses",
      icon: GraduationCap,
      color: "text-teal-700",
      bg: "bg-teal-50 hover:bg-teal-100",
    },
    {
      label: "Past Questions",
      href: "/courses?type=past_question",
      icon: FileQuestion,
      color: "text-amber-700",
      bg: "bg-amber-50 hover:bg-amber-100",
    },
    {
      label: "Assignments",
      href: "/courses?type=assignment",
      icon: ClipboardList,
      color: "text-yellow-700",
      bg: "bg-yellow-50 hover:bg-yellow-100",
    },
    {
      label: "Projects",
      href: "/projects",
      icon: ScrollText,
      color: "text-emerald-700",
      bg: "bg-emerald-50 hover:bg-emerald-100",
    },
    {
      label: "Search",
      href: "/search",
      icon: Search,
      color: "text-slate-600",
      bg: "bg-slate-50 hover:bg-slate-100",
    },
    {
      label: "Bookmarks",
      href: "/bookmarks",
      icon: Bookmark,
      color: "text-amber-700",
      bg: "bg-amber-50 hover:bg-amber-100",
    },
    ...(canUpload(role)
      ? [
          {
            label: "Upload",
            href: "/upload",
            icon: Upload,
            color: "text-emerald-700",
            bg: "bg-emerald-50 hover:bg-emerald-100",
          },
        ]
      : []),
  ];

  return (
    <div>
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
        Quick Actions
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-3">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-colors ${action.bg}`}
          >
            <action.icon className={`w-5 h-5 ${action.color}`} />
            <span className="text-xs font-medium text-slate-700 text-center leading-tight">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}