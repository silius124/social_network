import { useMutation } from "@tanstack/react-query";
import type { loginSchema, registerSchema } from "./auth.schema";
import { useAuthStore } from "./useAuthStore";
import { api } from "@/api/api";

type RegisterInput = z.infer<typeof registerSchema>;
type LoginInput = z.infer<typeof loginSchema>;

export const useRegisterMutation = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      const response = await api.post("/auth/register", data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      setAuth(data.access_token, data.user || { email: variables.email });
    },
  });
};

export const useLoginrMutation = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await api.post("/auth/login", data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      setAuth(data.access_token, data.user || { email: variables.email });
    },
  });
};
