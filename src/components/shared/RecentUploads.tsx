"use client";

import { useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Badge } from "@/src/components/ui/badge";
import { BookOpen, GraduationCap, ScrollText, ArrowRight } from "lucide-react";
import { formatDate, formatFileSize } from "@/src/lib/utils";

interface RecentUploadsProps {
  books: any[];
  courses: any[];
  projects: any[];
}

export function RecentUploads({
  books,
  courses,
  projects,
}: RecentUploadsProps) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
        Recently Added
      </h2>

      <Tabs defaultValue="books">
        <TabsList className="mb-4">
          <TabsTrigger value="books" className="gap-2">
            <BookOpen className="w-3.5 h-3.5" />
            Books
          </TabsTrigger>
          <TabsTrigger value="courses" className="gap-2">
            <GraduationCap className="w-3.5 h-3.5" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="projects" className="gap-2">
            <ScrollText className="w-3.5 h-3.5" />
            Projects
          </TabsTrigger>
        </TabsList>

        {/* Books Tab */}
        <TabsContent value="books">
          <div className="bg-white rounded-2xl border border-amber-100 divide-y divide-amber-50">
            {books.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No books yet</p>
              </div>
            ) : (
              books.map((book) => (
                <Link
                  key={book.id}
                  href={`/books/${book.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-amber-50/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {book.title}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {book.author} • {formatDate(book.createdAt)}
                    </p>
                  </div>
                  {book.category && (
                    <Badge variant="secondary" className="text-xs hidden md:flex">
                      {book.category.name}
                    </Badge>
                  )}
                </Link>
              ))
            )}
            <div className="p-3">
              <Link
                href="/books"
                className="flex items-center justify-center gap-1 text-sm text-emerald-700 hover:text-emerald-800 font-medium"
              >
                View all books
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses">
          <div className="bg-white rounded-2xl border border-amber-100 divide-y divide-amber-50">
            {courses.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No course materials yet</p>
              </div>
            ) : (
              courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-amber-50/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5 text-teal-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {course.courseCode} — {course.courseTitle}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {course.department.name} • Level {course.level}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs hidden md:flex capitalize">
                    {course.type.replace("_", " ")}
                  </Badge>
                </Link>
              ))
            )}
            <div className="p-3">
              <Link
                href="/courses"
                className="flex items-center justify-center gap-1 text-sm text-emerald-700 hover:text-emerald-800 font-medium"
              >
                View all courses
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects">
          <div className="bg-white rounded-2xl border border-amber-100 divide-y divide-amber-50">
            {projects.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <ScrollText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No projects yet</p>
              </div>
            ) : (
              projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-amber-50/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                    <ScrollText className="w-5 h-5 text-amber-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {project.title}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {project.authorName} • {project.year}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs hidden md:flex">
                    {project.department.name}
                  </Badge>
                </Link>
              ))
            )}
            <div className="p-3">
              <Link
                href="/projects"
                className="flex items-center justify-center gap-1 text-sm text-emerald-700 hover:text-emerald-800 font-medium"
              >
                View all projects
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}