import { LoginForm } from "@/src/components/auth/LoginForm";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login — MSSN UI Library",
};

export default function LoginPage() {
  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
      <div className="mb-6">
        <h2 className="font-serif text-xl font-bold text-foreground">
          Welcome back
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Sign in to access the library
        </p>
      </div>

      <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-muted" />}>
        <LoginForm />
      </Suspense>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-primary font-semibold"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}