import { useState } from "react";
import { useCreatePost } from "../posts.hooks";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function CreatePostForm() {
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const { mutate, isPending } = useCreatePost();

  const handleSubmit = () => {
    if (!content && !file) return;
    mutate(
      { content, file: file || undefined },
      {
        onSuccess: () => {
          setContent("");
          setFile(null);
        },
      },
    );
  };

  return (
    <Card className="my-6">
      <CardContent className="pt-6 space-y-4">
        <Textarea
          placeholder="Что у вас нового?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex items-center justify-between gap-4">
          <Input
            type="file"
            className="w-fit"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Публикация..." : "Опубликовать"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default CreatePostForm;
