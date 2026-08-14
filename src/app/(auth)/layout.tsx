import type { Metadata } from "next";
import { ThemeToggle } from "@/src/components/shared/ThemeToggle";

export const metadata: Metadata = {
  title: "Auth — MSSN UI Library",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/20 flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground text-2xl font-bold mb-4 shadow-md">
            M
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            MSSN UI Library
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Muslim Students Society of Nigeria
          </p>
        </div>
        {children}
      </div>
    </main>
  );
}