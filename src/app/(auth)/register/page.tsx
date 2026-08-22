import { RegisterForm } from "@/src/components/auth/RegisterForm";
import { AuthSplit } from "@/src/components/auth/AuthSplit";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Register — MSSN UI Library",
};

export default function RegisterPage() {
  return (
    <AuthSplit
      image="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1600&auto=format&fit=crop"
      imageAlt="A grand library hall with towering shelves and arched windows"
      imageSide="right"
      quote="Seeking knowledge is an obligation upon every Muslim."
      cite="Prophet Muhammad ﷺ — Sunan Ibn Majah"
    >
      <div className="space-y-8">
        <div>
          <h2 className="font-serif text-3xl font-bold text-foreground">
            Create an account
          </h2>
          <p className="text-muted-foreground text-sm mt-2">
            Join the MSSN UI Library
          </p>
        </div>

        <RegisterForm />

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary font-semibold"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthSplit>
  );
}