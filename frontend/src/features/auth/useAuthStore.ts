import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand";
import { api } from "@/api/api";
import type z from "zod";
import type { updateProfileSchema } from "../profile/profile.schema";

interface User {
  id: number;
  avatarUrl?: string;
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuth: boolean;
  setAuth: (token: string) => void;
  updateProfile: (data: z.infer<typeof updateProfileSchema>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuth: false,
      setAuth: async (token) => {
        try {
          set({ token: token });
          const { data } = await api.get("/auth/me");
          set({ user: data, isAuth: true });
        } catch {
          set({ token: null, user: null, isAuth: false });
        }
      },
      updateProfile: async (data) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...data } });
        }
      },
      logout: () => {
        set({ token: null, user: null, isAuth: false });
      },
    }),
    { name: "auth-storage", storage: createJSONStorage(() => localStorage) },
  ),
);
