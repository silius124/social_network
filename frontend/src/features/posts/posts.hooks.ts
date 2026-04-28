import { api } from "@/api/api";
import { useQuery } from "@tanstack/react-query";

export const usePosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: () => getAll(),
  });
};

async function getAll() {
  const response = await api.get("posts");
  return response.data;
}
