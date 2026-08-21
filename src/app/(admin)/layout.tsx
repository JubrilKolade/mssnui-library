import { requireAdmin } from "@/src/lib/auth-helpers";
import { Sidebar } from "@/src/components/layout/Sidebar";
import { Navbar } from "@/src/components/layout/Navbar";
import { auth } from "@/src/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) redirect("/login");

  if (
    session.user.role !== "admin" &&
    session.user.role !== "super_admin"
  ) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role={session.user.role} />
      <div className="lg:pl-64">
        <Navbar user={session.user} />
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}