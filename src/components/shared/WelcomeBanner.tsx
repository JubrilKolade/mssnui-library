import type { Role } from "@/types";

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
    <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
      <h1 className="text-xl md:text-2xl font-bold">
        {getGreeting()}, {firstName} 👋
      </h1>
      <p className="text-green-100 text-sm mt-1">
        {roleMessages[role]}
      </p>
    </div>
  );
}