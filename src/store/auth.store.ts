import { create } from "zustand";
import type { Role } from "@/types";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: Role;
}

interface AuthStore {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));