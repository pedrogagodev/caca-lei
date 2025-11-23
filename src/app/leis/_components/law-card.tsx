"use client";

import { ChatCircle } from "@phosphor-icons/react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { LawListCard } from "@/components/law-list-card";
import { UpvoteButton } from "./upvote-button";
import { topicIcons } from "@/constants/topic-icons";
import { lawStatusConfig } from "@/constants/law-status-config";
import type { Law } from "@/types/law.types";

interface LawCardProps {
  law: Law;
}

export function LawCard({ law }: LawCardProps) {
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(
    Number.parseInt(law.support.replace(/\D/g, "")),
  );

  const engagementCount = law.engagements.split(" ")[1];

  // Get status configuration
  const status =
    lawStatusConfig[law.status as keyof typeof lawStatusConfig] ??
    lawStatusConfig["Em discussão"];
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
        <div className="flex flex-col items-end gap-2 shrink-0">
          {/* Status badge */}
          <Badge
            variant={status.variant}
            className={`gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium sm:px-2.5 sm:py-1 sm:text-[10px] whitespace-nowrap ${status.badgeClass}`}
          >
            <StatusIcon size={10} weight="fill" className="sm:w-3 sm:h-3" />
            <span>{law.status}</span>
          </Badge>
          {/* Upvote button - quadrado/retangular */}
          <UpvoteButton
            count={upvoteCount}
            active={isUpvoted}
            onClick={handleUpvote}
          />
        </div>
      }
    >
      {/* Block 1: Title (Maximum weight) */}
      <div>
        <h3 className="text-lg font-bold leading-snug tracking-tight transition-colors duration-200 sm:text-xl sm:leading-tight group-hover:text-primary">
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
              className="gap-1 rounded-full border border-foreground/10 bg-muted/50 px-2.5 py-1 text-xs font-normal text-muted-foreground sm:py-0.5 sm:text-[10px]"
            >
              {TopicIcon && <TopicIcon weight="regular" className="h-3.5 w-3.5 sm:h-3 sm:w-3" />}
              <span>{topic}</span>
            </Badge>
          );
        })}
        {remainingTopicsCount > 0 && (
          <Badge
            variant="outline"
            className="rounded-full border-foreground/10 px-2 py-0.5 text-xs font-normal text-muted-foreground sm:text-[10px]"
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
              className="ml-1 inline-flex items-center text-sm font-medium text-primary transition-colors duration-150 hover:text-primary/80 min-h-[44px] sm:min-h-0 -my-2 sm:my-0"
            >
              Leia mais
            </button>
          )}
        </p>
      </div>

      {/* Block 4: Metrics (Compact) */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground sm:text-xs">
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
