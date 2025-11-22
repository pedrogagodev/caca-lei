"use client";

import {
  ChatCircle,
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
} from "@phosphor-icons/react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { LawListCard } from "@/components/ui/law-list-card";
import { UpvoteButton } from "./upvote-button";

type Law = {
  id: string;
  title: string;
  status: string;
  location: string;
  author: string;
  code: string;
  summary: string;
  topics: string[];
  engagements: string;
  support: string;
  videoLabel: string;
  manager?: {
    feedbackLastDay: number;
    trend: string;
  };
};

// Topic icon mapping
const topicIcons: Record<string, React.ComponentType<{ size?: number; weight?: "regular" | "fill" }>> = {
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
  "Em discussao": {
    variant: "default",
    icon: Circle,
    badgeClass: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400",
  },
  "Em votacao": {
    variant: "secondary",
    icon: ClockCounterClockwise,
    badgeClass: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400",
  },
  Aprovada: {
    variant: "outline",
    icon: CheckCircle,
    badgeClass: "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400",
  },
  Arquivada: {
    variant: "destructive",
    icon: XCircle,
    badgeClass: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400",
  },
};

interface LawCardProps {
  law: Law;
}

export function LawCard({ law }: LawCardProps) {
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(Number.parseInt(law.support.replace(/\D/g, "")));

  const engagementCount = law.engagements.split(" ")[1];
  const normalizedStatus = law.status.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Get status configuration
  const status = statusConfig[normalizedStatus] ?? statusConfig["Em discussao"];
  const StatusIcon = status.icon;

  // Tag limiting: show max 2 tags
  const visibleTopics = law.topics.slice(0, 2);
  const remainingTopicsCount = law.topics.length - visibleTopics.length;

  // Truncate description to 80 characters
  const maxDescriptionLength = 80;
  const isTruncated = law.summary.length > maxDescriptionLength;
  const truncatedSummary = isTruncated
    ? law.summary.slice(0, maxDescriptionLength).trim() + "..."
    : law.summary;

  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isUpvoted) {
      setIsUpvoted(true);
      setUpvoteCount((prev) => prev + 1);
    } else {
      setIsUpvoted(false);
      setUpvoteCount((prev) => prev - 1);
    }
  };

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
            <span>{law.status}</span>
          </Badge>
          <UpvoteButton count={upvoteCount} active={isUpvoted} onClick={handleUpvote} />
        </div>
      }
    >
      {/* Block 1: Title (Maximum weight) */}
      <div>
        <h3 className="text-xl font-bold leading-tight tracking-tight transition-colors duration-200 group-hover:text-primary">
          {law.title}
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
          {isTruncated && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Aqui você pode adicionar lógica para expandir a descrição ou abrir modal
              }}
              className="ml-1 text-sm font-medium text-primary transition-colors duration-150 hover:text-primary/80"
            >
              Leia mais
            </button>
          )}
        </p>
      </div>

      {/* Block 4: Metrics (Compact) */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1 tabular-nums">
          <ChatCircle size={14} weight="regular" />
          <span className="font-medium text-foreground">{engagementCount}</span>
        </span>
        <span className="text-muted-foreground/50">·</span>
        <span className="text-muted-foreground/50">{law.location}</span>
      </div>
    </LawListCard>
  );
}

export type { Law };
