"use client";

import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { useToast } from "@/src/hooks/use-toast";

interface DeleteDepartmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: any;
  onSuccess: () => void;
}

export function DeleteDepartmentDialog({
  open,
  onOpenChange,
  department,
  onSuccess,
}: DeleteDepartmentDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  async function handleDelete() {
    try {
      setIsLoading(true);
      const res = await fetch(
        `/api/admin/structure/departments/${department.id}`,
        { method: "DELETE" }
      );

      const result = await res.json();

      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Cannot delete department",
          description: result.error,
        });
        return;
      }

      toast({ title: "Department deleted" });
      onOpenChange(false);
      onSuccess();
    } catch {
      toast({ variant: "destructive", title: "Something went wrong" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Delete Department
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {department.name}
            </span>
            ? This cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}