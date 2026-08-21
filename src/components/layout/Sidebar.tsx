"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/src/lib/utils";
import { getNavigation } from "@/src/lib/navigation";
import { useSidebarStore } from "@/src/store/sidebar.store";
import type { Role } from "@/types";
import { X, BookMarked } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { ScrollArea } from "@/src/components/ui/scroll-area";

interface SidebarProps {
  role: Role;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isOpen, close } = useSidebarStore();
  const navigation = getNavigation(role);

  useEffect(() => {
    close();
  }, [pathname, close]);

  function isItemActive(href: string) {
    const [itemPath, itemQuery] = href.split("?");

    // Different base path
    if (pathname !== itemPath) return false;

    // No query param needed - matches exactly if no query on link
    if (!itemQuery) {
      // But if current page HAS a type query, dont highlight plain /courses
      if (itemPath === "/courses" && searchParams.get("type")) {
        return false;
      }
      return true;
    }

    // Query param needed - compare
    const itemParams = new URLSearchParams(itemQuery);
    const itemType = itemParams.get("type");
    const currentType = searchParams.get("type");

    return itemType === currentType;
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={close}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-background border-r border-border",
          "transform transition-transform duration-200 ease-in-out",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <BookMarked className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <p className="font-serif text-sm font-bold text-foreground leading-none">
                MSSN UI
              </p>
              <p className="text-xs text-muted-foreground leading-none mt-0.5">
                Library
              </p>
            </div>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={close}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 h-[calc(100vh-4rem)] py-4">
          <nav className="px-3 space-y-6">
            {navigation.map((group) => (
              <div key={group.label}>
                <p className="px-3 mb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {group.label}
                </p>

                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    if (item.roles && !item.roles.includes(role)) {
                      return null;
                    }

                    const isActive = isItemActive(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "w-4 h-4 shrink-0",
                            isActive
                              ? "text-primary"
                              : "text-muted-foreground"
                          )}
                        />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className="text-xs h-5"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </ScrollArea>
      </aside>
    </>
  );
}