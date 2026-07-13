"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import { X, ChevronDown } from "lucide-react";

interface CoursesFilterProps {
  departments: {
    id: string;
    name: string;
    academicUnit: { name: string };
  }[];
  searchParams: Record<string, string | undefined>;
}

const levels = [100, 200, 300, 400, 500, 600];

const courseTypes = [
  { value: "note", label: "Lecture Notes" },
  { value: "past_question", label: "Past Questions" },
  { value: "handout", label: "Handouts" },
  { value: "assignment", label: "Assignments" },
];

const semesters = [
  { value: "first", label: "First Semester" },
  { value: "second", label: "Second Semester" },
];

export function CoursesFilter({
  departments,
  searchParams,
}: CoursesFilterProps) {
  const router = useRouter();
  const pathname = usePathname();

  const hasFilters = Object.values(searchParams).some(
    (v) => v && v !== "1"
  );

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams();
      Object.entries(searchParams).forEach(([k, v]) => {
        if (v && k !== "page") params.set(k, v);
      });
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 text-sm">Filters</h3>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-red-500"
            onClick={() => router.push(pathname)}
          >
            <X className="w-3 h-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Department */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-slate-600">Department</Label>
        <div className="relative">
          <select
            value={searchParams.department || "all"}
            onChange={(e) => updateFilter("department", e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring cursor-pointer"
          >
            <option value="all">All departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      {/* Level */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-slate-600">Level</Label>
        <div className="relative">
          <select
            value={searchParams.level || "all"}
            onChange={(e) => updateFilter("level", e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring cursor-pointer"
          >
            <option value="all">All levels</option>
            {levels.map((level) => (
              <option key={level} value={String(level)}>
                {level} Level
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      {/* Semester */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-slate-600">Semester</Label>
        <div className="relative">
          <select
            value={searchParams.semester || "all"}
            onChange={(e) => updateFilter("semester", e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring cursor-pointer"
          >
            <option value="all">Both semesters</option>
            {semesters.map((sem) => (
              <option key={sem.value} value={sem.value}>
                {sem.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      {/* Type */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-slate-600">
          Material Type
        </Label>
        <div className="relative">
          <select
            value={searchParams.type || "all"}
            onChange={(e) => updateFilter("type", e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring cursor-pointer"
          >
            <option value="all">All types</option>
            {courseTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}