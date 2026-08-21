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

export interface PermissionCheck {
  allowed: boolean;
  reason?: string;
}

/**
 * Role-change policy:
 * - super_admin: full control over other users' roles (any direction),
 *   but never their own role.
 * - admin: may only move users between member <-> contributor;
 *   cannot touch admin or super_admin accounts.
 */
export function canChangeRole(
  actorRole: Role,
  targetCurrentRole: Role,
  nextRole: Role,
  opts?: { isSelf?: boolean }
): PermissionCheck {
  if (!isAdmin(actorRole)) {
    return { allowed: false, reason: "Unauthorized" };
  }
  if (opts?.isSelf) {
    return { allowed: false, reason: "You cannot change your own role" };
  }
  if (nextRole === targetCurrentRole) {
    return { allowed: false, reason: "User already has this role" };
  }
  if (actorRole !== "super_admin") {
    if (nextRole === "admin" || nextRole === "super_admin") {
      return {
        allowed: false,
        reason: "Only super admins can assign this role",
      };
    }
    if (
      targetCurrentRole === "admin" ||
      targetCurrentRole === "super_admin"
    ) {
      return { allowed: false, reason: "You cannot modify admin accounts" };
    }
  }
  return { allowed: true };
}

/**
 * Active-toggle policy mirrors role policy:
 * - nobody toggles themselves (handled separately by callers),
 * - admins only manage member/contributor accounts.
 */
export function canToggleActive(
  actorRole: Role,
  targetRole: Role,
  opts?: { isSelf?: boolean }
): PermissionCheck {
  if (!isAdmin(actorRole)) {
    return { allowed: false, reason: "Unauthorized" };
  }
  if (opts?.isSelf) {
    return {
      allowed: false,
      reason: "You cannot change your own account status",
    };
  }
  if (
    actorRole !== "super_admin" &&
    (targetRole === "admin" || targetRole === "super_admin")
  ) {
    return { allowed: false, reason: "You cannot modify admin accounts" };
  }
  return { allowed: true };
}
