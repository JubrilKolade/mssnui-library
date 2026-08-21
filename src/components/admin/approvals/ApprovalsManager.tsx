"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Badge } from "@/src/components/ui/badge";
import { BookOpen, GraduationCap, ScrollText } from "lucide-react";
import { ApprovalList } from "./ApprovalList";

interface ApprovalsManagerProps {
  books: any[];
  courses: any[];
  projects: any[];
  adminId: string;
}

export function ApprovalsManager({
  books: initialBooks,
  courses: initialCourses,
  projects: initialProjects,
  adminId,
}: ApprovalsManagerProps) {
  const [books, setBooks] = useState(initialBooks);
  const [courses, setCourses] = useState(initialCourses);
  const [projects, setProjects] = useState(initialProjects);

  function removeBook(id: string) {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  }

  function removeCourse(id: string) {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  }

  function removeProject(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <Tabs defaultValue="books">
      <TabsList className="mb-6">
        <TabsTrigger value="books" className="gap-2">
          <BookOpen className="w-4 h-4" />
          Books
          {books.length > 0 && (
            <Badge className="bg-yellow-500/15 text-yellow-300 dark:bg-yellow-500/15 dark:text-yellow-300 ml-1 h-5 min-w-5">
              {books.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="courses" className="gap-2">
          <GraduationCap className="w-4 h-4" />
          Courses
          {courses.length > 0 && (
            <Badge className="bg-yellow-500/15 text-yellow-300 dark:bg-yellow-500/15 dark:text-yellow-300 ml-1 h-5 min-w-5">
              {courses.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="projects" className="gap-2">
          <ScrollText className="w-4 h-4" />
          Projects
          {projects.length > 0 && (
            <Badge className="bg-yellow-500/15 text-yellow-300 dark:bg-yellow-500/15 dark:text-yellow-300 ml-1 h-5 min-w-5">
              {projects.length}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="books">
        <ApprovalList
          items={books}
          type="book"
          adminId={adminId}
          onItemProcessed={removeBook}
        />
      </TabsContent>

      <TabsContent value="courses">
        <ApprovalList
          items={courses}
          type="course"
          adminId={adminId}
          onItemProcessed={removeCourse}
        />
      </TabsContent>

      <TabsContent value="projects">
        <ApprovalList
          items={projects}
          type="project"
          adminId={adminId}
          onItemProcessed={removeProject}
        />
      </TabsContent>
    </Tabs>
  );
}