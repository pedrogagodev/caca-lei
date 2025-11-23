import Link from "next/link";
import {
  Shield,
  Bus,
  Heart,
  RoadHorizon,
  FirstAid,
  Briefcase,
  GraduationCap,
  LockKey,
  Circle,
  ClockCounterClockwise,
  CheckCircle,
  XCircle,
  ChatCircle,
} from "@phosphor-icons/react/dist/ssr";
import { Card } from "@/components/ui/card";
import { LawListCard } from "@/components/ui/law-list-card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarFilters } from "@/app/leis/_components/sidebar-filters";
import { MobileFilters } from "@/app/leis/_components/mobile-filters";
import { getAllBills } from "@/app/actions/bills";
import type { Bill } from "@/types/database.types";
import { UpvoteButton } from "@/app/_components/upvote-button";

// Topic icon mapping
const topicIcons: Record<
  string,
  React.ComponentType<{ size?: number; weight?: "regular" | "fill" }>
> = {
  Transporte: Bus,
  Inclusão: Heart,
  Mobilidade: RoadHorizon,
  Saúde: FirstAid,
  "Serviço Público": Briefcase,
  Educação: GraduationCap,
  Privacidade: LockKey,
};

// Status configuration with icons
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
    icon: Circle,
    badgeClass:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400",
  },
  "Em votação": {
    variant: "secondary",
    icon: ClockCounterClockwise,
    badgeClass:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400",
  },
  Aprovada: {
    variant: "outline",
    icon: CheckCircle,
    badgeClass:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400",
  },
  Arquivada: {
    variant: "destructive",
    icon: XCircle,
    badgeClass:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400",
  },
};

function LawCard({ bill }: { bill: Bill }) {
  // Calculate support percentage from supports_count (assuming it's out of total reactions)
  const supportPercentage = bill.supports_count;
  const engagementCount = bill.comments_count;

  // Tag limiting: show max 2 tags
  const visibleTopics = bill.tags.slice(0, 2);
  const remainingTopicsCount = bill.tags.length - visibleTopics.length;

  // Truncate description to 80 characters
  const maxDescriptionLength = 80;
  const summary = bill.summary || "";
  const isTruncated = summary.length > maxDescriptionLength;
  const truncatedSummary = isTruncated
    ? summary.slice(0, maxDescriptionLength).trim() + "..."
    : summary;

  // Get status configuration
  const status = statusConfig[bill.status] || statusConfig["Em discussão"];
  const StatusIcon = status.icon;

  return (
    <LawListCard
      leading={undefined}
      actions={
        <div className="flex items-center gap-2">
          {/* Status badge - positioned with actions */}
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
      {/* Block 1: Title (Maximum weight) */}
      <div>
        <h3 className="text-xl font-bold leading-tight tracking-tight transition-colors duration-200 group-hover:text-primary">
          {bill.title}
        </h3>
      </div>

      {/* Block 2: Topic Tags (with icons) */}
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

      {/* Block 3: Description (Light weight, truncated) */}
      <div>
        <p className="text-sm font-normal leading-relaxed text-muted-foreground">
          {truncatedSummary}
        </p>
      </div>

      {/* Block 4: Metrics (Compact) */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1 tabular-nums">
          <ChatCircle size={14} weight="regular" />
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

export default async function Home() {
  const bills = await getAllBills({ limit: 5 });

  return (
    <div className="relative min-h-screen">
      <div className="relative mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:grid-cols-[240px_1fr] lg:px-6">
        <aside className="hidden gap-6 sm:flex sm:flex-col">
          <SidebarFilters defaultTheme="all" />
        </aside>

        <section className="space-y-4">
          {/* Mobile Theme Pills - Only visible on small screens */}
          <div className="sm:hidden">
            <MobileFilters defaultTheme="all" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
                Lista de leis
              </p>
              <h1 className="text-3xl font-semibold sm:text-[34px]">
                Descubra, compare, reaja
              </h1>
            </div>
          </div>

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
                  <Shield size={32} weight="regular" className="text-muted-foreground" />
                </div>
                <p className="text-lg font-semibold">Nenhuma lei encontrada</p>
                <p className="max-w-md text-sm text-muted-foreground">
                  Ajuste os filtros acima ou refine sua busca para encontrar leis
                  relevantes.
                </p>
              </Card>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
