import { Container } from "@/components/Container";
import { SkeletonPost } from "@/components/Skeletons";
import CreatePostForm from "@/features/posts/components/CreatePostForm";
import PostCard from "@/features/posts/components/PostCard";
import { usePosts } from "@/features/posts/posts.hooks";
import type { Post } from "@/types/types";

function HomePage() {
  const { data: posts, isLoading } = usePosts();

  if (isLoading) {
    return (
      <Container>
        <SkeletonPost />
        <SkeletonPost />
      </Container>
    );
  }
  return (
    <Container>
      <CreatePostForm />
      {posts?.length > 0 ? (
        posts.map((post: Post) => <PostCard key={post.id} post={post} />)
      ) : (
        <div className="text-center text-slate-500">
          Постов пока нет. Будьте первым!
        </div>
      )}
    </Container>
  );
}

export default HomePage;
