import { LoginForm } from "@/src/components/auth/LoginForm";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login — MSSN UI Library",
};

export default function LoginPage() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8">
      <div className="mb-6">
        <h2 className="font-serif text-xl font-bold text-emerald-950">
          Welcome back
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Sign in to access the library
        </p>
      </div>

      <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-amber-50" />}>
        <LoginForm />
      </Suspense>

      <p className="text-center text-sm text-slate-500 mt-6">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-emerald-700 hover:text-emerald-800 font-semibold"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}