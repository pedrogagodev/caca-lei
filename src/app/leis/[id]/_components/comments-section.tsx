"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ChatCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface CommentReply {
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

interface Comment {
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

interface CommentsSectionProps {
  comments: Comment[];
  totalComments: number;
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

function CommentItem({ comment, isReply = false }: { comment: Comment | CommentReply; isReply?: boolean }) {
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const initials = comment.author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const hasReplies = "replies" in comment && comment.replies && comment.replies.length > 0;

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
              isUpvoted && "text-primary"
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

          {hasReplies && !isReply && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplies(!showReplies)}
              className="h-auto px-2 py-1 text-xs text-muted-foreground transition-all duration-200 hover:text-foreground"
            >
              {showReplies ? "Ocultar" : "Ver"} {comment.replies.length}{" "}
              {comment.replies.length === 1 ? "resposta" : "respostas"}
            </Button>
          )}
        </div>

        {/* Replies */}
        {hasReplies && showReplies && (
          <div className="mt-4 space-y-4 border-l-2 border-border pl-4">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function CommentsSection({ comments, totalComments }: CommentsSectionProps) {
  const [sortBy, setSortBy] = useState<"relevant" | "recent">("relevant");

  return (
    <Card className="px-4 py-4 md:px-6 md:py-5">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
            Discussão
          </p>
          <h2 className="text-xl font-semibold">
            Comentários ({totalComments})
          </h2>
        </div>

        {/* Sort Buttons */}
        <div className="flex gap-2">
          <Button
            variant={sortBy === "relevant" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("relevant")}
            className="text-xs transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Mais relevantes
          </Button>
          <Button
            variant={sortBy === "recent" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("recent")}
            className="text-xs transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Mais recentes
          </Button>
        </div>
      </div>

      {/* Comment Input Placeholder */}
      <div className="mb-6 flex gap-3">
        <Avatar className="h-10 w-10 flex-shrink-0 border border-border">
          <AvatarFallback className="bg-muted text-xs font-semibold">
            VC
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground transition-all duration-200 hover:border-primary/50 hover:bg-muted/50">
            Adicione um comentário...
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>

      {/* Load More */}
      {totalComments > comments.length && (
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            className="transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Ver mais comentários
          </Button>
        </div>
      )}
    </Card>
  );
}
