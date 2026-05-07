import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Heart, Trash2Icon } from "lucide-react";
import { useDeletePost, useToggleLikePost } from "../posts.hooks";
import { useAuthStore } from "@/features/auth/useAuthStore";

function PostCard({ post }: { post: any }) {
  const { user } = useAuthStore();
  const { mutate: deletePost } = useDeletePost();
  const { mutate: toggleLikePost } = useToggleLikePost();
  const isAuthor = post.userId === user?.id;
  const isLiked = post?.like?.some((like: any) => like.userId === user?.id);

  return (
    <Card className="my-4">
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <Avatar>
          <AvatarImage
            src={`http://localhost:3000${post.user?.avatarUrl}`}
            className="w-10 h-10 rounded-full object-cover"
          />
          <AvatarFallback>
            {post.user?.username[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold text-sm">
            {post.user?.firstName} {post.user?.lastName}
          </span>
          <span className="text-xs text-slate-500">@{post.user?.username}</span>
        </div>
        {isAuthor && (
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-destructive"
            onClick={() => deletePost(post.id)}
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <p className="text-sm mb-3">{post.content}</p>
        {post.imageUrl && (
          <img
            src={`http://localhost:3000${post.imageUrl}`}
            alt="Post content"
            className="rounded-lg w-full object-cover mah-h-96"
          />
        )}
      </CardContent>

      <CardFooter>
        <Button
          variant="ghost"
          size="sm"
          className={`gap-2 ${isLiked ? "text-red-500 hover:text-red-600" : "text-slate-500"}`}
          onClick={() => toggleLikePost(post.id)}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          <span>{post._count.like}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default PostCard;
