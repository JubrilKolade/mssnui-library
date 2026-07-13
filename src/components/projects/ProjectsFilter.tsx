"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import { X, ChevronDown } from "lucide-react";

interface ProjectsFilterProps {
  departments: {
    id: string;
    name: string;
    academicUnit: { name: string };
  }[];
  years: number[];
  searchParams: Record<string, string | undefined>;
}

export function ProjectsFilter({
  departments,
  years,
  searchParams,
}: ProjectsFilterProps) {
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

      {/* Year */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-slate-600">Year</Label>
        <div className="relative">
          <select
            value={searchParams.year || "all"}
            onChange={(e) => updateFilter("year", e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring cursor-pointer"
          >
            <option value="all">Any year</option>
            {years.map((year) => (
              <option key={year} value={String(year)}>
                {year}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}