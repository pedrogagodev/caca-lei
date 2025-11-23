import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Bus,
  Heart,
  RoadHorizon,
  FirstAid,
  Briefcase,
  GraduationCap,
  LockKey,
} from "@phosphor-icons/react/dist/ssr";
import { StatusBadge } from "./status-badge";
import { LawSummaryCard } from "./law-summary-card";
import { QuickActions } from "./quick-actions";
import { SocialProofMetrics } from "./social-proof-metrics";
import { ReactionButtons } from "./reaction-buttons";
import { CommentsSection } from "./comments-section";
import { RelatedBills } from "./related-bills";

// Topic icon mapping (matching the listing page)
const topicIcons: Record<string, typeof Bus> = {
  Transporte: Bus,
  Inclusão: Heart,
  Mobilidade: RoadHorizon,
  Saúde: FirstAid,
  "Serviço Público": Briefcase,
  Educação: GraduationCap,
  Privacidade: LockKey,
};

interface LawContentProps {
  law: {
    id: number;
    breadcrumb: string[];
    status: string;
    tags: string[];
    title: string;
    code: string;
    location: string;
    author: string;
  };
  summary: string;
  engagementMetrics: {
    comments: number;
    supports: number;
  };
  reactionCounts: {
    apoio: number;
    "nao-apoio": number;
    "nao-entendi": number;
    impacta: number;
  };
  relatedBills: Array<{
    id: number;
    title: string;
    code: string;
    status: string;
    tags: string[];
    location: string;
  }>;
  comments: Array<{
    id: string;
    author: {
      name: string;
      avatar?: string;
      isAuthor?: boolean;
    };
    text: string;
    timestamp: string;
    upvotes: number;
    replies?: Array<{
      id: string;
      author: {
        name: string;
        avatar?: string;
        isAuthor?: boolean;
      };
      text: string;
      timestamp: string;
      upvotes: number;
    }>;
  }>;
  totalComments: number;
}

export function LawContent({
  law,
  summary,
  engagementMetrics,
  reactionCounts,
  relatedBills,
  comments,
  totalComments,
}: LawContentProps) {
  return (
    <main className="space-y-8" aria-label="Conteúdo da lei">
      {/* 1. Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          {law.breadcrumb.map((item, idx) => (
            <React.Fragment key={item}>
              <BreadcrumbItem>
                {idx < law.breadcrumb.length - 1 ? (
                  <BreadcrumbLink asChild>
                    <Link href={idx === 0 ? "/" : "/leis"}>{item}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {idx < law.breadcrumb.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      {/* 2. Hero Section */}
      <header className="space-y-4">
        {/* Status & Tags */}
        <div className="flex flex-wrap items-center gap-1.5">
          <StatusBadge status={law.status} />
          {law.tags.map((tag) => {
            const TopicIcon = topicIcons[tag];
            return (
              <Badge
                key={tag}
                variant="secondary"
                className="gap-1 rounded-full border border-foreground/10 bg-muted/50 px-2.5 py-0.5 text-[10px] font-normal text-muted-foreground transition-all duration-200 hover:scale-105"
              >
                {TopicIcon && <TopicIcon size={11} weight="regular" />}
                <span>{tag}</span>
              </Badge>
            );
          })}
        </div>

        {/* Title - Hero Treatment */}
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            {law.title}
          </h1>
          <p className="text-base text-muted-foreground lg:text-lg">
            {law.code} · {law.location} · {law.author}
          </p>
        </div>
      </header>

      {/* 3. Social Proof Metrics */}
      <SocialProofMetrics
        comments={engagementMetrics.comments}
        supports={engagementMetrics.supports}
      />

      {/* 4. Engagement Buttons (Reactions) */}
      <ReactionButtons billId={law.id} initialCounts={reactionCounts} />

      {/* 5. Quick Actions */}
      <QuickActions />

      {/* 6. Summary Card */}
      <LawSummaryCard summary={summary} keyPoints={[]} />

      {/* 7. Comments Section */}
      <CommentsSection comments={comments} totalComments={totalComments} />

      {/* 8. Related Bills */}
      <RelatedBills bills={relatedBills} />
    </main>
  );
}
