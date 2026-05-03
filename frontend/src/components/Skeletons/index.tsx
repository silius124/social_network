import { Card, CardContent, CardHeader } from "../ui/card";

interface SkeletonTemplateProps {
  children: React.ReactNode;
}

const SkeletonTemplate = ({ children }: SkeletonTemplateProps) => (
  <div className="w-full animate-pulse">{children}</div>
);

const SkeletonContent = () => (
  <>
    <div className="w-full h-5 mb-2 rounded-2xl bg-slate-300"></div>
    <div className="w-[80%] h-5 rounded-2xl bg-slate-300"></div>
  </>
);

const SkeletonImage = () => (
  <div className="w-full bg-slate-300 h-80 rounded-2xl mt-3"></div>
);

export const SkeletonPost = () => (
  <Card className="my-4">
    <SkeletonTemplate>
      <CardHeader className="flex flex-row items-center gap-2 p-4">
        <div className="w-10 h-10 rounded-full bg-slate-300"></div>
        <div className="flex flex-col">
          <div className="w-25 h-3 rounded-2xl bg-slate-300 mb-2"></div>
          <div className="w-20 h-3  rounded-2xl bg-slate-300"></div>
        </div>
      </CardHeader>

      <CardContent>
        <SkeletonContent />
        <SkeletonImage />
      </CardContent>
    </SkeletonTemplate>
  </Card>
);
