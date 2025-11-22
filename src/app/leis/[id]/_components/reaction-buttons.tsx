"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ReactionType = "apoio" | "nao-apoio" | "nao-entendi" | "impacta" | null;

const reactions = [
  { id: "apoio" as const, label: "❤️ Apoio", activeClass: "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-300" },
  { id: "nao-apoio" as const, label: "💢 Não apoio", activeClass: "border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-300" },
  { id: "nao-entendi" as const, label: "🤔 Não entendi", activeClass: "border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300" },
  { id: "impacta" as const, label: "⚠️ Impacta minha vida", activeClass: "border-orange-500/50 bg-orange-500/10 text-orange-700 dark:text-orange-300" },
];

export function ReactionButtons() {
  const [selectedReaction, setSelectedReaction] = useState<ReactionType>(null);

  const handleReactionClick = (reactionId: ReactionType) => {
    setSelectedReaction(selectedReaction === reactionId ? null : reactionId);
  };

  return (
    <Card className="px-4 py-4 md:px-5 md:py-5">
      <div className="mb-4">
        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
          Sua opinião
        </p>
        <h2 className="text-xl font-semibold">Como isso te afeta?</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {reactions.map((reaction) => {
          const isActive = selectedReaction === reaction.id;
          return (
            <Button
              key={reaction.id}
              variant="outline"
              size="lg"
              onClick={() => handleReactionClick(reaction.id)}
              className={cn(
                "h-auto min-h-[44px] flex-col gap-1 px-3 py-3 text-sm font-medium transition-all duration-200",
                "hover:scale-[1.02] active:scale-[0.98]",
                isActive && reaction.activeClass
              )}
            >
              <span className="text-base md:text-lg">{reaction.label.split(" ")[0]}</span>
              <span className="text-xs md:text-sm">{reaction.label.split(" ").slice(1).join(" ")}</span>
            </Button>
          );
        })}
      </div>

      {selectedReaction && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Sua reação foi registrada! Obrigado por participar.
        </p>
      )}
    </Card>
  );
}
