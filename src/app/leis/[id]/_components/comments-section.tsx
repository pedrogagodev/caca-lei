"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ChatCircle, CircleNotch } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import {
  createComment,
  createCommentReply,
  upvoteComment,
  removeCommentUpvote,
  upvoteCommentReply,
  removeCommentReplyUpvote,
} from "@/app/actions/bills";
import { toast } from "sonner";

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
  isUpvoted?: boolean;
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
  isUpvoted?: boolean;
  replies?: CommentReply[];
}

interface CommentsSectionProps {
  billId: string;
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

function CommentItem({
  comment,
  isReply = false,
  billId,
  onReplyAdded,
}: {
  comment: Comment | CommentReply;
  isReply?: boolean;
  billId: string;
  onReplyAdded?: () => void;
}) {
  const [isUpvoted, setIsUpvoted] = useState(comment.isUpvoted || false);
  const [upvoteCount, setUpvoteCount] = useState(comment.upvotes);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const initials = comment.author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const hasReplies = "replies" in comment && comment.replies && comment.replies.length > 0;

  useEffect(() => {
    setUpvoteCount(comment.upvotes);
    if (comment.isUpvoted !== undefined) {
      setIsUpvoted(comment.isUpvoted);
    }
  }, [comment.upvotes, comment.isUpvoted]);

  const handleUpvote = async () => {
    if (!user) {
      toast.error("Você precisa estar autenticado para dar upvote");
      router.push("/login");
      return;
    }

    if (isUpvoting) return;

    setIsUpvoting(true);
    const wasUpvoted = isUpvoted;

    setIsUpvoted(!wasUpvoted);
    setUpvoteCount((prev) => (wasUpvoted ? prev - 1 : prev + 1));

    try {
      let result: { success: boolean; newCount?: number; error?: string };
      if (isReply) {
        result = wasUpvoted
          ? await removeCommentReplyUpvote(comment.id)
          : await upvoteCommentReply(comment.id);
      } else {
        result = wasUpvoted
          ? await removeCommentUpvote(comment.id)
          : await upvoteComment(comment.id);
      }

      if (result.success && result.newCount !== undefined) {
        setUpvoteCount(result.newCount);
        setIsUpvoted(!wasUpvoted);
      } else {
        setIsUpvoted(wasUpvoted);
        setUpvoteCount(comment.upvotes);
        toast.error(result.error || "Erro ao atualizar upvote");
      }
    } catch (error) {
      console.error("Error upvoting:", error);
      setIsUpvoted(wasUpvoted);
      setUpvoteCount(comment.upvotes);
      toast.error("Erro inesperado ao dar upvote");
    } finally {
      setIsUpvoting(false);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedContent = replyContent.trim();

    if (!trimmedContent) {
      toast.error("A resposta não pode estar vazia");
      return;
    }

    if (!user) {
      toast.error("Você precisa estar autenticado para responder");
      router.push("/login");
      return;
    }

    setIsSubmittingReply(true);

    try {
      const result = await createCommentReply(comment.id, trimmedContent);

      if (result.success) {
        setReplyContent("");
        setShowReplyForm(false);
        toast.success("Resposta adicionada com sucesso!");
        if (onReplyAdded) {
          onReplyAdded();
        } else {
          router.refresh();
        }
      } else {
        toast.error(result.error || "Erro ao adicionar resposta");
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
      toast.error("Erro inesperado ao adicionar resposta");
    } finally {
      setIsSubmittingReply(false);
    }
  };

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
            onClick={handleUpvote}
            disabled={isUpvoting}
            className={cn(
              "h-auto gap-1.5 px-2 py-1 text-xs transition-all duration-200 hover:scale-105 active:scale-95",
              isUpvoted && "text-primary"
            )}
          >
            <ThumbsUp
              className={cn(
                "h-3.5 w-3.5",
                isUpvoting && "animate-pulse"
              )}
              weight={isUpvoted ? "fill" : "regular"}
            />
            <span className="tabular-nums">{upvoteCount}</span>
          </Button>

          {!isReply && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (!user) {
                  toast.error("Você precisa estar autenticado para responder");
                  router.push("/login");
                  return;
                }
                setShowReplyForm(!showReplyForm);
              }}
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
              {showReplies ? "Ocultar" : "Ver"} {comment.replies?.length || 0}{" "}
              {(comment.replies?.length || 0) === 1 ? "resposta" : "respostas"}
            </Button>
          )}
        </div>

        {/* Reply Form */}
        {!isReply && showReplyForm && (
          <form onSubmit={handleReplySubmit} className="mt-3 space-y-2">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Escreva sua resposta..."
              className="min-h-20 resize-none"
              maxLength={5000}
              disabled={isSubmittingReply}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {replyContent.length}/5000
              </span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyContent("");
                  }}
                  disabled={isSubmittingReply}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!replyContent.trim() || isSubmittingReply}
                >
                  {isSubmittingReply ? (
                    <>
                      <CircleNotch className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar"
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* Replies */}
        {hasReplies && showReplies && (
          <div className="mt-4 space-y-4 border-l-2 border-border pl-4">
            {(comment.replies || []).map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                isReply
                billId={billId}
                onReplyAdded={onReplyAdded}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function CommentsSection({
  billId,
  comments,
  totalComments,
}: CommentsSectionProps) {
  const [sortBy, setSortBy] = useState<"relevant" | "recent">("recent");
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const userInitials = user
    ? (user.user_metadata?.full_name || user.email || "U")
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "VC";

  const userAvatar = user?.user_metadata?.avatar_url;

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedContent = commentContent.trim();

    if (!trimmedContent) {
      toast.error("O comentário não pode estar vazio");
      return;
    }

    if (!user) {
      toast.error("Você precisa estar autenticado para comentar");
      router.push("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createComment(billId, trimmedContent);

      if (result.success) {
        setCommentContent("");
        toast.success("Comentário adicionado com sucesso!");
        startTransition(() => {
          router.refresh();
        });
      } else {
        toast.error(result.error || "Erro ao adicionar comentário");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Erro inesperado ao adicionar comentário");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    if (b.upvotes !== a.upvotes) {
      return b.upvotes - a.upvotes;
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const handleReplyAdded = () => {
    startTransition(() => {
      router.refresh();
    });
  };

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

      {/* Comment Input */}
      {authLoading ? (
        <div className="mb-6 flex items-center justify-center py-4">
          <CircleNotch className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : user ? (
        <form onSubmit={handleCommentSubmit} className="mb-6 space-y-3">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 flex-shrink-0 border border-border">
              <AvatarImage src={userAvatar} alt={user.email || "User"} />
              <AvatarFallback className="bg-muted text-xs font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Adicione um comentário..."
                className="min-h-24 resize-none"
                maxLength={5000}
                disabled={isSubmitting || isPending}
              />
              <div className="flex items-center justify-end gap-2">
                <span className="text-xs text-muted-foreground">
                  {commentContent.length}/5000
                </span>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!commentContent.trim() || isSubmitting || isPending}
                >
                  {isSubmitting || isPending ? (
                    <>
                      <CircleNotch className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Comentar"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-6 flex items-center justify-center rounded-lg border border-border bg-muted/30 px-4 py-6">
          <p className="text-sm text-muted-foreground">
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              Faça login
            </Link>{" "}
            para adicionar um comentário
          </p>
        </div>
      )}

      {/* Comments List */}
      {isPending ? (
        <div className="flex items-center justify-center py-8">
          <CircleNotch className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : sortedComments.length > 0 ? (
        <div className="space-y-6">
          {sortedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              billId={billId}
              onReplyAdded={handleReplyAdded}
            />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </p>
        </div>
      )}

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
