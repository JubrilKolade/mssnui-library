"use client";

import { useState } from "react";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Search,
  Shield,
  UserCheck,
  UserX,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { formatDate, getInitials } from "@/src/lib/utils";
import { useToast } from "@/src/hooks/use-toast";
import type { Role } from "@/types";

interface UsersManagerProps {
  users: any[];
}

const roleColors: Record<Role, string> = {
  member: "bg-slate-100 text-slate-700",
  contributor: "bg-blue-100 text-blue-700",
  admin: "bg-purple-100 text-purple-700",
  super_admin: "bg-green-100 text-green-700",
};

const roleLabels: Record<Role, string> = {
  member: "Member",
  contributor: "Contributor",
  admin: "Admin",
  super_admin: "Super Admin",
};

export function UsersManager({ users: initialUsers }: UsersManagerProps) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const { toast } = useToast();

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !search ||
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole =
      roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  async function updateRole(userId: string, role: Role) {
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();

      if (!data.success) {
        toast({
          variant: "destructive",
          title: "Failed to update role",
          description: data.error,
        });
        return;
      }

      toast({ title: "User role updated" });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role } : u))
      );
    } catch {
      toast({ variant: "destructive", title: "Something went wrong" });
    }
  }

  async function toggleActive(userId: string, isActive: boolean) {
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });

      const data = await res.json();

      if (!data.success) {
        toast({
          variant: "destructive",
          title: "Failed to update status",
          description: data.error,
        });
        return;
      }

      toast({
        title: isActive
          ? "User deactivated"
          : "User activated",
      });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, isActive: !isActive } : u
        )
      );
    } catch {
      toast({ variant: "destructive", title: "Something went wrong" });
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by name or email..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v ?? "all")}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="member">Members</SelectItem>
            <SelectItem value="contributor">Contributors</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
            <SelectItem value="super_admin">Super Admins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                  User
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">
                  Role
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">
                  Uploads
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">
                  Joined
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                  Status
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  {/* User */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar ?? undefined} />
                          <AvatarFallback className="text-xs bg-green-100 text-green-700">
                            {getInitials(user.name ?? "")}
                          </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    <Badge
                      className={`text-xs ${roleColors[(user.role as Role) ?? "member"]}`}
                    >
                      {roleLabels[(user.role as Role) ?? "member"]}
                    </Badge>
                  </td>

                  {/* Uploads */}
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <p className="text-xs text-slate-600">
                      {((user._count?.uploadedBooks ?? 0) +
                        (user._count?.uploadedCourses ?? 0) +
                        (user._count?.uploadedProjects ?? 0))} uploads
                    </p>
                    <p className="text-xs text-slate-400">
                      {user._count?.downloads ?? 0} downloads
                    </p>
                  </td>

                  {/* Joined */}
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <p className="text-xs text-slate-400">
                      {formatDate(user.createdAt)}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <Badge
                      className={
                        user.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1"
                        >
                          Actions
                          <ChevronDown className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        {/* Role Changes */}
                        <DropdownMenuItem
                          onClick={() =>
                            updateRole(user.id, "member")
                          }
                          disabled={user.role === "member"}
                        >
                          Set as Member
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            updateRole(user.id, "contributor")
                          }
                          disabled={user.role === "contributor"}
                        >
                          Set as Contributor
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            updateRole(user.id, "admin")
                          }
                          disabled={user.role === "admin"}
                        >
                          <Shield className="w-3.5 h-3.5 mr-2" />
                          Set as Admin
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        {/* Toggle Active */}
                        <DropdownMenuItem
                          onClick={() =>
                            toggleActive(user.id, user.isActive)
                          }
                          className={
                            user.isActive
                              ? "text-red-600"
                              : "text-green-600"
                          }
                        >
                          {user.isActive ? (
                            <>
                              <UserX className="w-3.5 h-3.5 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3.5 h-3.5 mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}