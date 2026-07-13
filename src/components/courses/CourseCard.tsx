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

interface CourseCardProps {
  course: any;
}

const typeColors: Record<string, string> = {
  note: "bg-blue-50 text-blue-700",
  past_question: "bg-red-50 text-red-700",
  handout: "bg-green-50 text-green-700",
  assignment: "bg-orange-50 text-orange-700",
};

const typeLabels: Record<string, string> = {
  note: "Lecture Note",
  past_question: "Past Question",
  handout: "Handout",
  assignment: "Assignment",
};

const levelColors: Record<number, string> = {
  100: "bg-slate-100 text-slate-700",
  200: "bg-blue-100 text-blue-700",
  300: "bg-green-100 text-green-700",
  400: "bg-yellow-100 text-yellow-700",
  500: "bg-orange-100 text-orange-700",
  600: "bg-red-100 text-red-700",
};

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.id}`}>
      <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-slate-300 transition-all group">
        {/* Icon & Badges */}
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-purple-600" />
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
        <h3 className="font-semibold text-slate-900 text-sm group-hover:text-purple-600 transition-colors">
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
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100">
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