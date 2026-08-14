"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { getInitials, formatDate } from "@/src/lib/utils";
import { useToast } from "@/src/hooks/use-toast";
import { useFileUpload } from "@/src/hooks/useFileUpload";
import type { Role } from "@/types";

const roleLabels: Record<Role, string> = {
  member: "Member",
  contributor: "Contributor",
  admin: "Admin",
  super_admin: "Super Admin",
};

const roleBadgeColors: Record<Role, string> = {
  member: "bg-muted text-muted-foreground",
  contributor: "bg-accent text-accent-foreground",
  admin: "bg-primary/15 text-primary",
  super_admin: "bg-primary text-primary-foreground",
};

interface ProfileHeaderProps {
  user: any;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const [avatar, setAvatar] = useState(user.avatar);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile } = useFileUpload();
  const { toast } = useToast();

  async function handleAvatarChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Image must be under 5MB",
      });
      return;
    }

    try {
      setIsUploading(true);

      // Upload to R2
      const result = await uploadFile(file, "covers");
      if (!result) return;

      // Update profile
      const res = await fetch("/api/profile/avatar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: result.publicUrl }),
      });

      const data = await res.json();

      if (!data.success) {
        toast({
          variant: "destructive",
          title: "Failed to update avatar",
          description: data.error,
        });
        return;
      }

      setAvatar(result.publicUrl);
      toast({ title: "Profile photo updated" });
    } catch {
      toast({
        variant: "destructive",
        title: "Something went wrong",
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <Avatar className="w-24 h-24">
            <AvatarImage src={avatar} alt={user.name} />
            <AvatarFallback className="text-2xl font-bold bg-primary/15 text-primary">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>

          {/* Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors shadow-md"
          >
            {isUploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Camera className="w-3.5 h-3.5" />
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="font-serif text-2xl font-bold text-foreground">
            {user.name}
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">{user.email}</p>

          <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start flex-wrap">
            <Badge
              className={roleBadgeColors[user.role as Role]}
            >
              {roleLabels[user.role as Role]}
            </Badge>

            {user.matricNumber && (
              <Badge className="bg-muted text-muted-foreground">
                {user.matricNumber}
              </Badge>
            )}

            {!user.isActive && (
              <Badge className="bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300">
                Deactivated
              </Badge>
            )}
          </div>

          {user.department && (
            <p className="text-sm text-muted-foreground mt-2">
              {user.department.name} —{" "}
              {user.department.academicUnit.name}
            </p>
          )}

          <p className="text-xs text-muted-foreground mt-1">
            Member since {formatDate(user.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}