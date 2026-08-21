import { ResetPasswordForm } from "@/src/components/auth/ResetPasswordForm";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Reset Password — MSSN UI Library",
};

export default function ResetPasswordPage() {
  return (
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
  );
}
