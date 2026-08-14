import { prisma } from "@/src/lib/prisma";
import { requireAdmin } from "@/src/lib/auth-helpers";
import { ContentManager } from "@/src/components/admin/content/ContentManager";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Content Management — MSSN UI Library Admin",
};

async function getAllContent() {
  const [books, courses, projects] = await Promise.all([
    prisma.book.findMany({
      include: {
        category: { select: { name: true } },
        department: { select: { name: true } },
        uploadedBy: { select: { name: true } },
        approvedBy: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.course.findMany({
      include: {
        department: { select: { name: true } },
        uploadedBy: { select: { name: true } },
        approvedBy: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.project.findMany({
      include: {
        department: { select: { name: true } },
        uploadedBy: { select: { name: true } },
        approvedBy: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { books, courses, projects };
}

export default async function ContentPage() {
  await requireAdmin();
  const { books, courses, projects } = await getAllContent();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Content Management
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          View, manage and delete all library content
        </p>
      </div>

      <ContentManager
        books={books}
        courses={courses}
        projects={projects}
      />
    </div>
  );
}