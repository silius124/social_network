import { api } from "@/api/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Comment {
  content: string;
  postId: number;
}

export const useComments = (postId: number) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const { data } = await api.get(`comments/post/${postId}`);
      return data;
    },
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comment: Comment) => {
      const { data } = await api.post("comments", comment);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.postId],
      });
    },
  });
};
