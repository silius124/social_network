import { api } from "@/api/api";
import type { Chat } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

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
  });
};
