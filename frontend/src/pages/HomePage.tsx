import CreatePostForm from "@/features/posts/components/CreatePostForm";
import PostCard from "@/features/posts/components/PostCard";
import { usePosts } from "@/features/posts/posts.hooks";

function HomePage() {
  const { data: posts, isLoading } = usePosts();

  if (isLoading) return <div className="text-center">Загрузка постов...</div>;
  return (
    <div className="max-w-2xl mx-auto px-3">
      <CreatePostForm />
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
