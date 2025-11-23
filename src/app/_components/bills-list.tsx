"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  ShieldIcon,
  BusIcon,
  HeartIcon,
  RoadHorizonIcon,
  FirstAidIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  LockKeyIcon   ,
  CircleIcon,
  ClockCounterClockwiseIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChatCircleIcon,
} from "@phosphor-icons/react";
import { Card } from "@/components/ui/card";
import { LawListCard } from "@/components/law-list-card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { Bill } from "@/types/database.types";
import { UpvoteButton } from "@/app/_components/upvote-button";
import { loadMoreBills } from "@/app/actions/bills";

const topicIcons: Record<
  string,
  React.ComponentType<{ size?: number; weight?: "regular" | "fill" }>
> = {
  Transporte: BusIcon,
  Inclusão: HeartIcon,
  Mobilidade: RoadHorizonIcon,
  Saúde: FirstAidIcon,
  "Serviço Público": BriefcaseIcon,
  Educação: GraduationCapIcon,
  Privacidade: LockKeyIcon,
};

const statusConfig: Record<
  string,
  {
    variant: "default" | "secondary" | "outline" | "destructive";
    icon: React.ComponentType<{ size?: number; weight?: "regular" | "fill" }>;
    badgeClass: string;
  }
> = {
  "Em discussão": {
    variant: "default",
    icon: CircleIcon,
    badgeClass:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400",
  },
  "Em votação": {
    variant: "secondary",
    icon: ClockCounterClockwiseIcon,
    badgeClass:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400",
  },
  Aprovada: {
    variant: "outline",
    icon: CheckCircleIcon,
    badgeClass:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400",
  },
  Arquivada: {
    variant: "destructive",
    icon: XCircleIcon,
    badgeClass:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400",
  },
};

function LawCard({ bill }: { bill: Bill }) {
  const supportPercentage = bill.supports_count;
  const engagementCount = bill.comments_count;

  const visibleTopics = bill.tags.slice(0, 2);
  const remainingTopicsCount = bill.tags.length - visibleTopics.length;

  const maxDescriptionLength = 80;
  const summary = bill.summary || "";
  const isTruncated = summary.length > maxDescriptionLength;
  const truncatedSummary = isTruncated
    ? summary.slice(0, maxDescriptionLength).trim() + "..."
    : summary;

  const status = statusConfig[bill.status] || statusConfig["Em discussão"];
  const StatusIcon = status.icon;

  return (
    <LawListCard
      leading={undefined}
      actions={
        <div className="flex items-center gap-2">
          <Badge
            variant={status.variant}
            className={`gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium ${status.badgeClass}`}
          >
            <StatusIcon size={12} weight="fill" />
            <span>{bill.status}</span>
          </Badge>
          <UpvoteButton billId={bill.id} initialCount={supportPercentage} />
        </div>
      }
    >
      <div>
        <h3 className="text-xl font-bold leading-tight tracking-tight transition-colors duration-200 group-hover:text-primary">
          {bill.title}
        </h3>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {visibleTopics.map((topic) => {
          const TopicIcon = topicIcons[topic];
          return (
            <Badge
              key={topic}
              variant="secondary"
              className="gap-1 rounded-full border border-foreground/10 bg-muted/50 px-2.5 py-0.5 text-[10px] font-normal text-muted-foreground"
            >
              {TopicIcon && <TopicIcon size={11} weight="regular" />}
              <span>{topic}</span>
            </Badge>
          );
        })}
        {remainingTopicsCount > 0 && (
          <Badge
            variant="outline"
            className="rounded-full border-foreground/10 px-2 py-0.5 text-[10px] font-normal text-muted-foreground"
          >
            +{remainingTopicsCount}
          </Badge>
        )}
      </div>

      <div>
        <p className="text-sm font-normal leading-relaxed text-muted-foreground">
          {truncatedSummary}
        </p>
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1 tabular-nums">
          <ChatCircleIcon size={14} weight="regular" />
          <span className="font-medium text-foreground">
            {engagementCount}
          </span>
        </span>
        <span className="text-muted-foreground/50">·</span>
        <span className="text-muted-foreground/50">{bill.location}</span>
      </div>
    </LawListCard>
  );
}

function SkeletonCard() {
  return (
    <LawListCard
      leading={undefined}
      actions={
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-10 w-20 rounded-full" />
        </div>
      }
    >
      <Skeleton className="h-7 w-3/4 rounded" />
      <div className="flex gap-1.5">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-3 w-1/3 rounded" />
    </LawListCard>
  );
}

interface BillsListProps {
  initialBills: Bill[];
}

export function BillsList({ initialBills }: BillsListProps) {
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [offset, setOffset] = useState(5); // Start at 5 since we already loaded 5
  const [hasMore, setHasMore] = useState(initialBills.length === 5);
  const [isPending, startTransition] = useTransition();

  const handleLoadMore = () => {
    startTransition(async () => {
      const newBills = await loadMoreBills(offset);
      
      if (newBills.length === 0 || newBills.length < 5) {
        setHasMore(false);
      }
      
      if (newBills.length > 0) {
        setBills((prev) => [...prev, ...newBills]);
        setOffset((prev) => prev + 5);
      }
    });
  };

  return (
    <>
      <div className="space-y-3">
        {bills.length > 0 ? (
          bills.map((bill) => (
            <Link key={bill.id} href={`/leis/${bill.id}`} className="block">
              <LawCard bill={bill} />
            </Link>
          ))
        ) : (
          <Card className="flex flex-col items-center gap-3 px-6 py-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <ShieldIcon size={32} weight="regular" className="text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold">Nenhuma lei encontrada</p>
            <p className="max-w-md text-sm text-muted-foreground">
              Ajuste os filtros acima ou refine sua busca para encontrar leis
              relevantes.
            </p>
          </Card>
        )}

        {/* Loading skeletons */}
        {isPending && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}
      </div>

      {/* Load More Button */}
      {hasMore && !isPending && (
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            className="transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Carregar mais leis
          </Button>
        </div>
      )}
    </>
  );
}

