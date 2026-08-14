"use client";

import { Loader2, CheckCircle } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";

interface BulkApproveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  count: number;
  type: string;
  onConfirm: () => Promise<void>;
}

export function BulkApproveDialog({
  open,
  onOpenChange,
  count,
  type,
  onConfirm,
}: BulkApproveDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleConfirm() {
    setIsLoading(true);
    await onConfirm();
    setIsLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-emerald-700">
            <CheckCircle className="w-5 h-5" />
            Bulk Approve
          </DialogTitle>
          <DialogDescription>
            You are about to approve{" "}
            <span className="font-semibold text-slate-900">
              {count} {type}
              {count !== 1 ? "s" : ""}
            </span>
            . They will become visible to all users immediately.
            Are you sure?
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
            className="flex-1 bg-emerald-700 hover:bg-emerald-800"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Approving...
              </>
            ) : (
              `Approve ${count} Items`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}