"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ThumbsUp,
  ThumbsDown,
  Question,
  Lightning,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { saveBillReaction, removeBillReaction } from "@/app/actions/bill-reactions";
import type { ReactionType as ReactionTypeDB } from "@/types/database.types";
import { useAuth } from "@/contexts/auth-context";

type ReactionType = "apoio" | "nao-apoio" | "nao-entendi" | "impacta" | null;

interface Reaction {
  id: ReactionType;
  label: string;
  icon: Icon;
  count: number;
}

interface ReactionButtonsProps {
  billId: number;
  initialCounts?: {
    apoio: number;
    "nao-apoio": number;
    "nao-entendi": number;
    impacta: number;
  };
}

// Reaction configuration with Phosphor icons
const defaultReactions: Omit<Reaction, "count">[] = [
  {
    id: "apoio" as const,
    label: "Apoio",
    icon: ThumbsUp,
  },
  {
    id: "nao-apoio" as const,
    label: "Não apoio",
    icon: ThumbsDown,
  },
  {
    id: "nao-entendi" as const,
    label: "Não entendi",
    icon: Question,
  },
  {
    id: "impacta" as const,
    label: "Me impacta",
    icon: Lightning,
  },
];

// Color styles per reaction type (muted, accessible palette)
const reactionStyles = {
  apoio: {
    border: "border-emerald-200 dark:border-emerald-800/50",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-400",
    icon: "text-emerald-600 dark:text-emerald-500",
  },
  "nao-apoio": {
    border: "border-rose-200 dark:border-rose-800/50",
    bg: "bg-rose-50 dark:bg-rose-950/30",
    text: "text-rose-700 dark:text-rose-400",
    icon: "text-rose-600 dark:text-rose-500",
  },
  "nao-entendi": {
    border: "border-amber-200 dark:border-amber-800/50",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-400",
    icon: "text-amber-600 dark:text-amber-500",
  },
  impacta: {
    border: "border-violet-200 dark:border-violet-800/50",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    text: "text-violet-700 dark:text-violet-400",
    icon: "text-violet-600 dark:text-violet-500",
  },
} as const;

export function ReactionButtons({
  billId,
  initialCounts,
}: ReactionButtonsProps) {
  const [selectedReaction, setSelectedReaction] = useState<ReactionType>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const reactions: Reaction[] = defaultReactions.map((reaction) => ({
    ...reaction,
    count: reaction.id ? (initialCounts?.[reaction.id] ?? 0) : 0,
  }));

  const isAuthenticated = !!user;

  const handleReactionClick = (reactionId: ReactionType) => {
    if (!isAuthenticated) {
      router.push(`/login?redirectTo=${encodeURIComponent(pathname)}`);
      return;
    }

    const newReaction = selectedReaction === reactionId ? null : reactionId;

    setSelectedReaction(newReaction);

    startTransition(async () => {
      if (newReaction) {
        const success = await saveBillReaction(
          billId,
          newReaction as ReactionTypeDB,
        );
        if (success) {
          router.refresh();
        }
      } else {
        const success = await removeBillReaction(billId);
        if (success) {
          router.refresh();
        }
      }
    });
  };

  return (
    <section className="space-y-3" aria-label="Sua opinião sobre este projeto">
      {/* Header */}
      <div>
        <h3 className="text-sm font-medium text-foreground">Sua opinião</h3>
        <p className="text-xs text-muted-foreground">
          Como esta lei te afeta?
        </p>
      </div>

      {/* Reaction Buttons Grid */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {reactions.map((reaction) => {
          const isActive = selectedReaction === reaction.id;
          const displayCount = reaction.count + (isActive ? 1 : 0);
          const ReactionIcon = reaction.icon;
          const styles = reactionStyles[reaction.id as keyof typeof reactionStyles];

          return (
            <button
              key={reaction.id}
              type="button"
              onClick={() => handleReactionClick(reaction.id)}
              aria-pressed={isActive}
              aria-label={`${reaction.label}${displayCount > 0 ? ` (${displayCount} ${displayCount === 1 ? "pessoa" : "pessoas"})` : ""}`}
              disabled={isPending || !isAuthenticated || loading}
              className={cn(
                // Base structure
                "relative flex flex-col items-center justify-center gap-1.5 px-3 py-3",
                "rounded-lg border bg-background",

                // Typography
                "text-sm font-medium",

                // Default state (unselected)
                "border-foreground/10 text-muted-foreground",

                // Interactions
                "transition-all duration-200 ease-out",
                !isAuthenticated || loading
                  ? "cursor-not-allowed opacity-60"
                  : "hover:scale-[1.02] hover:border-foreground/20 hover:bg-muted/30",
                "active:scale-[0.98]",

                // Focus (keyboard accessibility)
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",

                // Touch targets
                "min-h-[44px] touch-action-manipulation",

                // Active state (selected)
                isActive && styles.border,
                isActive && styles.bg,
                isActive && styles.text,


                isPending && "opacity-50 cursor-not-allowed"
              )}
            >
              {/* Icon */}
              <ReactionIcon
                size={20}
                weight={isActive ? "fill" : "regular"}
                className={cn(
                  "transition-colors duration-200",
                  isActive ? styles.icon : "text-muted-foreground"
                )}
                aria-hidden="true"
              />

              {/* Label */}
              <span className="text-xs">{reaction.label}</span>

              {/* Count Badge */}
              {displayCount > 0 && (
                <span
                  className={cn(
                    "tabular-nums text-[10px] font-semibold",
                    isActive ? styles.text : "text-muted-foreground/70"
                  )}
                >
                  {displayCount}
                </span>
              )}

              {/* Screen reader feedback */}
              {isActive && <span className="sr-only">Selecionado</span>}
            </button>
          );
        })}
      </div>

      {/* Success Message */}
      {selectedReaction && isAuthenticated && (
        <div
          role="status"
          aria-live="polite"
          className="text-center text-sm text-muted-foreground"
        >
          Sua opinião foi registrada. Obrigado por participar!
        </div>
      )}

      {/* Not Authenticated Message */}
      {!isAuthenticated && !loading && (
        <div
          role="alert"
          className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-center text-sm text-amber-800 dark:border-amber-800/50 dark:bg-amber-950/30 dark:text-amber-400"
        >
          <p>
            Você precisa{" "}
            <Link
              href={`/login?redirectTo=${encodeURIComponent(pathname)}`}
              className="font-semibold underline underline-offset-2 hover:text-amber-900 dark:hover:text-amber-300"
            >
              fazer login
            </Link>{" "}
            para reagir a esta lei.
          </p>
        </div>
      )}
    </section>
  );
}
