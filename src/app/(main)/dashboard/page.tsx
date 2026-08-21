import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import {
  BookOpen,
  GraduationCap,
  ScrollText,
  Download,
  FileQuestion,
} from "lucide-react";
import { StatCard } from "@/src/components/shared/StatCard";
import { RecentUploads } from "@/src/components/shared/RecentUploads";
import { QuickActions } from "@/src/components/shared/QuickActions";
import { WelcomeBanner } from "@/src/components/shared/WelcomeBanner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — MSSN UI Library",
};

async function getDashboardStats(userId: string) {
  const [
    totalBooks,
    totalCourses,
    totalPastQuestions,
    totalProjects,
    totalDownloads,
    recentBooks,
    recentCourses,
    recentProjects,
  ] = await Promise.all([
    prisma.book.count({ where: { status: "approved" } }),
    prisma.course.count({ where: { status: "approved" } }),
    prisma.course.count({
      where: { status: "approved", type: "past_question" },
    }),
    prisma.project.count({ where: { status: "approved" } }),
    prisma.download.count({ where: { userId } }),
    prisma.book.findMany({
      where: { status: "approved" },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: {
        category: { select: { name: true } },
        uploadedBy: { select: { name: true } },
      },
    }),
    prisma.course.findMany({
      where: { status: "approved" },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: {
        department: {
          select: {
            name: true,
            academicUnit: { select: { name: true } },
          },
        },
      },
    }),
    prisma.project.findMany({
      where: { status: "approved" },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: {
        department: {
          select: {
            name: true,
            academicUnit: { select: { name: true } },
          },
        },
      },
    }),
  ]);

  return {
    totalBooks,
    totalCourses,
    totalPastQuestions,
    totalProjects,
    totalDownloads,
    recentBooks,
    recentCourses,
    recentProjects,
  };
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session) return null;

  const stats = await getDashboardStats(session.user.id);

  return (
    <div className="space-y-6">
      <WelcomeBanner
        name={session.user.name}
        role={session.user.role}
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Total Books"
          value={stats.totalBooks}
          icon={BookOpen}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-500/15"
          href="/books"
        />
        <StatCard
          label="Course Materials"
          value={stats.totalCourses}
          icon={GraduationCap}
          iconColor="text-teal-600 dark:text-teal-400"
          iconBg="bg-teal-500/15"
          href="/courses"
        />
        <StatCard
          label="Past Questions"
          value={stats.totalPastQuestions}
          icon={FileQuestion}
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-accent"
          href="/courses?type=past_question"
        />
        <StatCard
          label="Projects"
          value={stats.totalProjects}
          icon={ScrollText}
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-accent"
          href="/projects"
        />
        <StatCard
          label="My Downloads"
          value={stats.totalDownloads}
          icon={Download}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-500/15"
          href="/profile"
        />
      </div>

      <QuickActions role={session.user.role} />

      <RecentUploads
        books={stats.recentBooks}
        courses={stats.recentCourses}
        projects={stats.recentProjects}
      />
    </div>
  );
}