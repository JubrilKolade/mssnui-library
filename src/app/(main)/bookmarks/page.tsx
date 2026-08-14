import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { BookCard } from "@/src/components/books/BookCard";
import { CourseCard } from "@/src/components/courses/CourseCard";
import { ProjectCard } from "@/src/components/projects/ProjectCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Bookmark } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookmarks — MSSN UI Library",
};

async function getBookmarks(userId: string) {
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    include: {
      book: {
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
      },
      course: {
        include: {
          department: {
            include: { academicUnit: { select: { name: true } } },
          },
          uploadedBy: { select: { name: true } },
          _count: { select: { downloads: true, bookmarks: true } },
        },
      },
      project: {
        include: {
          department: {
            include: { academicUnit: { select: { name: true } } },
          },
          uploadedBy: { select: { name: true } },
          _count: { select: { downloads: true, bookmarks: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const books = bookmarks
    .filter((b) => b.book)
    .map((b) => b.book!);
  const courses = bookmarks
    .filter((b) => b.course)
    .map((b) => b.course!);
  const projects = bookmarks
    .filter((b) => b.project)
    .map((b) => b.project!);

  return { books, courses, projects, total: bookmarks.length };
}

export default async function BookmarksPage() {
  const session = await auth();
  if (!session) return null;

  const { books, courses, projects, total } = await getBookmarks(
    session.user.id
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          My Bookmarks
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {total} saved items
        </p>
      </div>

      <Tabs defaultValue="books">
        <TabsList>
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

        <TabsContent value="books" className="mt-6">
          {books.length === 0 ? (
            <EmptyBookmarks type="books" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="courses" className="mt-6">
          {courses.length === 0 ? (
            <EmptyBookmarks type="courses" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          {projects.length === 0 ? (
            <EmptyBookmarks type="projects" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyBookmarks({ type }: { type: string }) {
  return (
    <div className="text-center py-20 text-muted-foreground">
      <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-40" />
      <p className="font-medium">No {type} bookmarked yet</p>
      <p className="text-sm mt-1">
        Save {type} by clicking the bookmark icon
      </p>
    </div>
  );
}