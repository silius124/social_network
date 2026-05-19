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
      console.log(updatedData);

      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });
};

export const useUsersProfile = (username?: string, id?: number) => {
  return useQuery({
    queryKey: ["user", username, id],
    queryFn: async () => {
      const { data } = await api.get(`/users/${username ? username : id}`);
      return data;
    },
    enabled: !!id || !!username,
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
