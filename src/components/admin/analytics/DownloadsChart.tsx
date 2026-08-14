"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/src/components/ui/button";
import { Download } from "lucide-react";

interface DownloadsChartProps {
  data: {
    date: string;
    total: number;
    book: number;
    course: number;
    project: number;
  }[];
}

const COLORS = {
  total: "#059669",
  book: "#0d9488",
  course: "#d97706",
  project: "#b45309",
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
  });
}

export function DownloadsChart({ data }: DownloadsChartProps) {
  const [view, setView] = useState<"total" | "breakdown">("total");
  const [days, setDays] = useState(30);

  // Slice data based on days
  const chartData = data.slice(-days).map((d) => ({
    ...d,
    date: formatDate(d.date),
  }));

  const totalDownloads = data.reduce((sum, d) => sum + d.total, 0);

  return (
    <div className="bg-white rounded-2xl border border-amber-100 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-serif font-bold text-emerald-950 flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-700" />
            Downloads Over Time
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {totalDownloads.toLocaleString()} total
          </p>
        </div>
        <div className="flex gap-2">
          {/* Days selector */}
          <div className="flex rounded-lg border border-amber-100 overflow-hidden">
            {[7, 14, 30].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                  days === d
                    ? "bg-emerald-700 text-amber-50"
                    : "text-slate-500 hover:bg-amber-50"
                }`}
              >
                {d}d
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex rounded-lg border border-amber-100 overflow-hidden">
            <button
              onClick={() => setView("total")}
              className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                view === "total"
                  ? "bg-emerald-700 text-amber-50"
                  : "text-slate-500 hover:bg-amber-50"
              }`}
            >
              Total
            </button>
            <button
              onClick={() => setView("breakdown")}
              className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                view === "breakdown"
                  ? "bg-emerald-700 text-amber-50"
                  : "text-slate-500 hover:bg-amber-50"
              }`}
            >
              Breakdown
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              fontSize: "12px",
            }}
          />
          {view === "total" ? (
            <Line
              type="monotone"
              dataKey="total"
              stroke={COLORS.total}
              strokeWidth={2}
              dot={false}
              name="Total Downloads"
            />
          ) : (
            <>
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Line
                type="monotone"
                dataKey="book"
                stroke={COLORS.book}
                strokeWidth={2}
                dot={false}
                name="Books"
              />
              <Line
                type="monotone"
                dataKey="course"
                stroke={COLORS.course}
                strokeWidth={2}
                dot={false}
                name="Courses"
              />
              <Line
                type="monotone"
                dataKey="project"
                stroke={COLORS.project}
                strokeWidth={2}
                dot={false}
                name="Projects"
              />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}