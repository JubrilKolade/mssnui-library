"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import {
  BookOpen,
  GraduationCap,
  ScrollText,
  Download,
  Eye,
  Bookmark,
  Trophy,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { getInitials } from "@/src/lib/utils";

interface TopContentTablesProps {
  data: {
    topBooks: any[];
    topCourses: any[];
    topProjects: any[];
    topContributors: any[];
  };
}

export function TopContentTables({ data }: TopContentTablesProps) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
        <Trophy className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
        Top Performing Content
      </h3>

      <Tabs defaultValue="books">
        <TabsList className="mb-4">
          <TabsTrigger value="books" className="text-xs gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            Books
          </TabsTrigger>
          <TabsTrigger value="courses" className="text-xs gap-1.5">
            <GraduationCap className="w-3.5 h-3.5" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="projects" className="text-xs gap-1.5">
            <ScrollText className="w-3.5 h-3.5" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="contributors" className="text-xs gap-1.5">
            <User className="w-3.5 h-3.5" />
            Contributors
          </TabsTrigger>
        </TabsList>

        {/* Top Books */}
        <TabsContent value="books">
          <div className="space-y-2">
            {data.topBooks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No data yet
              </p>
            ) : (
              data.topBooks.map((book, index) => (
                <TopContentRow
                  key={book.id}
                  rank={index + 1}
                  title={book.title}
                  subtitle={book.author}
                  badge={book.category?.name}
                  downloads={book._count.downloads}
                  views={book._count.views}
                  bookmarks={book._count.bookmarks}
                  color="text-emerald-600 dark:text-emerald-400"
                  bg="bg-emerald-500/15"
                  icon={BookOpen}
                />
              ))
            )}
          </div>
        </TabsContent>

        {/* Top Courses */}
        <TabsContent value="courses">
          <div className="space-y-2">
            {data.topCourses.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No data yet
              </p>
            ) : (
              data.topCourses.map((course, index) => (
                <TopContentRow
                  key={course.id}
                  rank={index + 1}
                  title={`${course.courseCode} — ${course.courseTitle}`}
                  subtitle={course.department?.name}
                  downloads={course._count.downloads}
                  views={course._count.views}
                  color="text-teal-600 dark:text-teal-400"
                  bg="bg-teal-500/15"
                  icon={GraduationCap}
                />
              ))
            )}
          </div>
        </TabsContent>

        {/* Top Projects */}
        <TabsContent value="projects">
          <div className="space-y-2">
            {data.topProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No data yet
              </p>
            ) : (
              data.topProjects.map((project, index) => (
                <TopContentRow
                  key={project.id}
                  rank={index + 1}
                  title={project.title}
                  subtitle={project.department?.name}
                  downloads={project._count.downloads}
                  views={project._count.views}
                  color="text-amber-600 dark:text-amber-400"
                  bg="bg-amber-500/15"
                  icon={ScrollText}
                />
              ))
            )}
          </div>
        </TabsContent>

        {/* Top Contributors */}
        <TabsContent value="contributors">
          <div className="space-y-2">
            {data.topContributors.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No data yet
              </p>
            ) : (
              data.topContributors.map((user, index) => {
                const totalUploads =
                  user._count.uploadedBooks +
                  user._count.uploadedCourses +
                  user._count.uploadedProjects;

                return (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50"
                  >
                    {/* Rank */}
                    <span className="w-5 text-center text-xs font-bold text-muted-foreground">
                      #{index + 1}
                    </span>

                    {/* Avatar */}
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="text-xs bg-primary/15 text-primary">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user._count.uploadedBooks}B ·{" "}
                        {user._count.uploadedCourses}C ·{" "}
                        {user._count.uploadedProjects}P
                      </p>
                    </div>

                    {/* Total */}
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">
                        {totalUploads}
                      </p>
                      <p className="text-xs text-muted-foreground">uploads</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface TopContentRowProps {
  rank: number;
  title: string;
  subtitle?: string;
  badge?: string;
  downloads: number;
  views: number;
  bookmarks?: number;
  color: string;
  bg: string;
  icon: any;
}

function TopContentRow({
  rank,
  title,
  subtitle,
  badge,
  downloads,
  views,
  bookmarks,
  color,
  bg,
  icon: Icon,
}: TopContentRowProps) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50">
      {/* Rank */}
      <span
        className={`w-5 text-center text-xs font-bold ${
          rank === 1
            ? "text-yellow-500 dark:text-yellow-400"
            : rank === 2
            ? "text-muted-foreground"
            : rank === 3
            ? "text-amber-600 dark:text-amber-400"
            : "text-muted-foreground/60"
        }`}
      >
        #{rank}
      </span>

      {/* Icon */}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${bg}`}
      >
        <Icon className={`w-4 h-4 ${color}`} />
      </div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {title}
        </p>
        {subtitle && (
          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Download className="w-3 h-3" />
          {downloads}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Eye className="w-3 h-3" />
          {views}
        </span>
        {bookmarks !== undefined && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Bookmark className="w-3 h-3" />
            {bookmarks}
          </span>
        )}
      </div>
    </div>
  );
}