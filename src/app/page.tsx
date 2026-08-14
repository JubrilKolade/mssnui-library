import Link from "next/link";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { Footer } from "@/src/components/layout/Footer";
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
  Sparkles,
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

// Subtle Islamic geometric motif used as a background texture.
function GeometricPattern({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width="100%"
      height="100%"
    >
      <defs>
        <pattern
          id="mssn-girih"
          width="56"
          height="56"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="0" cy="0" r="24" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="56" cy="0" r="24" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="0" cy="56" r="24" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="56" cy="56" r="24" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#mssn-girih)" />
    </svg>
  );
}

// Decorative shelf of book spines — the "library" centrepiece of the hero.
const SPINES = [
  { label: "Linguistics", color: "bg-emerald-700", text: "text-emerald-50", h: "h-56" },
  { label: "Economics", color: "bg-amber-600", text: "text-amber-50", h: "h-64" },
  { label: "Geography", color: "bg-teal-800", text: "text-teal-50", h: "h-52" },
  { label: "Physics", color: "bg-rose-800", text: "text-rose-50", h: "h-60" },
  { label: "Law", color: "bg-indigo-800", text: "text-indigo-50", h: "h-56" },
  { label: "Anatomy", color: "bg-stone-700", text: "text-stone-50", h: "h-64" },
];

function Bookshelf() {
  return (
    <div className="relative">
      <div className="flex items-end justify-center gap-2">
        {SPINES.map((s, i) => (
          <div
            key={s.label}
            className={`${s.color} ${s.h} flex w-11 items-center justify-center rounded-t-md shadow-lg ring-1 ring-black/10 transition-transform duration-300 hover:-translate-y-2`}
            style={{ transform: `rotate(${i % 2 === 0 ? -1.5 : 1.5}deg)` }}
          >
            <span
              className={`${s.text} rotate-180 text-xs font-semibold tracking-wide [writing-mode:vertical-rl]`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
      {/* Shelf plank */}
      <div className="mt-1 h-4 rounded-md bg-gradient-to-b from-amber-800 to-amber-950 shadow-md" />
      <div className="mx-4 h-2 rounded-b-md bg-amber-950/60" />
    </div>
  );
}

export default async function LandingPage() {
  const session = await auth();
  const stats = await getPublicStats();

  return (
    <div className="min-h-screen bg-[#fbfaf6]">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-amber-100/80 bg-[#fbfaf6]/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-700 shadow-sm">
              <BookMarked className="h-5 w-5 text-amber-50" />
            </div>
            <span className="font-serif text-lg font-bold text-emerald-950">
              MSSN UI Library
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {session ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
              >
                Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-600 transition-colors hover:text-emerald-800"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
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
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-[#fbfaf6] to-amber-50" />
        <GeometricPattern className="absolute inset-0 text-emerald-900/[0.06]" />
        {/* soft glows */}
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:py-32">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-3.5 py-1.5 text-xs font-medium text-emerald-800 shadow-sm backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Assalamu alaikum — welcome to your library
            </div>
            <h1 className="font-serif text-4xl font-bold leading-[1.1] tracking-tight text-emerald-950 sm:text-5xl lg:text-6xl">
              Knowledge that
              <br />
              <span className="text-emerald-700">brings us together</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              Books, course materials, past questions and final-year projects —
              gathered in one welcoming place for the students of MSSN,
              University of Ibadan. Built by students, for students.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              {session ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-6 py-3 text-base font-medium text-white shadow-sm transition-all hover:bg-emerald-800 hover:shadow-md"
                >
                  Go to Dashboard
                  <ArrowRight className="h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-6 py-3 text-base font-medium text-white shadow-sm transition-all hover:bg-emerald-800 hover:shadow-md"
                  >
                    Create free account
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-white/70 px-6 py-3 text-base font-medium text-emerald-900 backdrop-blur transition-colors hover:bg-white"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>
            <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-600" /> Free forever
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-600" /> No ads
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-600" /> Curated by MSSN UI
              </span>
            </p>
          </div>

          {/* Bookshelf */}
          <div className="hidden lg:block">
            <Bookshelf />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-amber-100 bg-emerald-950">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px sm:grid-cols-4">
          {[
            {
              label: "Books",
              value: stats.totalBooks,
              icon: BookOpen,
              color: "text-amber-300",
            },
            {
              label: "Course Materials",
              value: stats.totalCourses,
              icon: GraduationCap,
              color: "text-emerald-300",
            },
            {
              label: "Projects",
              value: stats.totalProjects,
              icon: ScrollText,
              color: "text-amber-300",
            },
            {
              label: "Active Members",
              value: stats.totalUsers,
              icon: Users,
              color: "text-emerald-300",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-2 px-6 py-10 text-center"
            >
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
              <p className="font-serif text-4xl font-bold text-white">
                {stat.value.toLocaleString()}
              </p>
              <p className="text-sm text-emerald-200/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-emerald-950 sm:text-4xl">
            Everything you need to succeed
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            A warm, comprehensive library platform designed for the academic
            journey of every MSSN UI member.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Search,
              title: "Smart Search",
              description:
                "Find exactly what you need across books, courses, and projects with instant full-text search.",
              color: "bg-emerald-50 text-emerald-700",
              accent: "before:bg-emerald-500",
            },
            {
              icon: Download,
              title: "Easy Downloads",
              description:
                "Download course materials, past questions, and projects directly to your device.",
              color: "bg-amber-50 text-amber-700",
              accent: "before:bg-amber-500",
            },
            {
              icon: Bookmark,
              title: "Bookmark & Save",
              description:
                "Save your favourite resources for quick access later. Build your personal reading list.",
              color: "bg-teal-50 text-teal-700",
              accent: "before:bg-teal-500",
            },
            {
              icon: Shield,
              title: "Curated Content",
              description:
                "Every upload is reviewed by admins to ensure quality and accuracy before it goes live.",
              color: "bg-rose-50 text-rose-700",
              accent: "before:bg-rose-500",
            },
            {
              icon: Users,
              title: "Community Driven",
              description:
                "Upload and share your own notes, materials, and projects with fellow students.",
              color: "bg-indigo-50 text-indigo-700",
              accent: "before:bg-indigo-500",
            },
            {
              icon: GraduationCap,
              title: "All Levels Covered",
              description:
                "Materials organised by department, level, and semester — from 100 to 600 level.",
              color: "bg-stone-100 text-stone-700",
              accent: "before:bg-stone-500",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className={`group relative overflow-hidden rounded-xl border border-amber-100 bg-white p-6 shadow-sm transition-all before:absolute before:inset-x-0 before:top-0 before:h-1 before:origin-left before:scale-x-0 before:transition-transform before:duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-md group-hover:before:scale-x-100 hover:before:scale-x-100 ${feature.accent}`}
            >
              <div
                className={`inline-flex h-11 w-11 items-center justify-center rounded-lg ${feature.color}`}
              >
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-semibold text-emerald-950">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Knowledge quote band */}
      <section className="relative overflow-hidden border-y border-amber-100 bg-emerald-50/60">
        <GeometricPattern className="absolute inset-0 text-emerald-900/[0.05]" />
        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <BookOpen className="mx-auto h-8 w-8 text-emerald-600" />
          <blockquote className="mt-5 font-serif text-2xl font-medium italic leading-relaxed text-emerald-950 sm:text-3xl">
            &ldquo;Seeking knowledge is an obligation upon every Muslim.&rdquo;
          </blockquote>
          <p className="mt-4 text-sm font-medium text-emerald-700">
            — Prophet Muhammad ﷺ (Sunan Ibn Majah)
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#fbfaf6]">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 to-emerald-950 px-6 py-16 text-center shadow-xl sm:px-16">
            <GeometricPattern className="absolute inset-0 text-white/[0.07]" />
            <div className="relative">
              <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
                Your seat at the library is ready
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-emerald-100/90">
                Join hundreds of students already using the MSSN UI Library to
                learn, share, and grow together.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                {session ? (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-6 py-3 text-base font-semibold text-emerald-950 transition-colors hover:bg-amber-300"
                  >
                    Go to Dashboard
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/register"
                      className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-6 py-3 text-base font-semibold text-emerald-950 transition-colors hover:bg-amber-300"
                    >
                      Create free account
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/60 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-emerald-800"
                    >
                      Sign in
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
