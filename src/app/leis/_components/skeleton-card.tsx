import { LawListCard } from "@/components/ui/law-list-card";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <LawListCard
      leading={<Skeleton className="h-12 w-12 rounded-lg" />}
      actions={
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-14 rounded-full" />
        </div>
      }
    >
      <div className="flex gap-2">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-6 w-3/4 rounded" />
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-3 w-1/2 rounded" />
    </LawListCard>
  );
}
