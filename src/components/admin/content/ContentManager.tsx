"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  BookOpen,
  GraduationCap,
  ScrollText,
  Search,
  Trash2,
  Eye,
} from "lucide-react";
import { formatDate, formatFileSize } from "@/src/lib/utils";
import { useToast } from "@/src/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

interface ContentManagerProps {
  books: any[];
  courses: any[];
  projects: any[];
}

const statusColors = {
  pending: "bg-yellow-500/15 text-yellow-300 dark:bg-yellow-500/15 dark:text-yellow-300",
  approved: "bg-emerald-500/15 text-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300",
  rejected: "bg-red-500/15 text-red-300 dark:bg-red-500/15 dark:text-red-300",
};

export function ContentManager({
  books: initialBooks,
  courses: initialCourses,
  projects: initialProjects,
}: ContentManagerProps) {
  const [books, setBooks] = useState(initialBooks);
  const [courses, setCourses] = useState(initialCourses);
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  async function handleDelete(
    id: string,
    type: "book" | "course" | "project"
  ) {
    if (
      !confirm(
        "Are you sure you want to delete this content? This cannot be undone."
      )
    )
      return;

    try {
      const res = await fetch(`/api/admin/content/${type}/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!data.success) {
        toast({
          variant: "destructive",
          title: "Delete failed",
          description: data.error,
        });
        return;
      }

      toast({ title: "Content deleted" });

      if (type === "book") {
        setBooks((prev) => prev.filter((b) => b.id !== id));
      } else if (type === "course") {
        setCourses((prev) => prev.filter((c) => c.id !== id));
      } else {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Something went wrong",
      });
    }
  }

  function filterItems(items: any[], titleKey: string) {
    return items.filter((item) => {
      const matchesSearch =
        !search ||
        item[titleKey]
          ?.toLowerCase()
          .includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  const filteredBooks = filterItems(books, "title");
  const filteredCourses = filterItems(courses, "courseTitle");
  const filteredProjects = filterItems(projects, "title");

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="books">
        <TabsList>
          <TabsTrigger value="books" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Books ({filteredBooks.length})
          </TabsTrigger>
          <TabsTrigger value="courses" className="gap-2">
            <GraduationCap className="w-4 h-4" />
            Courses ({filteredCourses.length})
          </TabsTrigger>
          <TabsTrigger value="projects" className="gap-2">
            <ScrollText className="w-4 h-4" />
            Projects ({filteredProjects.length})
          </TabsTrigger>
        </TabsList>

        {/* Books */}
        <TabsContent value="books" className="mt-4">
          <ContentTable
            items={filteredBooks.map((b) => ({
              id: b.id,
              title: b.title,
              subtitle: b.author,
              meta: b.category?.name || "No category",
              status: b.status,
              uploadedBy: b.uploadedBy?.name,
              createdAt: b.createdAt,
              fileSize: b.fileSize,
            }))}
            type="book"
            onDelete={(id) => handleDelete(id, "book")}
          />
        </TabsContent>

        {/* Courses */}
        <TabsContent value="courses" className="mt-4">
          <ContentTable
            items={filteredCourses.map((c) => ({
              id: c.id,
              title: `${c.courseCode} — ${c.courseTitle}`,
              subtitle: c.department?.name,
              meta: `Level ${c.level} · ${c.semester} Semester`,
              status: c.status,
              uploadedBy: c.uploadedBy?.name,
              createdAt: c.createdAt,
              fileSize: c.fileSize,
            }))}
            type="course"
            onDelete={(id) => handleDelete(id, "course")}
          />
        </TabsContent>

        {/* Projects */}
        <TabsContent value="projects" className="mt-4">
          <ContentTable
            items={filteredProjects.map((p) => ({
              id: p.id,
              title: p.title,
              subtitle: p.authorName,
              meta: `${p.department?.name} · ${p.year}`,
              status: p.status,
              uploadedBy: p.uploadedBy?.name,
              createdAt: p.createdAt,
              fileSize: p.fileSize,
            }))}
            type="project"
            onDelete={(id) => handleDelete(id, "project")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface ContentTableProps {
  items: {
    id: string;
    title: string;
    subtitle?: string;
    meta?: string;
    status: string;
    uploadedBy?: string;
    createdAt: Date;
    fileSize: number;
  }[];
  type: string;
  onDelete: (id: string) => void;
}

function ContentTable({ items, type, onDelete }: ContentTableProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No {type}s found</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                Title
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 hidden md:table-cell">
                Details
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 hidden lg:table-cell">
                Uploaded By
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                Status
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 hidden lg:table-cell">
                Date
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-accent/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-foreground line-clamp-1">
                    {item.title}
                  </p>
                  {item.subtitle && (
                    <p className="text-xs text-muted-foreground truncate">
                      {item.subtitle}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <p className="text-xs text-muted-foreground">{item.meta}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(item.fileSize)}
                  </p>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <p className="text-xs text-muted-foreground">
                    {item.uploadedBy}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <Badge
                    className={`text-xs capitalize ${
                      statusColors[
                        item.status as keyof typeof statusColors
                      ]
                    }`}
                  >
                    {item.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <p className="text-xs text-muted-foreground">
                    {formatDate(item.createdAt)}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(item.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}