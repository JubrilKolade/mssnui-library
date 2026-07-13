"use client";

import { CourseCard } from "./CourseCard";
import { Pagination } from "@/src/components/shared/Pagination";
import { GraduationCap } from "lucide-react";

interface CoursesGridProps {
  courses: any[];
  page: number;
  totalPages: number;
  total: number;
}

export function CoursesGrid({
  courses,
  page,
  totalPages,
  total,
}: CoursesGridProps) {
  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <GraduationCap className="w-12 h-12 mb-3 opacity-40" />
        <p className="font-medium">No course materials found</p>
        <p className="text-sm mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
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