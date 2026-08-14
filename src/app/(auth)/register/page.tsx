import { RegisterForm } from "@/src/components/auth/RegisterForm";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Register — MSSN UI Library",
};

export default function RegisterPage() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8">
      <div className="mb-6">
        <h2 className="font-serif text-xl font-bold text-emerald-950">
          Create an account
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Join the MSSN UI Library
        </p>
      </div>

      <RegisterForm />

      <p className="text-center text-sm text-slate-500 mt-6">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-emerald-700 hover:text-emerald-800 font-semibold"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}