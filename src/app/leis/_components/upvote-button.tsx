"use client";

import { ThumbsUp } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface UpvoteButtonProps {
  count: number;
  active?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export function UpvoteButton({
  count,
  active = false,
  onClick,
}: UpvoteButtonProps) {
  return (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className="h-16 w-16 sm:w-20 flex-col gap-1 rounded-lg border-foreground/10 p-2 text-xs font-semibold transition-all duration-200 hover:scale-105 hover:border-primary/40"
    >
      <ThumbsUp size={18} weight={active ? "fill" : "regular"} className="sm:w-5 sm:h-5" />
      <span className="tabular-nums text-[10px] sm:text-xs">{count}%</span>
    </Button>
  );
}
