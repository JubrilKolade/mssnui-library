import { prisma } from "@/src/lib/prisma";
import { Search } from "lucide-react";
import { BookCard } from "@/src/components/books/BookCard";
import { CourseCard } from "@/src/components/courses/CourseCard";
import { ProjectCard } from "@/src/components/projects/ProjectCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search — MSSN UI Library",
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

async function searchAll(query: string) {
  if (!query || query.length < 2) {
    return { books: [], courses: [], projects: [] };
  }

  const searchFilter = { contains: query, mode: "insensitive" as const };

  const [books, courses, projects] = await Promise.all([
    prisma.book.findMany({
      where: {
        status: "approved",
        OR: [
          { title: searchFilter },
          { author: searchFilter },
          { description: searchFilter },
        ],
      },
      include: {
        category: { select: { id: true, name: true } },
        department: {
          select: {
            id: true,
            name: true,
            academicUnit: { select: { name: true } },
          },
        },
        uploadedBy: { select: { name: true } },
        _count: { select: { downloads: true, bookmarks: true } },
      },
      take: 12,
    }),
    prisma.course.findMany({
      where: {
        status: "approved",
        OR: [
          { courseCode: searchFilter },
          { courseTitle: searchFilter },
        ],
      },
      include: {
        department: {
          include: {
            academicUnit: { select: { name: true } },
          },
        },
        uploadedBy: { select: { name: true } },
        _count: { select: { downloads: true, bookmarks: true } },
      },
      take: 12,
    }),
    prisma.project.findMany({
      where: {
        status: "approved",
        OR: [
          { title: searchFilter },
          { authorName: searchFilter },
          { abstract: searchFilter },
        ],
      },
      include: {
        department: {
          include: {
            academicUnit: { select: { name: true } },
          },
        },
        uploadedBy: { select: { name: true } },
        _count: { select: { downloads: true, bookmarks: true } },
      },
      take: 12,
    }),
  ]);

  return { books, courses, projects };
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || "";
  const { books, courses, projects } = await searchAll(query);
  const total = books.length + courses.length + projects.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-emerald-950 flex items-center gap-2">
          <Search className="w-6 h-6 text-emerald-700" />
          Search Results
        </h1>
        {query ? (
          <p className="text-slate-500 text-sm mt-1">
            {total} results for{" "}
            <span className="font-medium text-slate-900">
              &quot;{query}&quot;
            </span>
          </p>
        ) : (
          <p className="text-slate-500 text-sm mt-1">
            Enter a search term to find books, courses and projects
          </p>
        )}
      </div>

      {query && (
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">
              All ({total})
            </TabsTrigger>
            <TabsTrigger value="books">
              Books ({books.length})
            </TabsTrigger>
            <TabsTrigger value="courses">
              Courses ({courses.length})
            </TabsTrigger>
            <TabsTrigger value="projects">
              Projects ({projects.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6 space-y-8">
            {books.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Books
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {books.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              </div>
            )}

            {courses.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Courses
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </div>
            )}

            {projects.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Projects
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>
            )}

            {total === 0 && (
              <div className="text-center py-20 text-slate-400">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="font-medium">No results found</p>
                <p className="text-sm mt-1">
                  Try different keywords
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="books" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="courses" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}