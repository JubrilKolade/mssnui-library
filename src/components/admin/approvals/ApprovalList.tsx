"use client";

import { useState } from "react";
import { CheckSquare } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { ApprovalCard } from "./ApprovalCard";
import { BulkApproveDialog } from "./BulkApproveDialog";
import { useToast } from "@/src/hooks/use-toast";

interface ApprovalListProps {
  items: any[];
  type: "book" | "course" | "project";
  adminId: string;
  onItemProcessed: (id: string) => void;
}

export function ApprovalList({
  items,
  type,
  adminId,
  onItemProcessed,
}: ApprovalListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const { toast } = useToast();

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  }

  function toggleSelectAll() {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((i) => i.id));
    }
  }

  async function handleBulkApprove() {
    try {
      const res = await fetch("/api/admin/approve/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: selectedIds,
          type,
          action: "approve",
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast({
          variant: "destructive",
          title: "Bulk approve failed",
          description: data.error,
        });
        return;
      }

      toast({
        title: `${selectedIds.length} items approved`,
      });

      selectedIds.forEach((id) => onItemProcessed(id));
      setSelectedIds([]);
      setIsBulkOpen(false);
    } catch {
      toast({
        variant: "destructive",
        title: "Something went wrong",
      });
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <CheckSquare className="w-12 h-12 mb-3 opacity-40" />
        <p className="font-medium">All caught up!</p>
        <p className="text-sm mt-1">No pending {type}s to review</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {items.length > 0 && (
        <div className="flex items-center justify-between bg-white border border-amber-100 rounded-2xl px-4 py-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedIds.length === items.length}
              onChange={toggleSelectAll}
              className="w-4 h-4 rounded accent-emerald-600"
            />
            <span className="text-sm text-slate-600">
              {selectedIds.length > 0
                ? `${selectedIds.length} selected`
                : `Select all (${items.length})`}
            </span>
          </div>

          {selectedIds.length > 0 && (
            <Button
              size="sm"
              className="bg-emerald-700 hover:bg-emerald-800"
              onClick={() => setIsBulkOpen(true)}
            >
              Approve Selected ({selectedIds.length})
            </Button>
          )}
        </div>
      )}

      {/* Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <ApprovalCard
            key={item.id}
            item={item}
            type={type}
            adminId={adminId}
            isSelected={selectedIds.includes(item.id)}
            onSelect={() => toggleSelect(item.id)}
            onProcessed={onItemProcessed}
          />
        ))}
      </div>

      {/* Bulk Approve Dialog */}
      <BulkApproveDialog
        open={isBulkOpen}
        onOpenChange={setIsBulkOpen}
        count={selectedIds.length}
        type={type}
        onConfirm={handleBulkApprove}
      />
    </div>
  );
}