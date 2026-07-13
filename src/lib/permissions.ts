import type { Role } from "@/types";

export function isAdmin(role: Role) {
  return role === "admin" || role === "super_admin";
}

export function isSuperAdmin(role: Role) {
  return role === "super_admin";
}

export function canUpload(role: Role) {
  return (
    role === "contributor" ||
    role === "admin" ||
    role === "super_admin"
  );
}

export function canApprove(role: Role) {
  return role === "admin" || role === "super_admin";
}
