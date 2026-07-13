import "server-only";

import { auth } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import type { Role } from "@/types";

export {
  isAdmin,
  isSuperAdmin,
  canUpload,
  canApprove,
} from "@/src/lib/permissions";

export async function getSession() {
  const session = await auth();
  if (!session) redirect("/login");
  return session;
}

export async function requireRole(...roles: Role[]) {
  const session = await getSession();
  if (!roles.includes(session.user.role)) {
    redirect("/dashboard");
  }
  return session;
}

export async function requireAdmin() {
  return requireRole("admin", "super_admin");
}

export async function requireSuperAdmin() {
  return requireRole("super_admin");
}
