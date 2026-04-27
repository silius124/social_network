import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand";

interface User {
  id: number;
  email: string;
  password: string;
  username: string;
  firstname: string;
  lastname: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuth: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuth: false,
      setAuth: (token, user) => {
        localStorage.setItem("token", token);
        set({ token, user, isAuth: true });
      },
      logout: () => {
        localStorage.removeItem("token");
        set({ token: null, user: null, isAuth: false });
      },
    }),
    { name: "auth-storage", storage: createJSONStorage(() => localStorage) },
  ),
);
