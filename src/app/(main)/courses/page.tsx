import { prisma } from "@/src/lib/prisma";
import { CoursesGrid } from "@/src/components/courses/CoursesGrid";
import { CoursesFilter } from "@/src/components/courses/CoursesFilter";
import { GraduationCap, FileQuestion, ClipboardList, FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Courses — MSSN UI Library",
};

interface CoursesPageProps {
  searchParams: Promise<{
    department?: string;
    level?: string;
    semester?: string;
    type?: string;
    search?: string;
    page?: string;
  }>;
}

const typeHeaders: Record<
  string,
  { title: string; icon: any; color: string; description: string }
> = {
  note: {
    title: "Lecture Notes",
    icon: FileText,
    color: "text-emerald-700",
    description: "Course lecture notes and slides",
  },
  past_question: {
    title: "Past Questions",
    icon: FileQuestion,
    color: "text-amber-700",
    description: "Previous exam questions to help you prepare",
  },
  handout: {
    title: "Handouts",
    icon: GraduationCap,
    color: "text-teal-700",
    description: "Course handouts and materials",
  },
  assignment: {
    title: "Assignments",
    icon: ClipboardList,
    color: "text-amber-700",
    description: "Course assignments and tasks",
  },
};

async function getCourses(searchParams: Awaited<CoursesPageProps["searchParams"]>) {
  const page = parseInt(searchParams.page || "1");
  const limit = 12;
  const skip = (page - 1) * limit;

  const where: any = {
    status: "approved",
    ...(searchParams.search && {
      OR: [
        { courseCode: { contains: searchParams.search, mode: "insensitive" } },
        { courseTitle: { contains: searchParams.search, mode: "insensitive" } },
      ],
    }),
    ...(searchParams.department && {
      departmentId: searchParams.department,
    }),
    ...(searchParams.level && { level: parseInt(searchParams.level) }),
    ...(searchParams.semester && { semester: searchParams.semester }),
    ...(searchParams.type && { type: searchParams.type }),
  };

  const [courses, total, departments] = await Promise.all([
    prisma.course.findMany({
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
      orderBy: [{ level: "asc" }, { courseCode: "asc" }],
      skip,
      take: limit,
    }),
    prisma.course.count({ where }),
    prisma.department.findMany({
      orderBy: { name: "asc" },
      include: {
        academicUnit: { select: { name: true } },
      },
    }),
  ]);

  return {
    courses,
    total,
    departments,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export default async function CoursesPage({
  searchParams,
}: CoursesPageProps) {
  const resolvedSearchParams = await searchParams;
  const data = await getCourses(resolvedSearchParams);

  const typeConfig = resolvedSearchParams.type
    ? typeHeaders[resolvedSearchParams.type]
    : null;

  const HeaderIcon = typeConfig?.icon || GraduationCap;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-emerald-950 flex items-center gap-2">
            <HeaderIcon
              className={`w-6 h-6 ${
                typeConfig?.color || "text-emerald-700"
              }`}
            />
            {typeConfig?.title || "Course Materials"}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {typeConfig?.description ||
              `${data.total.toLocaleString()} materials available`}
          </p>
        </div>
      </div>

      {/* Quick Type Filters */}
      <div className="flex gap-2 flex-wrap">
        <TypeChip
          href="/courses"
          label="All"
          active={!resolvedSearchParams.type}
        />
        <TypeChip
          href="/courses?type=note"
          label="Lecture Notes"
          active={resolvedSearchParams.type === "note"}
        />
        <TypeChip
          href="/courses?type=past_question"
          label="Past Questions"
          active={resolvedSearchParams.type === "past_question"}
        />
        <TypeChip
          href="/courses?type=handout"
          label="Handouts"
          active={resolvedSearchParams.type === "handout"}
        />
        <TypeChip
          href="/courses?type=assignment"
          label="Assignments"
          active={resolvedSearchParams.type === "assignment"}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-64 flex-shrink-0">
          <CoursesFilter
            departments={data.departments}
            searchParams={resolvedSearchParams}
          />
        </aside>

        <div className="flex-1 min-w-0">
          <CoursesGrid
            courses={data.courses}
            page={data.page}
            totalPages={data.totalPages}
            total={data.total}
          />
        </div>
      </div>
    </div>
  );
}

function TypeChip({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <a
      href={href}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
        active
          ? "bg-emerald-700 text-amber-50"
          : "bg-white border border-amber-100 text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
      }`}
    >
      {label}
    </a>
  );
}