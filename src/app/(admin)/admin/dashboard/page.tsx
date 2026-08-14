import { requireAdmin } from "@/src/lib/auth-helpers";
import { AnalyticsDashboard } from "@/src/components/admin/analytics/AnalyticsDashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics — MSSN UI Library Admin",
};

export default async function AdminDashboardPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-emerald-950">
          Analytics Dashboard
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Track library activity and performance
        </p>
      </div>

      <AnalyticsDashboard />
    </div>
  );
}