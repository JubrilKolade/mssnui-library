import { ForgotPasswordForm } from "@/src/components/auth/ForgotPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password — MSSN UI Library",
};

export default function ForgotPasswordPage() {
  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
      <div className="mb-6">
        <h2 className="font-serif text-xl font-bold text-foreground">
          Forgot your password?
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          No worries — enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      <ForgotPasswordForm />
    </div>
  );
}
