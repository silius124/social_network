import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../auth/useAuthStore";
import { api } from "@/api/api";
import type z from "zod";
import type { updateProfileSchema } from "./profile.schema";

type UpdateProfile = z.infer<typeof updateProfileSchema>;

export const useUpdateProfle = () => {
  const queryClient = useQueryClient();
  const updateProfileState = useAuthStore((state) => state.updateProfile);
  return useMutation({
    mutationFn: async (data: UpdateProfile) => {
      const response = await api.patch("/users/me", data);
      return response.data;
    },
    onSuccess: (updatedData) => {
      updateProfileState(updatedData);

      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useUsersProfile = (username: string) => {
  return useQuery({
    queryKey: ["user", username],
    queryFn: async () => {
      const { data } = await api.get(`/users/${username}`);
      return data;
    },
  });
};

export const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: ["users", "search", query],
    queryFn: async () => {
      if (!query) return [];
      const { data } = await api.get(`/users/search?q=${query}`);
      return data;
    },
    enabled: query.length > 0,
  });
};
