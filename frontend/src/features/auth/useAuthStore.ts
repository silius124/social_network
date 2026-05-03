import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand";
import { api } from "@/api/api";

interface User {
  id: number;
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
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuth: false,
      setAuth: (token) => {
        set({ token });
      },
      logout: () => {
        set({ token: null, user: null, isAuth: false });
      },
      checkAuth: async () => {
        try {
          const { data } = await api.get("/auth/me");
          console.log(data);
          set({ user: data, isAuth: true });
        } catch {
          set({ token: null, user: null, isAuth: false });
        }
      },
    }),
    { name: "auth-storage", storage: createJSONStorage(() => localStorage) },
  ),
);
