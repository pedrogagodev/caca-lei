"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CommentItem, type Comment } from "./comment-item";

interface CommentsSectionProps {
  comments: Comment[];
  totalComments: number;
}

export function CommentsSection({
  comments,
  totalComments,
}: CommentsSectionProps) {
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
