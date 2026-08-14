"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface DistributionChartsProps {
  data: {
    booksByCategory: { name: string; value: number }[];
    contentByType: { name: string; value: number; color: string }[];
    usersByRole: { name: string; value: number; color: string }[];
    coursesByLevel: { level: string; count: number }[];
    approvalStats: {
      approved: number;
      pending: number;
      rejected: number;
    };
  };
}

const CATEGORY_COLORS = [
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#f97316",
  "#ef4444",
  "#eab308",
  "#14b8a6",
  "#ec4899",
  "#6366f1",
  "#84cc16",
];

export function DistributionCharts({ data }: DistributionChartsProps) {
  const approvalData = [
    {
      name: "Approved",
      value: data.approvalStats.approved,
      color: "#22c55e",
    },
    {
      name: "Pending",
      value: data.approvalStats.pending,
      color: "#eab308",
    },
    {
      name: "Rejected",
      value: data.approvalStats.rejected,
      color: "#ef4444",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Content by Type */}
      <div className="bg-white rounded-2xl border border-amber-100 p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">
          Content by Type
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data.contentByType}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
            >
              {data.contentByType.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                fontSize: "12px",
                border: "1px solid #e2e8f0",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px" }}
              iconType="circle"
              iconSize={8}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Users by Role */}
      <div className="bg-white rounded-2xl border border-amber-100 p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">
          Users by Role
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data.usersByRole}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
            >
              {data.usersByRole.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                fontSize: "12px",
                border: "1px solid #e2e8f0",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px" }}
              iconType="circle"
              iconSize={8}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Approval Status */}
      <div className="bg-white rounded-2xl border border-amber-100 p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">
          Approval Status
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={approvalData}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
            >
              {approvalData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                fontSize: "12px",
                border: "1px solid #e2e8f0",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px" }}
              iconType="circle"
              iconSize={8}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Courses by Level */}
      <div className="bg-white rounded-2xl border border-amber-100 p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">
          Courses by Level
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart
            data={data.coursesByLevel}
            margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="level"
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                fontSize: "12px",
                border: "1px solid #e2e8f0",
              }}
            />
            <Bar
              dataKey="count"
              name="Courses"
              fill="#a855f7"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}