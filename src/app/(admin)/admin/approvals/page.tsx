import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { ApprovalsManager } from "@/src/components/admin/approvals/ApprovalsManager";
import { requireAdmin } from "@/src/lib/auth-helpers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Approvals — MSSN UI Library Admin",
};

async function getPendingContent() {
  const [books, courses, projects] = await Promise.all([
    prisma.book.findMany({
      where: { status: "pending" },
      include: {
        category: { select: { id: true, name: true } },
        department: {
          include: {
            academicUnit: {
              select: { name: true, type: true },
            },
          },
        },
        uploadedBy: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.course.findMany({
      where: { status: "pending" },
      include: {
        department: {
          include: {
            academicUnit: {
              select: { name: true, type: true },
            },
          },
        },
        uploadedBy: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.project.findMany({
      where: { status: "pending" },
      include: {
        department: {
          include: {
            academicUnit: {
              select: { name: true, type: true },
            },
          },
        },
        uploadedBy: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  return { books, courses, projects };
}

export default async function ApprovalsPage() {
  await requireAdmin();
  const session = await auth();
  const data = await getPendingContent();

  const totalPending =
    data.books.length + data.courses.length + data.projects.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-emerald-950">
            Approval Queue
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {totalPending} item{totalPending !== 1 ? "s" : ""} pending
            review
          </p>
        </div>
      </div>

      <ApprovalsManager
        books={data.books}
        courses={data.courses}
        projects={data.projects}
        adminId={session!.user.id}
      />
    </div>
  );
}