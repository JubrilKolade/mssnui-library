import { prisma } from "@/src/lib/prisma";
import { requireAdmin } from "@/src/lib/auth-helpers";
import { UsersManager } from "@/src/components/admin/users/UsersManager";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users — MSSN UI Library Admin",
};

async function getUsers() {
  return prisma.user.findMany({
    include: {
      department: {
        include: {
          academicUnit: { select: { name: true } },
        },
      },
      _count: {
        select: {
          uploadedBooks: true,
          uploadedCourses: true,
          uploadedProjects: true,
          downloads: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function UsersPage() {
  await requireAdmin();
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          User Management
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {users.length} registered users
        </p>
      </div>

      <UsersManager users={users} />
    </div>
  );
}