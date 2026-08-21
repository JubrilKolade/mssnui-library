import { RegisterForm } from "@/src/components/auth/RegisterForm";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Register — MSSN UI Library",
};

export default function RegisterPage() {
  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
      <div className="mb-6">
        <h2 className="font-serif text-xl font-bold text-foreground">
          Create an account
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Join the MSSN UI Library
        </p>
      </div>

      <RegisterForm />

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary font-semibold"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}