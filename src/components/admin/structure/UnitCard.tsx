"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  Building2,
  Users,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/utils";
import { AddDepartmentDialog } from "./AddDepartmentDialog";
import { AddUnitDialog } from "./AddUnitDialog";
import { DeleteUnitDialog } from "./DeleteUnitDialog";
import { DepartmentRow } from "./DepartmentRow";
import { EditUnitDialog } from "./EditUnitDialog";


interface UnitCardProps {
  unit: any;
  onRefresh: () => void;
  depth?: number;
}

const unitTypeColors: Record<string, string> = {
  college: "bg-blue-100 text-blue-700",
  faculty: "bg-purple-100 text-purple-700",
  institute: "bg-orange-100 text-orange-700",
  centre: "bg-green-100 text-green-700",
  school: "bg-pink-100 text-pink-700",
};

export function UnitCard({ unit, onRefresh, depth = 0 }: UnitCardProps) {
  const [isExpanded, setIsExpanded] = useState(depth === 0);
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const hasChildren = unit.children?.length > 0;
  const hasDepartments = unit.departments?.length > 0;
  const hasContent = hasChildren || hasDepartments;

  const totalDepts = countDepartments(unit);

  function countDepartments(u: any): number {
    let count = u.departments?.length || 0;
    if (u.children) {
      for (const child of u.children) {
        count += countDepartments(child);
      }
    }
    return count;
  }

  return (
    <div
      className={cn(
        "border rounded-xl overflow-hidden",
        depth === 0
          ? "border-slate-200 bg-white"
          : "border-slate-100 bg-slate-50"
      )}
    >
      {/* Unit Header */}
      <div className="flex items-center gap-3 p-4">
        {/* Expand toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0",
            !hasContent && "invisible"
          )}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {/* Icon */}
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-4 h-4 text-slate-500" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-slate-900">
              {unit.name}
            </p>
            <Badge
              className={cn(
                "text-xs capitalize",
                unitTypeColors[unit.type] ||
                  "bg-slate-100 text-slate-700"
              )}
            >
              {unit.type}
            </Badge>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            {hasChildren && (
              <span className="text-xs text-slate-400">
                {unit.children.length} sub-units
              </span>
            )}
            {totalDepts > 0 && (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Users className="w-3 h-3" />
                {totalDepts} departments
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-slate-400 hover:text-green-600"
            onClick={() => setIsAddChildOpen(true)}
            title="Add sub-unit"
          >
            <Plus className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-slate-400 hover:text-blue-600"
            onClick={() => setIsEditOpen(true)}
            title="Edit unit"
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-slate-400 hover:text-red-600"
            onClick={() => setIsDeleteOpen(true)}
            title="Delete unit"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && hasContent && (
        <div className="border-t border-slate-100 px-4 pb-4 pt-3 space-y-3">
          {/* Children units */}
          {hasChildren && (
            <div className="space-y-2 pl-4">
              {unit.children.map((child: any) => (
                <UnitCard
                  key={child.id}
                  unit={child}
                  onRefresh={onRefresh}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}

          {/* Departments */}
          {hasDepartments && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Departments ({unit.departments.length})
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-green-600 hover:text-green-700"
                  onClick={() => setIsAddDeptOpen(true)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Department
                </Button>
              </div>
              <div className="space-y-1">
                {unit.departments.map((dept: any) => (
                  <DepartmentRow
                    key={dept.id}
                    department={dept}
                    onRefresh={onRefresh}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Add Department Button (when no depts yet) */}
          {!hasDepartments && (
            <Button
              variant="outline"
              size="sm"
              className="w-full border-dashed text-slate-500"
              onClick={() => setIsAddDeptOpen(true)}
            >
              <Plus className="w-3.5 h-3.5 mr-2" />
              Add Department
            </Button>
          )}
        </div>
      )}

      {/* Dialogs */}
      <AddDepartmentDialog
        open={isAddDeptOpen}
        onOpenChange={setIsAddDeptOpen}
        academicUnitId={unit.id}
        academicUnitName={unit.name}
        onSuccess={onRefresh}
      />
      <AddUnitDialog
        open={isAddChildOpen}
        onOpenChange={setIsAddChildOpen}
        parentUnits={[]}
        defaultParentId={unit.id}
        onSuccess={onRefresh}
      />
      <EditUnitDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        unit={unit}
        onSuccess={onRefresh}
      />
      <DeleteUnitDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        unit={unit}
        onSuccess={onRefresh}
      />
    </div>
  );
}