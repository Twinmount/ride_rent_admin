import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

export default function FormSkelton() {
  return (
    <div className="mx-auto flex w-full min-w-full max-w-[700px] flex-col gap-5 rounded-2xl bg-white p-2 px-2 py-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-full bg-gray-300" />
        <Skeleton className="h-8 w-60 bg-gray-200" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-8 w-full bg-gray-300" />
        <Skeleton className="h-8 w-60 bg-gray-200" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-8 w-full bg-gray-300" />
        <Skeleton className="h-8 w-60 bg-gray-200" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-8 w-full bg-gray-300" />
        <Skeleton className="h-8 w-60 bg-gray-200" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-8 w-full bg-gray-300" />
        <Skeleton className="h-8 w-60 bg-gray-200" />
      </div>

      <Button
        size="lg"
        disabled={true}
        className="button col-span-2 mt-3 w-full bg-gray-300 !text-lg !font-semibold text-gray-900"
      ></Button>
    </div>
  );
}
