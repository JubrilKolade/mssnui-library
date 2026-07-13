"use client";

import { useState } from "react";
import { Pencil, Trash2, GraduationCap } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { DeleteDepartmentDialog } from "./DeleteDepartmentDialog";
import { EditDepartmentDialog } from "./EditDepartmentDialog";

interface DepartmentRowProps {
  department: any;
  onRefresh: () => void;
}

export function DepartmentRow({
  department,
  onRefresh,
}: DepartmentRowProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 group">
      <GraduationCap className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
      <span className="text-sm text-slate-700 flex-1 truncate">
        {department.name}
      </span>

      {/* Badges */}
      <div className="flex items-center gap-1">
        {department.isDLC && (
          <Badge className="text-xs bg-blue-100 text-blue-700 h-5">
            DLC
          </Badge>
        )}
        {department.isPostgraduate && (
          <Badge className="text-xs bg-purple-100 text-purple-700 h-5">
            PG
          </Badge>
        )}
      </div>

      {/* Actions (show on hover) */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="w-6 h-6 text-slate-400 hover:text-blue-600"
          onClick={() => setIsEditOpen(true)}
        >
          <Pencil className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-6 h-6 text-slate-400 hover:text-red-600"
          onClick={() => setIsDeleteOpen(true)}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      {/* Dialogs */}
      <EditDepartmentDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        department={department}
        onSuccess={onRefresh}
      />
      <DeleteDepartmentDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        department={department}
        onSuccess={onRefresh}
      />
    </div>
  );
}