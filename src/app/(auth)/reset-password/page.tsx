import { ResetPasswordForm } from "@/src/components/auth/ResetPasswordForm";
import { AuthSplit } from "@/src/components/auth/AuthSplit";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Reset Password — MSSN UI Library",
};

export default function ResetPasswordPage() {
  return (
    <AuthSplit
      image="https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1600&auto=format&fit=crop"
      imageAlt="Sunlight falling across the open pages of a book"
      imageSide="right"
      quote="Whoever treads a path in search of knowledge, Allah will make easy for him a path to Paradise."
      cite="Prophet Muhammad ﷺ — Sahih Muslim"
    >
      <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
        <div className="mb-6">
          <h2 className="font-serif text-xl font-bold text-foreground">
            Choose a new password
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Your new password must be different from previous passwords
          </p>
        </div>

        <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-muted" />}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </AuthSplit>
  );
}
