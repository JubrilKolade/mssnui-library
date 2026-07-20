import Link from "next/link";
import { ScrollText, Download, Bookmark, User } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { formatFileSize, truncateText } from "@/src/lib/utils";
import type { Project } from "@/types";

type ProjectCardProject = Pick<Project, "id" | "title" | "authorName" | "abstract" | "year" | "fileSize"> & {
  department: { name: string };
  _count: { downloads: number; bookmarks: number };
};

interface ProjectCardProps {
  project: ProjectCardProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-slate-300 transition-all group h-full flex flex-col">
        {/* Icon & Year */}
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
            <ScrollText className="w-5 h-5 text-orange-600" />
          </div>
          <Badge className="bg-slate-100 text-slate-700 text-xs">
            {project.year}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-slate-900 text-sm line-clamp-2 group-hover:text-orange-600 transition-colors flex-1">
          {project.title}
        </h3>

        {/* Author */}
        <div className="flex items-center gap-1 mt-2">
          <User className="w-3 h-3 text-slate-400" />
          <p className="text-xs text-slate-500 truncate">
            {project.authorName}
          </p>
        </div>

        {/* Abstract */}
        {project.abstract && (
          <p className="text-xs text-slate-400 mt-2 line-clamp-2">
            {project.abstract}
          </p>
        )}

        {/* Department */}
        <p className="text-xs text-slate-400 mt-1 truncate">
          {project.department.name}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100">
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Download className="w-3 h-3" />
            {project._count.downloads}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Bookmark className="w-3 h-3" />
            {project._count.bookmarks}
          </span>
          <span className="ml-auto text-xs text-slate-400">
            {formatFileSize(project.fileSize)}
          </span>
        </div>
      </div>
    </Link>
  );
}