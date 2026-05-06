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
