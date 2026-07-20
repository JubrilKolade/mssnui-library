import Link from "next/link";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import {
  BookOpen,
  GraduationCap,
  ScrollText,
  ArrowRight,
  Search,
  Download,
  Bookmark,
  CheckCircle,
  Users,
  Shield,
  BookMarked,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MSSN UI Library — Digital Library for Muslim Students",
  description:
    "Access books, course materials, past questions, and projects from the Muslim Students Society of Nigeria, University of Ibadan.",
};

async function getPublicStats() {
  const [totalBooks, totalCourses, totalProjects, totalUsers] =
    await Promise.all([
      prisma.book.count({ where: { status: "approved" } }),
      prisma.course.count({ where: { status: "approved" } }),
      prisma.project.count({ where: { status: "approved" } }),
      prisma.user.count({ where: { isActive: true } }),
    ]);

  return { totalBooks, totalCourses, totalProjects, totalUsers };
}

export default async function LandingPage() {
  const session = await auth();
  const stats = await getPublicStats();

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600">
              <BookMarked className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">
              MSSN UI Library
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {session ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
              >
                Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              <CheckCircle className="h-3.5 w-3.5" />
              Muslim Students Society of Nigeria, UI
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Your digital library
              <br />
              <span className="text-green-600">for academic excellence</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              Access thousands of books, course materials, past questions, and
              final-year projects — all in one place. Built by students, for
              students.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              {session ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-green-700"
                >
                  Go to Dashboard
                  <ArrowRight className="h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-green-700"
                  >
                    Create free account
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px sm:grid-cols-4">
          {[
            {
              label: "Books",
              value: stats.totalBooks,
              icon: BookOpen,
              color: "text-blue-600",
            },
            {
              label: "Course Materials",
              value: stats.totalCourses,
              icon: GraduationCap,
              color: "text-purple-600",
            },
            {
              label: "Projects",
              value: stats.totalProjects,
              icon: ScrollText,
              color: "text-orange-600",
            },
            {
              label: "Active Members",
              value: stats.totalUsers,
              icon: Users,
              color: "text-green-600",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-2 bg-white px-6 py-10 text-center"
            >
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
              <p className="text-3xl font-bold text-slate-900">
                {stat.value.toLocaleString()}
              </p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to succeed
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            A comprehensive library platform designed for the academic needs of
            MSSN UI members.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Search,
              title: "Smart Search",
              description:
                "Find exactly what you need across books, courses, and projects with instant full-text search.",
              color: "bg-blue-50 text-blue-600",
            },
            {
              icon: Download,
              title: "Easy Downloads",
              description:
                "Download course materials, past questions, and projects directly to your device.",
              color: "bg-green-50 text-green-600",
            },
            {
              icon: Bookmark,
              title: "Bookmark & Save",
              description:
                "Save your favourite resources for quick access later. Build your personal reading list.",
              color: "bg-purple-50 text-purple-600",
            },
            {
              icon: Shield,
              title: "Curated Content",
              description:
                "Every upload is reviewed by admins to ensure quality and accuracy before it goes live.",
              color: "bg-orange-50 text-orange-600",
            },
            {
              icon: Users,
              title: "Community Driven",
              description:
                "Upload and share your own notes, materials, and projects with fellow students.",
              color: "bg-pink-50 text-pink-600",
            },
            {
              icon: GraduationCap,
              title: "All Levels Covered",
              description:
                "Materials organised by department, level, and semester — from 100 to 600 level.",
              color: "bg-indigo-50 text-indigo-600",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-slate-200 p-6 transition-all hover:border-slate-300 hover:shadow-md"
            >
              <div
                className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${feature.color}`}
              >
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="overflow-hidden rounded-2xl bg-green-600 px-6 py-16 text-center sm:px-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-green-100">
              Join hundreds of students already using the MSSN UI Library to ace
              their academics.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {session ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-medium text-green-700 transition-colors hover:bg-green-50"
                >
                  Go to Dashboard
                  <ArrowRight className="h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-medium text-green-700 transition-colors hover:bg-green-50"
                  >
                    Create free account
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-lg border border-green-400 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-green-700"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-green-600">
              <BookMarked className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-900">
              MSSN UI Library
            </span>
          </div>
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Muslim Students Society of Nigeria,
            University of Ibadan. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
