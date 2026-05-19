import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Heart, MessageCircle, Trash2Icon } from "lucide-react";
import { useDeletePost, useToggleLikePost } from "../posts.hooks";
import { useAuthStore } from "@/features/auth/useAuthStore";
import CommentSection from "@/features/comments/components/CommentSection";
import { useState } from "react";
import type { Post, PostLike } from "@/types/types";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function PostCard({ post }: { post: Post }) {
  const [showComments, setShowComments] = useState<boolean>(false);
  const { user } = useAuthStore();
  const { mutate: deletePost } = useDeletePost();
  const { mutate: toggleLikePost } = useToggleLikePost();
  const isAuthor = post.userId === user?.id;
  const isLiked = post?.like?.some(
    (like: PostLike) => like.userId === user?.id,
  );

  return (
    <>
      <Card className="my-4">
        <CardHeader className="flex flex-row items-center gap-3 p-4">
          <Link to={`/profile/${post.userId}`}>
            <Avatar>
              <AvatarImage
                src={`http://192.168.1.101:3000${post.user?.avatarUrl}`}
                className="w-10 h-10 rounded-full object-cover"
              />
              <AvatarFallback>
                {post.user?.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <Link to={`/profile/${post.userId}`}>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">
                {post.user?.firstName} {post.user?.lastName}
              </span>
              <span className="text-xs text-slate-500">
                @{post.user?.username}
              </span>
            </div>
          </Link>

          {isAuthor && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-destructive"
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Вы уверены, что хотите удалить пост?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Это действие необратимо. Пост будет удален с сервера
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deletePost(post.id)}
                    className="bg-destructive text-white hover:bg-destructive/30 hover:text-destructive/80"
                  >
                    Удалить
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <p className="text-sm mb-3">{post.content}</p>
          {post.imageUrl && (
            <img
              src={`http://192.168.1.101:3000${post.imageUrl}`}
              alt="Post content"
              loading="lazy"
              className="rounded-lg w-full object-cover h-auto max-h-[500px]"
            />
          )}
          {post.videoUrl && (
            <div className="rounded-lg overflow-hidden bg-black flex justify-center items-center">
              <video
                controls
                className="w-full object-contain h-auto max-h-[900px]"
                preload="metadata"
              >
                <source
                  src={`http://192.168.1.101:3000/${post.videoUrl}`}
                  type="video/mp4"
                />
              </video>
            </div>
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
            {post._count.like}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="gap-2 text-slate-500"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle />
            {post._count.comment || 0}
          </Button>
        </CardFooter>
      </Card>
      {showComments && <CommentSection postId={post.id} />}
    </>
  );
}

export default PostCard;
