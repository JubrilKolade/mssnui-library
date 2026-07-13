import { RegisterForm } from "@/src/components/auth/RegisterForm";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Register — MSSN UI Library",
};

export default function RegisterPage() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
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
          className="text-green-600 hover:text-green-700 font-medium"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}