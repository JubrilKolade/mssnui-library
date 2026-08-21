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
    <div className="bg-card rounded-2xl border border-border p-4 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-serif font-bold text-foreground text-sm">Filters</h3>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-accent-foreground hover:text-accent-foreground/80"
            onClick={() => router.push(pathname)}
          >
            <X className="w-3 h-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Department */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">
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

      {/* Level */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">Level</Label>
        <Select
          value={searchParams.level || "all"}
          onValueChange={(val) => updateFilter("level", val)}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="All levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All levels</SelectItem>
            {levels.map((level) => (
              <SelectItem key={level} value={String(level)}>
                {level} Level
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Semester */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">
          Semester
        </Label>
        <Select
          value={searchParams.semester || "all"}
          onValueChange={(val) => updateFilter("semester", val)}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Both semesters" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Both semesters</SelectItem>
            {semesters.map((sem) => (
              <SelectItem key={sem.value} value={sem.value}>
                {sem.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Type */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">
          Material Type
        </Label>
        <Select
          value={searchParams.type || "all"}
          onValueChange={(val) => updateFilter("type", val)}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {courseTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}