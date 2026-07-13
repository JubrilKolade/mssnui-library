"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import {
  User,
  Download,
  Upload,
  Settings,
  BookOpen,
  GraduationCap,
  ScrollText,
  Lock,
} from "lucide-react";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileStats } from "./ProfileStats";
import { EditProfileForm } from "./EditProfileForm";
import { DownloadHistory } from "./DownloadHistory";
import { ChangePasswordForm } from "./ChangePasswordForm";

interface ProfileViewProps {
  user: any;
  downloadHistory: any[];
  uploadStats: {
    approvedBooks: number;
    pendingBooks: number;
    approvedCourses: number;
    approvedProjects: number;
  };
}

export function ProfileView({
  user,
  downloadHistory,
  uploadStats,
}: ProfileViewProps) {
  const [currentUser, setCurrentUser] = useState(user);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <ProfileHeader user={currentUser} />

      {/* Stats */}
      <ProfileStats user={currentUser} uploadStats={uploadStats} />

      {/* Tabs */}
      <Tabs defaultValue="downloads">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="downloads" className="gap-2">
            <Download className="w-4 h-4" />
            Downloads
          </TabsTrigger>
          <TabsTrigger value="edit" className="gap-2">
            <Settings className="w-4 h-4" />
            Edit Profile
          </TabsTrigger>
          <TabsTrigger value="password" className="gap-2">
            <Lock className="w-4 h-4" />
            Password
          </TabsTrigger>
        </TabsList>

        {/* Download History */}
        <TabsContent value="downloads" className="mt-6">
          <DownloadHistory downloads={downloadHistory} />
        </TabsContent>

        {/* Edit Profile */}
        <TabsContent value="edit" className="mt-6">
          <EditProfileForm
            user={currentUser}
            onUpdate={setCurrentUser}
          />
        </TabsContent>

        {/* Change Password */}
        <TabsContent value="password" className="mt-6">
          <ChangePasswordForm hasPassword={!!currentUser.password} />
        </TabsContent>
      </Tabs>
    </div>
  );
}