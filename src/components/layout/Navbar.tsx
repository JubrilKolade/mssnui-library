"use client";

import { Menu, Search } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { UserMenu } from "@/src/components/layout/UserMenu";
import { NotificationBell } from "@/src/components/shared/NotificationBell";
import { ThemeToggle } from "@/src/components/shared/ThemeToggle";
import { useSidebarStore } from "@/src/store/sidebar.store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Role } from "@/types";

interface NavbarUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: Role;
}

interface NavbarProps {
  user: NavbarUser;
}

export function Navbar({ user }: NavbarProps) {
  const { toggle } = useSidebarStore();
  const router = useRouter();
  const [search, setSearch] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!search.trim()) return;
    router.push(`/search?q=${encodeURIComponent(search.trim())}`);
    setSearch("");
  }

  return (
    <header className="sticky top-0 z-30 h-16 bg-background/90 backdrop-blur-md border-b border-border px-4 md:px-6">
      <div className="flex items-center justify-between h-full gap-4">
        {/* Left — Menu + Search */}
        <div className="flex items-center gap-4 flex-1">
          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggle}
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center flex-1 max-w-md"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search books, courses, projects..."
                className="pl-9 bg-card border-border focus-visible:ring-primary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </form>
        </div>

        {/* Right — Notifications + User */}
        <div className="flex items-center gap-1.5">
          {/* Mobile search */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => router.push("/search")}
          >
            <Search className="w-5 h-5" />
          </Button>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <NotificationBell userId={user.id} />

          {/* User menu */}
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}