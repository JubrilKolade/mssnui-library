import {
  Download,
  Upload,
  Bookmark,
  BookOpen,
  GraduationCap,
  ScrollText,
  Clock,
} from "lucide-react";

interface ProfileStatsProps {
  user: any;
  uploadStats: {
    approvedBooks: number;
    pendingBooks: number;
    approvedCourses: number;
    approvedProjects: number;
  };
}

export function ProfileStats({
  user,
  uploadStats,
}: ProfileStatsProps) {
  const stats = [
    {
      label: "Downloads",
      value: user._count.downloads,
      icon: Download,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Bookmarks",
      value: user._count.bookmarks,
      icon: Bookmark,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "Books Uploaded",
      value:
        user._count.uploadedBooks,
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Courses Uploaded",
      value: user._count.uploadedCourses,
      icon: GraduationCap,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Projects Uploaded",
      value: user._count.uploadedProjects,
      icon: ScrollText,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Pending Uploads",
      value: uploadStats.pendingBooks,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl border border-slate-200 p-3 text-center"
        >
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2 ${stat.bg}`}
          >
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
          </div>
          <p className="text-lg font-bold text-slate-900">
            {stat.value}
          </p>
          <p className="text-xs text-slate-400 leading-tight mt-0.5">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}