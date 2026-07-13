import { prisma } from "@/src/lib/prisma";
import { ProjectsGrid } from "@/src/components/projects/ProjectsGrid";
import { ProjectsFilter } from "@/src/components/projects/ProjectsFilter";
import { ScrollText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects — MSSN UI Library",
};

interface ProjectsPageProps {
  searchParams: Promise<{
    department?: string;
    year?: string;
    search?: string;
    page?: string;
  }>;
}

async function getProjects(
  searchParams: Awaited<ProjectsPageProps["searchParams"]>
) {
  const page = parseInt(searchParams.page || "1");
  const limit = 12;
  const skip = (page - 1) * limit;

  const where: any = {
    status: "approved",
    ...(searchParams.search && {
      OR: [
        { title: { contains: searchParams.search, mode: "insensitive" } },
        { authorName: { contains: searchParams.search, mode: "insensitive" } },
        { abstract: { contains: searchParams.search, mode: "insensitive" } },
      ],
    }),
    ...(searchParams.department && {
      departmentId: searchParams.department,
    }),
    ...(searchParams.year && { year: parseInt(searchParams.year) }),
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const [projects, total, departments] = await Promise.all([
    prisma.project.findMany({
      where,
      include: {
        department: {
          include: {
            academicUnit: { select: { name: true } },
          },
        },
        uploadedBy: { select: { name: true } },
        _count: {
          select: { downloads: true, bookmarks: true },
        },
      },
      orderBy: [{ year: "desc" }, { createdAt: "desc" }],
      skip,
      take: limit,
    }),
    prisma.project.count({ where }),
    prisma.department.findMany({
      orderBy: { name: "asc" },
      include: {
        academicUnit: { select: { name: true } },
      },
    }),
  ]);

  return {
    projects,
    total,
    departments,
    years,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const resolvedSearchParams = await searchParams;
  const data = await getProjects(resolvedSearchParams);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ScrollText className="w-6 h-6 text-orange-600" />
          Projects
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {data.total.toLocaleString()} projects available
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-64 flex-shrink-0">
          <ProjectsFilter
            departments={data.departments}
            years={data.years}
            searchParams={resolvedSearchParams}
          />
        </aside>

        <div className="flex-1 min-w-0">
          <ProjectsGrid
            projects={data.projects}
            page={data.page}
            totalPages={data.totalPages}
            total={data.total}
          />
        </div>
      </div>
    </div>
  );
}