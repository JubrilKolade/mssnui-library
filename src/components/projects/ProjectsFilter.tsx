"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import { X } from "lucide-react";

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
    (key: string, value: string | null) => {
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
    <div className="bg-white rounded-2xl border border-amber-100 p-4 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-serif font-bold text-emerald-950 text-sm">Filters</h3>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-amber-600 hover:text-amber-700"
            onClick={() => router.push(pathname)}
          >
            <X className="w-3 h-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Department */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-slate-600">
          Department
        </Label>
        <Select
          value={searchParams.department || "all"}
          onValueChange={(val) => updateFilter("department", val)}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="All departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Year */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-slate-600">Year</Label>
        <Select
          value={searchParams.year || "all"}
          onValueChange={(val) => updateFilter("year", val)}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Any year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any year</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}