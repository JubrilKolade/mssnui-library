"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Building2, Tag } from "lucide-react";
import { AcademicUnitsTab } from "./AcademicUnitsTab";
import { CategoriesTab } from "./CategoriesTab";


interface StructureManagerProps {
  initialUnits: any[];
  initialCategories: any[];
}

export function StructureManager({
  initialUnits,
  initialCategories,
}: StructureManagerProps) {
  const [units, setUnits] = useState(initialUnits);
  const [categories, setCategories] = useState(initialCategories);

  return (
    <Tabs defaultValue="units">
      <TabsList className="mb-6">
        <TabsTrigger value="units" className="gap-2">
          <Building2 className="w-4 h-4" />
          Academic Units
        </TabsTrigger>
        <TabsTrigger value="categories" className="gap-2">
          <Tag className="w-4 h-4" />
          Book Categories
        </TabsTrigger>
      </TabsList>

      <TabsContent value="units">
        <AcademicUnitsTab
          units={units}
          onUpdate={setUnits}
        />
      </TabsContent>

      <TabsContent value="categories">
        <CategoriesTab
          categories={categories}
          onUpdate={setCategories}
        />
      </TabsContent>
    </Tabs>
  );
}