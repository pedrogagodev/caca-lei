import { LawListCard } from "@/components/ui/law-list-card";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <LawListCard className="flex gap-4 p-4">
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="h-16 w-14 rounded-lg" />
        <Skeleton className="h-8 w-14 rounded-lg" />
      </div>
      <Skeleton className="h-20 w-20 flex-shrink-0 rounded-lg" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-6 w-3/4 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-3 w-1/2 rounded" />
      </div>
    </LawListCard>
  );
}
