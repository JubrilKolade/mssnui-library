import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  href?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  iconColor,
  iconBg,
  href,
}: StatCardProps) {
  const content = (
    <div className="bg-card rounded-2xl border border-border p-4 md:p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-serif text-2xl font-bold text-foreground mt-1">
            {value.toLocaleString()}
          </p>
        </div>
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", iconBg)}>
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}