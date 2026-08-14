"use client";

import { useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useToast } from "@/src/hooks/use-toast";
import { UnitCard } from "./UnitCard";
import { AddUnitDialog } from "./AddUnitDialog";

interface AcademicUnitsTabProps {
  units: any[];
  onUpdate: (units: any[]) => void;
}

export function AcademicUnitsTab({
  units,
  onUpdate,
}: AcademicUnitsTabProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  async function refreshUnits() {
    try {
      setIsRefreshing(true);
      const res = await fetch("/api/admin/structure/units");
      const data = await res.json();
      if (data.success) onUpdate(data.data);
    } catch {
      toast({
        variant: "destructive",
        title: "Failed to refresh",
        description: "Could not fetch latest data",
      });
    } finally {
      setIsRefreshing(false);
    }
  }

  // Group units by type
  const colleges = units.filter((u) => u.type === "college");
  const faculties = units.filter((u) => u.type === "faculty");
  const institutes = units.filter((u) => u.type === "institute");
  const centres = units.filter((u) => u.type === "centre");
  const schools = units.filter((u) => u.type === "school");

  const groups = [
    { label: "Colleges", units: colleges, color: "bg-teal-50 border-teal-200" },
    { label: "Faculties", units: faculties, color: "bg-amber-50 border-amber-200" },
    { label: "Institutes", units: institutes, color: "bg-emerald-50 border-emerald-200" },
    { label: "Centres", units: centres, color: "bg-emerald-50 border-emerald-200" },
    { label: "Schools", units: schools, color: "bg-yellow-50 border-yellow-200" },
  ].filter((g) => g.units.length > 0);

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {units.length} academic units total
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshUnits}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            size="sm"
            className="bg-emerald-700 hover:bg-emerald-800"
            onClick={() => setIsAddOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Unit
          </Button>
        </div>
      </div>

      {/* Unit Groups */}
      {groups.map((group) => (
        <div key={group.label}>
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${group.color.split(" ")[0].replace("bg-", "bg-")}`} />
            {group.label}
            <span className="text-slate-400 font-normal">
              ({group.units.length})
            </span>
          </h3>
          <div className="space-y-3">
            {group.units.map((unit) => (
              <UnitCard
                key={unit.id}
                unit={unit}
                onRefresh={refreshUnits}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Add Unit Dialog */}
      <AddUnitDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        parentUnits={units}
        onSuccess={refreshUnits}
      />
    </div>
  );
}