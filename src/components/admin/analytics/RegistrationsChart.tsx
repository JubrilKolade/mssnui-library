"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Users } from "lucide-react";

interface RegistrationsChartProps {
  data: {
    month: string;
    total: number;
    member: number;
    contributor: number;
  }[];
}

function formatMonth(monthStr: string) {
  const [year, month] = monthStr.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("en-NG", {
    month: "short",
    year: "2-digit",
  });
}

const tooltipStyle = {
  borderRadius: "8px",
  fontSize: "12px",
  border: "1px solid var(--border)",
  backgroundColor: "var(--card)",
  color: "var(--foreground)",
};

export function RegistrationsChart({ data }: RegistrationsChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    month: formatMonth(d.month),
  }));

  const totalRegistrations = data.reduce((sum, d) => sum + d.total, 0);

  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            User Registrations
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {totalRegistrations.toLocaleString()} total registrations
          </p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: "11px" }} />
          <Bar
            dataKey="member"
            name="Members"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            stackId="a"
          />
          <Bar
            dataKey="contributor"
            name="Contributors"
            fill="#a855f7"
            radius={[4, 4, 0, 0]}
            stackId="a"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}