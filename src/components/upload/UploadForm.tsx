"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { BookOpen, GraduationCap, ScrollText } from "lucide-react";
import { BookUploadForm } from "./BookUploadForm";
import { CourseUploadForm } from "./CourseUploadForm";
import { ProjectUploadForm } from "./ProjectUploadForm";

interface UploadFormProps {
  categories: { id: string; name: string }[];
  departments: any[];
  userId: string;
}

export function UploadForm({
  categories,
  departments,
  userId,
}: UploadFormProps) {
  return (
    <div className="bg-white rounded-2xl border border-amber-100 p-6">
      <Tabs defaultValue="book">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="book" className="flex-1 gap-2">
            <BookOpen className="w-4 h-4" />
            Book
          </TabsTrigger>
          <TabsTrigger value="course" className="flex-1 gap-2">
            <GraduationCap className="w-4 h-4" />
            Course
          </TabsTrigger>
          <TabsTrigger value="project" className="flex-1 gap-2">
            <ScrollText className="w-4 h-4" />
            Project
          </TabsTrigger>
        </TabsList>

        <TabsContent value="book">
          <BookUploadForm
            categories={categories}
            departments={departments}
          />
        </TabsContent>

        <TabsContent value="course">
          <CourseUploadForm departments={departments} />
        </TabsContent>

        <TabsContent value="project">
          <ProjectUploadForm departments={departments} />
        </TabsContent>
      </Tabs>
    </div>
  );
}