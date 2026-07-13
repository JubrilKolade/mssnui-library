"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import {
  User,
  LogOut,
  Settings,
  Upload,
  ChevronDown,
  Shield,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { getInitials } from "@/src/lib/utils";
import { isAdmin, canUpload } from "@/src/lib/permissions";
import type { Role } from "@/types";

interface UserMenuProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: Role;
  };
}

const roleLabels: Record<Role, string> = {
  member: "Member",
  contributor: "Contributor",
  admin: "Admin",
  super_admin: "Super Admin",
};

const roleBadgeColors: Record<Role, string> = {
  member: "bg-slate-100 text-slate-700",
  contributor: "bg-blue-100 text-blue-700",
  admin: "bg-purple-100 text-purple-700",
  super_admin: "bg-green-100 text-green-700",
};

export function UserMenu({ user }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100 transition-colors outline-none">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback className="bg-green-600 text-white text-xs font-semibold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-slate-900 leading-none">
              {user.name.split(" ")[0]}
            </p>
            <p className="text-xs text-slate-500 leading-none mt-0.5">
              {roleLabels[user.role]}
            </p>
          </div>
          <ChevronDown className="w-3 h-3 text-slate-400 hidden md:block" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        {/* User info */}
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-slate-900">
              {user.name}
            </p>
            <p className="text-xs text-slate-500 font-normal">
              {user.email}
            </p>
            <span
              className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full w-fit font-medium mt-1 ${roleBadgeColors[user.role]}`}
            >
              {user.role === "super_admin" && (
                <Shield className="w-3 h-3" />
              )}
              {roleLabels[user.role]}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>

          {canUpload(user.role) && (
            <DropdownMenuItem asChild>
              <Link href="/upload" className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" />
                Upload Content
              </Link>
            </DropdownMenuItem>
          )}

          {isAdmin(user.role) && (
            <DropdownMenuItem asChild>
              <Link href="/admin/dashboard" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Admin Panel
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 cursor-pointer"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}