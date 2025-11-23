"use client";

import { useState } from "react";
import { ThumbsUp } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface UpvoteButtonProps {
  billId: number;
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
      className="h-20 w-20 gap-2 rounded-lg border-foreground/10 p-0 text-sm font-semibold transition-all duration-200 hover:border-primary/40"
    >
      <div className="flex flex-col items-center justify-center gap-1">
        <ThumbsUp size={24} weight={isUpvoted ? "fill" : "regular"} />
        <span className="text-sm font-bold tabular-nums">{upvoteCount}%</span>
      </div>
    </Button>
  );
}
