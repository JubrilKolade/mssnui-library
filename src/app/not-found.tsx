import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Home, BookX } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found — MSSN UI Library",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {/* Image banner */}
        <div className="relative h-56">
          <Image
            src="https://images.unsplash.com/photo-1550399105-c4db5fb85c18?q=80&w=1600&auto=format&fit=crop"
            alt="Stacks of old, well-read books in a dim library"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 512px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/50 px-5 py-1.5 font-serif text-3xl font-bold tracking-widest text-white backdrop-blur-md">
            404
          </span>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <BookX className="h-6 w-6 text-primary" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            This shelf is empty
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            The page you&apos;re looking for has been misplaced — or perhaps it
            was never catalogued. Let&apos;s get you back to the reading room.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              <Home className="h-4 w-4" />
              Back to home
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Go to dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
