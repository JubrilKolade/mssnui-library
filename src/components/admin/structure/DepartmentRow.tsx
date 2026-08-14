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
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent group">
      <GraduationCap className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      <span className="text-sm text-foreground flex-1 truncate">
        {department.name}
      </span>

      {/* Badges */}
      <div className="flex items-center gap-1">
        {department.isDLC && (
          <Badge className="text-xs bg-teal-500/15 text-teal-300 dark:bg-teal-500/15 dark:text-teal-300 h-5">
            DLC
          </Badge>
        )}
        {department.isPostgraduate && (
          <Badge className="text-xs bg-emerald-500/15 text-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 h-5">
            PG
          </Badge>
        )}
      </div>

      {/* Actions (show on hover) */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="w-6 h-6 text-muted-foreground hover:text-primary"
          onClick={() => setIsEditOpen(true)}
        >
          <Pencil className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-6 h-6 text-muted-foreground hover:text-destructive"
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