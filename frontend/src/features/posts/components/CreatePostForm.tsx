import { useState } from "react";
import { useCreatePost } from "../posts.hooks";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

const validateFile = (file: File): string | null => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Недопустимый тип файла. Разрешены: JPEG, PNG, WebP, GIF, MP4, WebM, MOV";
  }

  const isVideo = file.type.startsWith("video/");
  const limit = isVideo ? 100 * 1024 * 1024 : 5 * 1024 * 1024;

  if (file.size > limit) {
    return `Файл слишком большой. Максимум ${isVideo ? "100MB" : "5MB"}`;
  }

  return null;
};

function CreatePostForm() {
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const { mutate, isPending } = useCreatePost();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFileError(null);

    if (selected) {
      const error = validateFile(selected);
      if (error) {
        setFileError(error);
        e.target.value = "";
        return;
      }
    }

    setFile(selected);
  };

  const handleSubmit = () => {
    if (!content && !file) return;
    if (fileError) return;

    mutate(
      { content, file: file || undefined },
      {
        onSuccess: () => {
          setContent("");
          setFile(null);
          setFileError(null);
        },
      },
    );
  };

  return (
    <Card className="mt-6">
      <CardContent className="pt-6 space-y-4">
        <Textarea
          placeholder="Что у вас нового?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="max-h-[500px]"
        />
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <Input
              type="file"
              className="w-fit"
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
              onChange={handleFileChange}
            />
            {fileError && (
              <span className="text-xs text-destructive">{fileError}</span>
            )}
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !!fileError || (!content && !file)}
          >
            {isPending ? "Публикация..." : "Опубликовать"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default CreatePostForm;
