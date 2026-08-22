import { LoginForm } from "@/src/components/auth/LoginForm";
import { AuthSplit } from "@/src/components/auth/AuthSplit";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login — MSSN UI Library",
};

export default function LoginPage() {
  return (
    <AuthSplit
      image="https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=1600&auto=format&fit=crop"
      imageAlt="A warm-lit library aisle lined with wooden bookshelves"
      imageSide="left"
      quote="Read! In the name of your Lord who created."
      cite="Qur'an 96:1"
    >
      <div className="space-y-8">
        <div>
          <h2 className="font-serif text-3xl font-bold text-foreground">
            Welcome back
          </h2>
          <p className="text-muted-foreground text-sm mt-2">
            Sign in to access the library
          </p>
        </div>

        <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-muted" />}>
          <LoginForm />
        </Suspense>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-primary font-semibold"
          >
            Create one
          </Link>
        </p>
      </div>
    </AuthSplit>
  );
}