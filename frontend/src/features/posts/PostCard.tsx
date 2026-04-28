import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

function PostCard({ post }: { post: any }) {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <Avatar>
          <AvatarImage src={post.user?.avatarUrl} />
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
    </Card>
  );
}

export default PostCard;
