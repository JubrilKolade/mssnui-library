import Link from "next/link";
import { BookMarked } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-amber-100 bg-[#fbfaf6]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-700">
                <BookMarked className="h-5 w-5 text-amber-50" />
              </div>
              <span className="font-serif text-base font-bold text-emerald-950">
                MSSN UI Library
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              A digital library built by students, for students — Muslim
              Students Society of Nigeria, University of Ibadan.
            </p>
          </div>

          {/* Library */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Library
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              {[
                { label: "Books", href: "/books" },
                { label: "Course Materials", href: "/courses" },
                { label: "Projects", href: "/projects" },
                { label: "Search", href: "/search" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-emerald-700">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Account
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              {[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Bookmarks", href: "/bookmarks" },
                { label: "Upload Resource", href: "/upload" },
                { label: "My Uploads", href: "/upload/my-uploads" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-emerald-700">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-emerald-800">
              About
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              {[
                { label: "Register", href: "/register" },
                { label: "Sign In", href: "/login" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-emerald-700">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-amber-100 pt-6 sm:flex-row">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Muslim Students Society of Nigeria,
            University of Ibadan.
          </p>
          <p className="font-serif text-sm italic text-emerald-700">
            &ldquo;Built by students, for students.&rdquo;
          </p>
        </div>
      </div>
    </footer>
  );
}
