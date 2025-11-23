"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ThumbsUp,
  ThumbsDown,
  Question,
  Lightning,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

type ReactionId = "apoio" | "nao-apoio" | "nao-entendi" | "impacta";

interface Reaction {
  id: ReactionId;
  icon: Icon;
  label: string;
  count: number;
  activeColor: {
    bg: string;
    border: string;
    text: string;
    icon: string;
  };
}

const reactions: Reaction[] = [
  {
    id: "apoio",
    icon: ThumbsUp,
    label: "Apoio",
    count: 123,
    activeColor: {
      bg: "bg-emerald-500/20",
      border: "border-emerald-400/60",
      text: "text-emerald-100",
      icon: "text-emerald-300",
    },
  },
  {
    id: "nao-apoio",
    icon: ThumbsDown,
    label: "Não apoio",
    count: 45,
    activeColor: {
      bg: "bg-rose-500/20",
      border: "border-rose-400/60",
      text: "text-rose-100",
      icon: "text-rose-300",
    },
  },
  {
    id: "nao-entendi",
    icon: Question,
    label: "Não entendi",
    count: 89,
    activeColor: {
      bg: "bg-amber-500/20",
      border: "border-amber-400/60",
      text: "text-amber-100",
      icon: "text-amber-300",
    },
  },
  {
    id: "impacta",
    icon: Lightning,
    label: "Impacta",
    count: 234,
    activeColor: {
      bg: "bg-violet-500/20",
      border: "border-violet-400/60",
      text: "text-violet-100",
      icon: "text-violet-300",
    },
  },
];

export function VideoReactionsOverlay() {
  const [selectedReaction, setSelectedReaction] = useState<ReactionId | null>(
    null,
  );

  const handleReactionClick = (reactionId: ReactionId) => {
    setSelectedReaction(selectedReaction === reactionId ? null : reactionId);
  };

  return (
    <div
      className={cn(
        "absolute z-20 flex flex-col gap-3",
        // Mobile: Bottom-right (above thumb zone)
        "bottom-6 right-3",
        // Desktop: Center-right
        "lg:right-6 lg:top-1/2 lg:-translate-y-1/2 lg:bottom-auto",
      )}
    >
      {reactions.map((reaction) => {
        const isActive = selectedReaction === reaction.id;
        const ReactionIcon = reaction.icon;
        return (
          <button
            key={reaction.id}
            onClick={() => handleReactionClick(reaction.id)}
            aria-label={`${reaction.label}: ${reaction.count} reações`}
            aria-pressed={isActive}
            className={cn(
              "flex h-12 w-12 flex-col items-center justify-center gap-0.5 rounded-full border transition-all duration-200",
              "backdrop-blur-md",
              // Default state
              !isActive &&
                "border-white/10 bg-black/40 hover:scale-110 hover:bg-black/60",
              // Active state with color glow
              isActive && [
                "scale-110",
                reaction.activeColor.bg,
                reaction.activeColor.border,
              ],
              // Hover and active interactions
              "active:scale-95",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
            )}
          >
            <ReactionIcon
              size={20}
              weight={isActive ? "fill" : "regular"}
              className={cn(
                "transition-colors duration-200",
                isActive ? reaction.activeColor.icon : "text-white",
              )}
              aria-hidden="true"
            />
            <span
              className={cn(
                "text-[10px] font-semibold leading-none tabular-nums",
                isActive ? reaction.activeColor.text : "text-white",
              )}
            >
              {reaction.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
