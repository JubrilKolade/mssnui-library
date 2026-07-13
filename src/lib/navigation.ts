import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  ScrollText,
  Upload,
  Bookmark,
  User,
  Users,
  CheckSquare,
  BarChart3,
  Building2,
  Library,
  type LucideIcon,
  FileText,
  ClipboardList,
} from "lucide-react";
import type { Role } from "@/types";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  roles?: Role[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export function getNavigation(role: Role): NavGroup[] {
  const groups: NavGroup[] = [
    // Main
    {
      label: "Library",
      items: [
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          label: "Books",
          href: "/books",
          icon: BookOpen,
        },
        {
          label: "Courses",
          href: "/courses",
          icon: GraduationCap,
        },
        {
          label: "Past Questions",
          href: "/courses?type=past_question",
          icon: ScrollText,
        },
        {
          label: "Assignments",
          href: "/courses?type=assignment",
          icon: ClipboardList,
        },
        {
          label: "Projects",
          href: "/projects",
          icon: FileText,
        },
      ],
    },
    // Personal
    {
      label: "My Library",
      items: [
        {
          label: "Bookmarks",
          href: "/bookmarks",
          icon: Bookmark,
        },
        {
          label: "Upload Content",
          href: "/upload",
          icon: Upload,
          roles: ["contributor", "admin", "super_admin"],
        },
        {
          label: "My Uploads",
          href: "/upload/my-uploads",
          icon: FileText,
          roles: ["contributor", "admin", "super_admin"],
        },
        {
          label: "Profile",
          href: "/profile",
          icon: User,
        },
      ],
    },
  ];

  // Admin group
  if (role === "admin" || role === "super_admin") {
    groups.push({
      label: "Administration",
      items: [
        {
          label: "Analytics",
          href: "/admin/dashboard",
          icon: BarChart3,
          roles: ["admin", "super_admin"],
        },
        {
          label: "Approvals",
          href: "/admin/approvals",
          icon: CheckSquare,
          roles: ["admin", "super_admin"],
        },
        {
          label: "Content",
          href: "/admin/content",
          icon: Library,
          roles: ["admin", "super_admin"],
        },
        {
          label: "Users",
          href: "/admin/users",
          icon: Users,
          roles: ["admin", "super_admin"],
        },
        {
          label: "Structure",
          href: "/admin/structure",
          icon: Building2,
          roles: ["super_admin"],
        },
      ],
    });
  }

  return groups;
}