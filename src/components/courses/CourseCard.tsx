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
  note: "bg-emerald-50 text-emerald-700",
  past_question: "bg-amber-50 text-amber-700",
  handout: "bg-teal-50 text-teal-700",
  assignment: "bg-yellow-50 text-yellow-700",
};

const typeLabels: Record<string, string> = {
  note: "Lecture Note",
  past_question: "Past Question",
  handout: "Handout",
  assignment: "Assignment",
};

const levelColors: Record<number, string> = {
  100: "bg-slate-100 text-slate-700",
  200: "bg-teal-100 text-teal-700",
  300: "bg-emerald-100 text-emerald-700",
  400: "bg-amber-100 text-amber-700",
  500: "bg-yellow-100 text-yellow-700",
  600: "bg-red-100 text-red-700",
};

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.id}`}>
      <div className="bg-white rounded-2xl border border-amber-100 p-4 hover:shadow-md hover:border-amber-200 transition-all group">
        {/* Icon & Badges */}
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-teal-700" />
          </div>
          <div className="flex gap-1.5 flex-wrap justify-end">
            <Badge
              className={cn(
                "text-xs",
                typeColors[course.type] || "bg-slate-100 text-slate-700"
              )}
            >
              {typeLabels[course.type]}
            </Badge>
            <Badge
              className={cn(
                "text-xs",
                levelColors[course.level] || "bg-slate-100"
              )}
            >
              {course.level}L
            </Badge>
          </div>
        </div>

        {/* Course Info */}
        <h3 className="font-semibold text-slate-900 text-sm group-hover:text-teal-700 transition-colors">
          {course.courseCode}
        </h3>
        <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
          {course.courseTitle}
        </p>

        {/* Department */}
        <p className="text-xs text-slate-400 mt-1 truncate">
          {course.department.name}
        </p>

        {/* Semester */}
        <p className="text-xs text-slate-400 capitalize">
          {course.semester} Semester
        </p>

        {/* Stats */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-amber-50">
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Download className="w-3 h-3" />
            {course._count.downloads}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Bookmark className="w-3 h-3" />
            {course._count.bookmarks}
          </span>
          <span className="ml-auto text-xs text-slate-400">
            {formatFileSize(course.fileSize)}
          </span>
        </div>
      </div>
    </Link>
  );
}