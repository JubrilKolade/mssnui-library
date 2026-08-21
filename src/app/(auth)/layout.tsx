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
    <div className="relative min-h-screen bg-background">
      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>
      {children}
    </div>
  );
}
