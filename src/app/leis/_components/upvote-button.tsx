"use client";

import { ThumbsUp } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface UpvoteButtonProps {
  count: number;
  active?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export function UpvoteButton({ count, active = false, onClick }: UpvoteButtonProps) {
  return (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className="h-10 gap-2 rounded-full border-foreground/10 px-4 text-sm font-semibold transition-all duration-200 hover:scale-105 hover:border-primary/40"
    >
      <ThumbsUp size={18} weight={active ? "fill" : "regular"} />
      <span className="tabular-nums">{count}%</span>
    </Button>
  );
}
