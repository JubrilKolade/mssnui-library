"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import {
  Download,
  UserPlus,
  Upload,
  BookOpen,
  GraduationCap,
  ScrollText,
  Activity,
} from "lucide-react";
import { formatDate, getInitials } from "@/src/lib/utils";
import { Badge } from "@/src/components/ui/badge";

interface ActivityFeedProps {
  data: {
    recentDownloads: any[];
    recentRegistrations: any[];
    recentUploads: any[];
  };
}

const typeIcons = {
  book: BookOpen,
  course: GraduationCap,
  project: ScrollText,
};

const typeColors = {
  book: "text-emerald-600 dark:text-emerald-400",
  course: "text-teal-600 dark:text-teal-400",
  project: "text-amber-600 dark:text-amber-400",
};

const roleBadgeColors: Record<string, string> = {
  member: "bg-muted text-muted-foreground",
  contributor: "bg-accent text-accent-foreground",
  admin: "bg-primary/15 text-primary",
  super_admin: "bg-primary text-primary-foreground",
};

export function ActivityFeed({ data }: ActivityFeedProps) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 h-full">
      <h3 className="font-serif font-bold text-foreground flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-primary" />
        Recent Activity
      </h3>

      <Tabs defaultValue="downloads">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="downloads" className="flex-1 text-xs">
            Downloads
          </TabsTrigger>
          <TabsTrigger value="users" className="flex-1 text-xs">
            Users
          </TabsTrigger>
          <TabsTrigger value="uploads" className="flex-1 text-xs">
            Uploads
          </TabsTrigger>
        </TabsList>

        {/* Recent Downloads */}
        <TabsContent value="downloads">
          <div className="space-y-3">
            {data.recentDownloads.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">
                No downloads yet
              </p>
            ) : (
              data.recentDownloads.map((download) => {
                const Icon =
                  typeIcons[
                    download.resourceType as keyof typeof typeIcons
                  ] || BookOpen;
                const color =
                  typeColors[
                    download.resourceType as keyof typeof typeColors
                  ] || "text-muted-foreground";

                return (
                  <div
                    key={download.id}
                    className="flex items-start gap-2.5"
                  >
                    <Avatar className="w-7 h-7 shrink-0">
                      <AvatarImage src={download.user?.avatar} />
                      <AvatarFallback className="text-xs bg-muted">
                        {getInitials(download.user?.name || "?")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground">
                        <span className="font-medium">
                          {download.user?.name}
                        </span>{" "}
                        downloaded
                      </p>
                      <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                        <Icon className={`w-3 h-3 ${color} shrink-0`} />
                        {download.resourceTitle}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(download.downloadedAt)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </TabsContent>

        {/* Recent Registrations */}
        <TabsContent value="users">
          <div className="space-y-3">
            {data.recentRegistrations.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">
                No new users yet
              </p>
            ) : (
              data.recentRegistrations.map((user) => (
                <div key={user.id} className="flex items-center gap-2.5">
                  <Avatar className="w-7 h-7 shrink-0">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-xs bg-primary/15 text-primary">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                  <Badge
                    className={`text-xs shrink-0 ${
                      roleBadgeColors[user.role] ||
                      "bg-muted text-muted-foreground"
                    }`}
                  >
                    {user.role}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        {/* Recent Uploads */}
        <TabsContent value="uploads">
          <div className="space-y-3">
            {data.recentUploads.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">
                No pending uploads
              </p>
            ) : (
              data.recentUploads.map((upload) => {
                const Icon =
                  typeIcons[upload.type as keyof typeof typeIcons] ||
                  BookOpen;
                const color =
                  typeColors[upload.type as keyof typeof typeColors] ||
                  "text-muted-foreground";

                return (
                  <div
                    key={upload.id}
                    className="flex items-start gap-2.5"
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-muted`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground truncate font-medium">
                        {upload.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        by {upload.uploadedBy}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(upload.createdAt)}
                      </p>
                    </div>
                    <Badge className="text-xs bg-yellow-500/15 text-yellow-300 dark:bg-yellow-500/15 dark:text-yellow-300 shrink-0">
                      Pending
                    </Badge>
                  </div>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}