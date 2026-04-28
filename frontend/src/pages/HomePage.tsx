import PostCard from "@/features/posts/PostCard";
import { usePosts } from "@/features/posts/posts.hooks";

function HomePage() {
  const { data: posts, isLoading } = usePosts();

  if (isLoading) return <div className="text-center">Загрузка постов...</div>;
  return (
    <div className="max-w-2xl mx-auto">
      {posts?.length > 0 ? (
        posts.map((post: any) => <PostCard key={post.id} post={post} />)
      ) : (
        <div className="text-center text-slate-500">
          Постов пока нет. Будьте первым!
        </div>
      )}
    </div>
  );
}

export default HomePage;
