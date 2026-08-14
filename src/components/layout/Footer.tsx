import Link from "next/link";
import { BookMarked } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <BookMarked className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-serif text-base font-bold text-foreground">
                MSSN UI Library
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              A digital library built by students, for students — Muslim
              Students Society of Nigeria, University of Ibadan.
            </p>
          </div>

          {/* Library */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
              Library
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                { label: "Books", href: "/books" },
                { label: "Course Materials", href: "/courses" },
                { label: "Projects", href: "/projects" },
                { label: "Search", href: "/search" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
              Account
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Bookmarks", href: "/bookmarks" },
                { label: "Upload Resource", href: "/upload" },
                { label: "My Uploads", href: "/upload/my-uploads" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
              About
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                { label: "Register", href: "/register" },
                { label: "Sign In", href: "/login" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Muslim Students Society of Nigeria,
            University of Ibadan.
          </p>
          <p className="font-serif text-sm italic text-primary">
            &ldquo;Built by students, for students.&rdquo;
          </p>
        </div>
      </div>
    </footer>
  );
}
