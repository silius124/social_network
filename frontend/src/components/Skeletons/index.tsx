import { Card, CardContent, CardHeader } from "../ui/card";

interface SkeletonTemplateProps {
  className: string;
}

export const Skeleton = ({ className }: SkeletonTemplateProps) => (
  <div className={`${className} animate-pulse bg-slate-300`} />
);

export const SkeletonPost = () => (
  <Card className="my-4">
    <CardHeader className="flex flex-row items-center gap-2 p-4">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex flex-col">
        <Skeleton className="w-25 h-3 rounded-2xl mb-2" />
        <Skeleton className="w-20 h-3  rounded-2xl" />
      </div>
    </CardHeader>

    <CardContent>
      <Skeleton className="w-full h-5 mb-2 rounded-2xl" />
      <Skeleton className="w-[80%] h-5 mb-2 rounded-2xl" />
      <Skeleton className="w-full h-80 mt-3 rounded-2xl" />
    </CardContent>
  </Card>
);
