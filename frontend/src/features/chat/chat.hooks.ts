import { api } from "@/api/api";
import type { Chat } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useChats = () => {
  return useQuery({
    queryKey: ["chats"],
    queryFn: async (): Promise<Chat[]> => {
      const { data } = await api.get("/chats");
      return data;
    },
  });
};

export const useChatMessages = (chatId: number | null) => {
  return useQuery({
    queryKey: ["messages", chatId],
    queryFn: async () => {
      if (!chatId) return;
      const { data } = await api.get(`/chats/${chatId}/messages`);
      return data;
    },
    enabled: !!chatId,
  });
};

export const useExistingChat = (friendId: number | null) => {
  return useQuery({
    queryKey: ["existingChat", friendId],
    queryFn: async () => {
      if (!friendId) return;
      const { data } = await api.get(`chats/find/${friendId}`);
      return data;
    },
  });
};

export const useDeleteChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chatId: number) => {
      const { data } = await api.delete(`chats/${chatId}`);
      return data;
    },
    onSuccess: (_, variants) => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      queryClient.removeQueries({
        queryKey: ["messages", Number(variants)],
      });
    },
  });
};
