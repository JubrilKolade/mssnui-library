"use client";

import {
  Users,
  BookOpen,
  Download,
  Clock,
  TrendingUp,
  TrendingDown,
  Eye,
  Bookmark,
  Activity,
} from "lucide-react";

interface OverviewCardsProps {
  data: {
    users: {
      total: number;
      newThisMonth: number;
      growth: number;
      active: number;
    };
    content: {
      total: number;
      books: number;
      courses: number;
      projects: number;
      pending: number;
    };
    downloads: {
      total: number;
      today: number;
      thisWeek: number;
      thisMonth: number;
    };
    engagement: {
      views: number;
      bookmarks: number;
    };
  };
}

export function OverviewCards({ data }: OverviewCardsProps) {
  const cards = [
    {
      label: "Total Users",
      value: data.users.total.toLocaleString(),
      sub: `+${data.users.newThisMonth} this month`,
      icon: Users,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      trend: data.users.growth,
    },
    {
      label: "Total Content",
      value: data.content.total.toLocaleString(),
      sub: `${data.content.pending} pending approval`,
      icon: BookOpen,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      trend: null,
    },
    {
      label: "Total Downloads",
      value: data.downloads.total.toLocaleString(),
      sub: `${data.downloads.today} today · ${data.downloads.thisWeek} this week`,
      icon: Download,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      trend: null,
    },
    {
      label: "Active Users",
      value: data.users.active.toLocaleString(),
      sub: "Last 30 days",
      icon: Activity,
      iconBg: "bg-accent",
      iconColor: "text-accent-foreground",
      trend: null,
    },
    {
      label: "Total Views",
      value: data.engagement.views.toLocaleString(),
      sub: "All time",
      icon: Eye,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      trend: null,
    },
    {
      label: "Bookmarks",
      value: data.engagement.bookmarks.toLocaleString(),
      sub: "Saved by users",
      icon: Bookmark,
      iconBg: "bg-accent",
      iconColor: "text-accent-foreground",
      trend: null,
    },
    {
      label: "Downloads Today",
      value: data.downloads.today.toLocaleString(),
      sub: `${data.downloads.thisMonth} this month`,
      icon: Download,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      trend: null,
    },
    {
      label: "Pending Approvals",
      value: data.content.pending.toLocaleString(),
      sub: "Awaiting review",
      icon: Clock,
      iconBg: "bg-accent",
      iconColor: "text-accent-foreground",
      trend: null,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-card rounded-2xl border border-border p-4 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground truncate">
                {card.label}
              </p>
              <p className="font-serif text-2xl font-bold text-foreground mt-1">
                {card.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {card.sub}
              </p>
            </div>
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ml-2 ${card.iconBg}`}
            >
              <card.icon className={`w-4 h-4 ${card.iconColor}`} />
            </div>
          </div>

          {/* Growth indicator */}
          {card.trend !== null && (
            <div className="flex items-center gap-1 mt-2">
              {card.trend >= 0 ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-destructive" />
              )}
              <span
                className={`text-xs font-medium ${
                  card.trend >= 0
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-destructive"
                }`}
              >
                {Math.abs(card.trend)}% vs last month
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}