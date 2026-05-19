import { api } from "@/api/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: () => getAll(),
  });
};

export const useUserPosts = (userId: number) => {
  return useQuery({
    queryKey: ["posts", "users", userId],
    queryFn: async () => {
      const { data } = await api.get(`/users/${userId}/posts`);
      return data;
    },
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, file }: { content: string; file?: File }) => {
      let imageUrl = "";
      let videoUrl = "";

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const isVideo = file.type.startsWith("video/");

        if (isVideo) {
          const uploadRes = await api.post("/uploads/video", formData);
          videoUrl = uploadRes.data.url;
        } else {
          const uploadRes = await api.post("/uploads/post-image", formData);
          imageUrl = uploadRes.data.url;
        }
      }

      const response = await api.post("/posts", {
        content,
        imageUrl,
        videoUrl,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useToggleLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: number) => {
      const { data } = await api.post(`/posts/${postId}/like`);
      return data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: number) => {
      const { data } = await api.delete(`/posts/${postId}`);
      return data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

async function getAll() {
  const response = await api.get("posts");
  return response.data;
}
