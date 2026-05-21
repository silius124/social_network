import { api } from "@/api/api";
import type { Comment, Post } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface CommentCreate {
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

export const useCreateComment = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comment: CommentCreate) => {
      const { data } = await api.post("comments", comment);
      return data;
    },
    onMutate: async (newComment: Comment) => {
      await queryClient.cancelQueries({ queryKey: ["comments", postId] });
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousPosts = queryClient.getQueryData(["posts"]);
      const previousComment = queryClient.getQueryData(["comments", postId]);

      queryClient.setQueryData(["posts"], (oldPosts: Post[]) => {
        if (!oldPosts) return oldPosts;

        return oldPosts.map((post: Post) => {
          if (post.id === postId) {
            return {
              ...post,
              _count: {
                ...post._count,
                comment: (post._count?.comment || 0) + 1,
              },
            };
          }
          return post;
        });
      });

      queryClient.setQueryData(
        ["comments", postId],
        (oldComments: Comment[]) => {
          const optimisticComment = {
            id: Date.now(),
            content: newComment.content,
            postId: newComment.postId,
            createdAt: new Date().toISOString(),
          };
          return oldComments
            ? [...oldComments, optimisticComment]
            : [optimisticComment];
        },
      );

      return { previousPosts, previousComment };
    },

    onError: (err, variables, context) => {
      console.error(`Ошибка при создании комментария: ${err}`);

      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }

      if (context?.previousComment) {
        queryClient.setQueryData(["comments", postId], context.previousComment);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", postId],
      });
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });
};

export const useToggleLike = () => {};
