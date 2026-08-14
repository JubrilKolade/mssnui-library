import { requireSuperAdmin } from "@/src/lib/auth-helpers";
import { prisma } from "@/src/lib/prisma";
import { StructureManager } from "@/src/components/admin/structure/StructureManager";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Structure Management — MSSN UI Library",
};

async function getStructureData() {
  const [units, categories] = await Promise.all([
    prisma.academicUnit.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: {
              include: {
                departments: {
                  orderBy: { name: "asc" },
                },
              },
              orderBy: { name: "asc" },
            },
            departments: {
              orderBy: { name: "asc" },
            },
          },
          orderBy: { name: "asc" },
        },
        departments: {
          orderBy: { name: "asc" },
        },
      },
      orderBy: [{ type: "asc" }, { name: "asc" }],
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return { units, categories };
}

export default async function StructurePage() {
  await requireSuperAdmin();
  const { units, categories } = await getStructureData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-emerald-950">
          Structure Management
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage university academic units, departments and book categories
        </p>
      </div>

      <StructureManager
        initialUnits={units}
        initialCategories={categories}
      />
    </div>
  );
}