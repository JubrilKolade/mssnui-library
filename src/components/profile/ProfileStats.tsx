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
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Bookmarks",
      value: user._count.bookmarks,
      icon: Bookmark,
      color: "text-accent-foreground",
      bg: "bg-accent",
    },
    {
      label: "Books Uploaded",
      value:
        user._count.uploadedBooks,
      icon: BookOpen,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Courses Uploaded",
      value: user._count.uploadedCourses,
      icon: GraduationCap,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Projects Uploaded",
      value: user._count.uploadedProjects,
      icon: ScrollText,
      color: "text-accent-foreground",
      bg: "bg-accent",
    },
    {
      label: "Pending Uploads",
      value: uploadStats.pendingBooks,
      icon: Clock,
      color: "text-accent-foreground",
      bg: "bg-accent",
    },
  ];

  return (
    <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card rounded-2xl border border-border p-3 text-center"
        >
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2 ${stat.bg}`}
          >
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
          </div>
          <p className="font-serif text-lg font-bold text-foreground">
            {stat.value}
          </p>
          <p className="text-xs text-muted-foreground leading-tight mt-0.5">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}