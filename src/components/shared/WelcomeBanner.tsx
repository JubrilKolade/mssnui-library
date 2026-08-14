import type { Role } from "@/types";
import { GeometricPattern } from "@/src/components/shared/GeometricPattern";

interface WelcomeBannerProps {
  name: string;
  role: Role;
}

const roleMessages: Record<Role, string> = {
  member: "Explore books, courses and projects",
  contributor: "Share knowledge with the community",
  admin: "Manage and grow the library",
  super_admin: "Full control of the library system",
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function WelcomeBanner({ name, role }: WelcomeBannerProps) {
  const firstName = name.split(" ")[0];

  return (
    <div className="relative overflow-hidden bg-linear-to-br from-emerald-800 to-emerald-950 rounded-2xl p-6 md:p-8 text-amber-50">
      <GeometricPattern
        className="absolute inset-0 text-amber-50/6"
        id="welcome-girih"
      />
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">
          As-salamu alaykum
        </p>
        <h1 className="font-serif text-2xl md:text-3xl font-bold mt-2">
          {getGreeting()}, {firstName}
        </h1>
        <p className="text-amber-100/90 text-sm mt-2">
          {roleMessages[role]}
        </p>
      </div>
    </div>
  );
}
