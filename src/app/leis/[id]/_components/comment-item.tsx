"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ChatCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export interface CommentReply {
  id: string;
  author: {
    name: string;
    avatar?: string;
    isAuthor?: boolean;
  };
  text: string;
  timestamp: string;
  upvotes: number;
}

export interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
    isAuthor?: boolean;
  };
  text: string;
  timestamp: string;
  upvotes: number;
  replies?: CommentReply[];
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `há ${diffMins} min`;
  }
  if (diffHours < 24) {
    return `há ${diffHours}h`;
  }
  if (diffDays < 7) {
    return `há ${diffDays}d`;
  }
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

interface CommentItemProps {
  comment: Comment | CommentReply;
  isReply?: boolean;
}

export function CommentItem({ comment, isReply = false }: CommentItemProps) {
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const initials = comment.author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const hasReplies =
    "replies" in comment && comment.replies && comment.replies.length > 0;

  return (
    <div className={cn("flex gap-3", isReply && "ml-8 md:ml-12")}>
      {/* Avatar */}
      <Avatar className="h-8 w-8 flex-shrink-0 border border-border md:h-10 md:w-10">
        <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
        <AvatarFallback className="bg-muted text-xs font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="flex-1 space-y-2">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-sm">{comment.author.name}</span>
          {comment.author.isAuthor && (
            <Badge variant="secondary" className="text-xs">
              Autor
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            {formatTimestamp(comment.timestamp)}
          </span>
        </div>

        {/* Text */}
        <p className="text-sm leading-relaxed text-foreground">
          {comment.text}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsUpvoted(!isUpvoted)}
            className={cn(
              "h-auto gap-1.5 px-2 py-1 text-xs transition-all duration-200 hover:scale-105 active:scale-95",
              isUpvoted && "text-primary",
            )}
          >
            <ThumbsUp
              className="h-3.5 w-3.5"
              weight={isUpvoted ? "fill" : "regular"}
            />
            <span className="tabular-nums">
              {comment.upvotes + (isUpvoted ? 1 : 0)}
            </span>
          </Button>

          {!isReply && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto gap-1.5 px-2 py-1 text-xs transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <ChatCircle className="h-3.5 w-3.5" weight="regular" />
              Responder
            </Button>
          )}

          {hasReplies && !isReply && "replies" in comment && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplies(!showReplies)}
              className="h-auto px-2 py-1 text-xs text-muted-foreground transition-all duration-200 hover:text-foreground"
            >
              {showReplies ? "Ocultar" : "Ver"} {comment.replies?.length}{" "}
              {comment.replies?.length === 1 ? "resposta" : "respostas"}
            </Button>
          )}
        </div>

        {/* Replies */}
        {hasReplies && showReplies && "replies" in comment && (
          <div className="mt-4 space-y-4 border-l-2 border-border pl-4">
            {comment.replies?.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
