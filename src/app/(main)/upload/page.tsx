import { auth } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { UploadForm } from "@/src/components/upload/UploadForm";
import { canUpload } from "@/src/lib/auth-helpers";
import { Upload, Lock } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload — MSSN UI Library",
};

async function getUploadData() {
  const [categories, departments] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.department.findMany({
      orderBy: { name: "asc" },
      include: {
        academicUnit: {
          select: {
            id: true,
            name: true,
            type: true,
            parent: { select: { name: true } },
          },
        },
      },
    }),
  ]);

  return { categories, departments };
}

export default async function UploadPage() {
  const session = await auth();
  if (!session) redirect("/login");

  // Members cannot upload
  if (!canUpload(session.user.role)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="font-serif text-xl font-bold text-foreground">
          Contributor Access Required
        </h2>
        <p className="text-muted-foreground text-sm mt-2 max-w-sm">
          You need contributor access to upload content. Contact an admin
          to upgrade your account.
        </p>
        <Button className="mt-6">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const { categories, departments } = await getUploadData();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground flex items-center gap-2">
          <Upload className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          Upload Content
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Share books, course materials or projects with the community.
          All uploads require admin approval.
        </p>
      </div>

      {/* Upload Form */}
      <UploadForm
        categories={categories}
        departments={departments}
        userId={session.user.id}
      />
    </div>
  );
}