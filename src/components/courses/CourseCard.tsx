import Link from "next/link";
import {
  GraduationCap,
  Download,
  Bookmark,
  FileText,
} from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { formatFileSize } from "@/src/lib/utils";
import { cn } from "@/src/lib/utils";
import type { Course } from "@/types";

type CourseCardCourse = Pick<Course, "id" | "courseCode" | "courseTitle" | "level" | "semester" | "type" | "fileSize"> & {
  department: { name: string };
  _count: { downloads: number; bookmarks: number };
};

interface CourseCardProps {
  course: CourseCardCourse;
}

const typeColors: Record<string, string> = {
  note: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  past_question: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  handout: "bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
  assignment: "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300",
};

const typeLabels: Record<string, string> = {
  note: "Lecture Note",
  past_question: "Past Question",
  handout: "Handout",
  assignment: "Assignment",
};

const levelColors: Record<number, string> = {
  100: "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300",
  200: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
  300: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  400: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  500: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300",
  600: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
};

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.id}`}>
      <div className="bg-card rounded-2xl border border-border p-4 hover:shadow-md hover:border-border transition-all group">
        {/* Icon & Badges */}
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          <div className="flex gap-1.5 flex-wrap justify-end">
            <Badge
              className={cn(
                "text-xs",
                typeColors[course.type] || "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300"
              )}
            >
              {typeLabels[course.type]}
            </Badge>
            <Badge
              className={cn(
                "text-xs",
                levelColors[course.level] || "bg-slate-100 dark:bg-slate-500/15"
              )}
            >
              {course.level}L
            </Badge>
          </div>
        </div>

        {/* Course Info */}
        <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
          {course.courseCode}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
          {course.courseTitle}
        </p>

        {/* Department */}
        <p className="text-xs text-muted-foreground mt-1 truncate">
          {course.department.name}
        </p>

        {/* Semester */}
        <p className="text-xs text-muted-foreground capitalize">
          {course.semester} Semester
        </p>

        {/* Stats */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Download className="w-3 h-3" />
            {course._count.downloads}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Bookmark className="w-3 h-3" />
            {course._count.bookmarks}
          </span>
          <span className="ml-auto text-xs text-muted-foreground">
            {formatFileSize(course.fileSize)}
          </span>
        </div>
      </div>
    </Link>
  );
}