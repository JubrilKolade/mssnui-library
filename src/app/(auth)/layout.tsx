import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auth — MSSN UI Library",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-[#fbfaf6] to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-700 text-amber-50 text-2xl font-bold mb-4 shadow-md">
            M
          </div>
          <h1 className="font-serif text-2xl font-bold text-emerald-950">
            MSSN UI Library
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Muslim Students Society of Nigeria
          </p>
        </div>
        {children}
      </div>
    </main>
  );
}