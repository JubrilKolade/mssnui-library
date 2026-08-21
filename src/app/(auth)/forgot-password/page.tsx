import { ForgotPasswordForm } from "@/src/components/auth/ForgotPasswordForm";
import { AuthSplit } from "@/src/components/auth/AuthSplit";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password — MSSN UI Library",
};

export default function ForgotPasswordPage() {
  return (
    <AuthSplit
      image="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1600&auto=format&fit=crop"
      imageAlt="An open book resting beside a cup of coffee on a study desk"
      imageSide="left"
      quote="Allah will raise those who believe and those given knowledge, in degrees."
      cite="Qur'an 58:11"
    >
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
    </AuthSplit>
  );
}
