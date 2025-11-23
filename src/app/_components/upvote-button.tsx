"use client";

import { useState } from "react";
import { ThumbsUp } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface UpvoteButtonProps {
  billId: string;
  initialCount: number;
}

export function UpvoteButton({ billId, initialCount }: UpvoteButtonProps) {
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(initialCount);

  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isUpvoted) {
      setIsUpvoted(true);
      setUpvoteCount((prev) => prev + 1);
      // TODO: Add server action to save upvote to database
    } else {
      setIsUpvoted(false);
      setUpvoteCount((prev) => prev - 1);
      // TODO: Add server action to remove upvote from database
    }
  };

  return (
    <Button
      variant={isUpvoted ? "default" : "outline"}
      size="sm"
      onClick={handleUpvote}
      className="h-10 gap-2 rounded-full border-foreground/10 px-4 text-sm font-semibold transition-all duration-200 hover:scale-105 hover:border-primary/40"
    >
      <ThumbsUp size={18} weight={isUpvoted ? "fill" : "regular"} />
      <span className="tabular-nums">{upvoteCount}%</span>
    </Button>
  );
}
