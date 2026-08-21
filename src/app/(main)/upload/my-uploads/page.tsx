import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { MyUploadsList } from "@/src/components/upload/MyUploadsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { BookOpen, GraduationCap, ScrollText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Uploads — MSSN UI Library",
};

async function getMyUploads(userId: string) {
  const [books, courses, projects] = await Promise.all([
    prisma.book.findMany({
      where: { uploadedById: userId },
      include: {
        category: { select: { name: true } },
        department: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.course.findMany({
      where: { uploadedById: userId },
      include: {
        department: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.project.findMany({
      where: { uploadedById: userId },
      include: {
        department: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { books, courses, projects };
}

export default async function MyUploadsPage() {
  const session = await auth();
  if (!session) return null;

  const { books, courses, projects } = await getMyUploads(
    session.user.id
  );

  const total = books.length + courses.length + projects.length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">My Uploads</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {total} total uploads
        </p>
      </div>

      <Tabs defaultValue="books">
        <TabsList>
          <TabsTrigger value="books" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Books ({books.length})
          </TabsTrigger>
          <TabsTrigger value="courses" className="gap-2">
            <GraduationCap className="w-4 h-4" />
            Courses ({courses.length})
          </TabsTrigger>
          <TabsTrigger value="projects" className="gap-2">
            <ScrollText className="w-4 h-4" />
            Projects ({projects.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="books" className="mt-4">
          <MyUploadsList items={books} type="book" />
        </TabsContent>

        <TabsContent value="courses" className="mt-4">
          <MyUploadsList items={courses} type="course" />
        </TabsContent>

        <TabsContent value="projects" className="mt-4">
          <MyUploadsList items={projects} type="project" />
        </TabsContent>
      </Tabs>
    </div>
  );
}