"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useToast } from "@/src/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface CategoriesTabProps {
  categories: Category[];
  onUpdate: (categories: Category[]) => void;
}

export function CategoriesTab({
  categories,
  onUpdate,
}: CategoriesTabProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [newName, setNewName] = useState("");
  const [editName, setEditName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  async function handleAdd() {
    if (!newName.trim()) return;
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/structure/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });

      const result = await res.json();

      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Failed to add category",
          description: result.error,
        });
        return;
      }

      toast({ title: "Category added" });
      onUpdate([...categories, result.data]);
      setNewName("");
      setIsAddOpen(false);
    } catch {
      toast({ variant: "destructive", title: "Something went wrong" });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleEdit() {
    if (!editCategory || !editName.trim()) return;
    try {
      setIsLoading(true);
      const res = await fetch(
        `/api/admin/structure/categories/${editCategory.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: editName.trim() }),
        }
      );

      const result = await res.json();

      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Failed to update category",
          description: result.error,
        });
        return;
      }

      toast({ title: "Category updated" });
      onUpdate(
        categories.map((c) =>
          c.id === editCategory.id
            ? { ...c, name: editName.trim() }
            : c
        )
      );
      setEditCategory(null);
    } catch {
      toast({ variant: "destructive", title: "Something went wrong" });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(category: Category) {
    try {
      const res = await fetch(
        `/api/admin/structure/categories/${category.id}`,
        { method: "DELETE" }
      );

      const result = await res.json();

      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Cannot delete category",
          description: result.error,
        });
        return;
      }

      toast({ title: "Category deleted" });
      onUpdate(categories.filter((c) => c.id !== category.id));
    } catch {
      toast({ variant: "destructive", title: "Something went wrong" });
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {categories.length} categories
        </p>
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-4 py-3 group"
          >
            <Tag className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="text-sm text-slate-700 flex-1 truncate">
              {category.name}
            </span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 text-slate-400 hover:text-blue-600"
                onClick={() => {
                  setEditCategory(category);
                  setEditName(category.name);
                }}
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 text-slate-400 hover:text-red-600"
                onClick={() => handleDelete(category)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Category Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="e.g Islamic Studies"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              disabled={isLoading}
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsAddOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleAdd}
                disabled={isLoading || !newName.trim()}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Add"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog
        open={!!editCategory}
        onOpenChange={() => setEditCategory(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEdit()}
              disabled={isLoading}
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setEditCategory(null)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleEdit}
                disabled={isLoading || !editName.trim()}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}