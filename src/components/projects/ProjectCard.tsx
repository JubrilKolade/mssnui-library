import Link from "next/link";
import { ScrollText, Download, Bookmark, User } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { formatFileSize, truncateText } from "@/src/lib/utils";
import type { Project } from "@/types";

type ProjectCardProject = Pick<Project, "id" | "title" | "authorName" | "year" | "fileSize"> & {
  abstract?: string | null;
  department: { name: string };
  _count: { downloads: number; bookmarks: number };
};

interface ProjectCardProps {
  project: ProjectCardProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <div className="bg-card rounded-2xl border border-border p-4 hover:shadow-md hover:border-border transition-all group h-full flex flex-col">
        {/* Icon & Year */}
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <ScrollText className="w-5 h-5 text-accent-foreground" />
          </div>
          <Badge className="bg-muted text-muted-foreground text-xs">
            {project.year}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-foreground text-sm line-clamp-2 group-hover:text-primary transition-colors flex-1">
          {project.title}
        </h3>

        {/* Author */}
        <div className="flex items-center gap-1 mt-2">
          <User className="w-3 h-3 text-muted-foreground" />
          <p className="text-xs text-muted-foreground truncate">
            {project.authorName}
          </p>
        </div>

        {/* Abstract */}
        {project.abstract && (
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
            {project.abstract}
          </p>
        )}

        {/* Department */}
        <p className="text-xs text-muted-foreground mt-1 truncate">
          {project.department.name}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Download className="w-3 h-3" />
            {project._count.downloads}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Bookmark className="w-3 h-3" />
            {project._count.bookmarks}
          </span>
          <span className="ml-auto text-xs text-muted-foreground">
            {formatFileSize(project.fileSize)}
          </span>
        </div>
      </div>
    </Link>
  );
}