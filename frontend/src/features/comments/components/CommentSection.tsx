import { useState } from "react";
import { useComments, useCreateComment } from "../comments.hook";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

function CommentSection({ postId }: { postId: number }) {
  const [content, setContent] = useState<string>();
  const { data: comments, isLoading } = useComments(postId);
  const { mutate: createComment, isPending } = useCreateComment();

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!content?.trim()) return;
    createComment(
      { content, postId },
      {
        onSuccess: () => setContent(""),
      },
    );
  };

  return (
    <Card className="mt-4 pt-4 border-t space-y-4">
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <Input
            placeholder="Написать комментарий..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-8 text-sm"
          />
          <Button
            size="sm"
            type="submit"
            disabled={isPending || !content?.trim()}
          >
            Отправить
          </Button>
        </form>

        <div className="space-y-3">
          {isLoading ? (
            <p className="text-xs text-slate-400">Загрузка...</p>
          ) : (
            comments?.map((comment: any) => (
              <div
                key={comment.id}
                className="flex gap-2 items-start text-sm bg-slate-100 p-2 rounded-lg"
              >
                <Link to={`profile/${comment?.user?.username}`}>
                  <Avatar className="h-7 w-7">
                    <AvatarImage
                      src={`http://localhost:3000${comment?.user?.avatarUrl}`}
                    />
                    <AvatarFallback>
                      {comment?.user?.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="  flex-1">
                  <Link to={`profile/${comment?.user?.username}`}>
                    <p className="font-semibold text-xs mb-1">
                      {comment?.user?.firstName} {comment?.user?.lastName}
                    </p>
                    <p className="text-xs mb-1 text-slate-500">
                      @{comment?.user?.username}
                    </p>
                  </Link>
                  <p>{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default CommentSection;
