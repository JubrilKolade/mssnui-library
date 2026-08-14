"use client";

import { ProjectCard } from "./ProjectCard";
import { Pagination } from "@/src/components/shared/Pagination";
import { ScrollText } from "lucide-react";

interface ProjectsGridProps {
  projects: any[];
  page: number;
  totalPages: number;
  total: number;
}

export function ProjectsGrid({
  projects,
  page,
  totalPages,
  total,
}: ProjectsGridProps) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <ScrollText className="w-12 h-12 mb-3 opacity-40" />
        <p className="font-medium">No projects found</p>
        <p className="text-sm mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
        />
      )}
    </div>
  );
}