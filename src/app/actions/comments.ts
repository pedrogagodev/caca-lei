"use server";

import { createClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";
import type {
  BillComment,
  BillCommentReply,
  Profile,
} from "@/types/database.types";

/**
 * Fetch all comments for a bill with nested replies and author profiles
 */
export async function getBillComments(
  billId: string,
): Promise<BillComment[]> {
  const supabase = await createClient();

  try {
    const numericBillId = Number.parseInt(billId, 10);
    
    if (Number.isNaN(numericBillId)) {
      console.error("Invalid bill ID for comments:", billId);
      return [];
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: comments, error: commentsError } = await supabase
      .from("bill_comments")
      .select("id, bill_id, user_id, text, upvotes, created_at")
      .eq("bill_id", numericBillId)
      .order("created_at", { ascending: false });

    if (commentsError) {
      console.error("Error fetching comments:", commentsError);
      return [];
    }

    if (!comments || comments.length === 0) {
      return [];
    }

    // Fetch user's upvotes for comments if authenticated
    const userUpvotedComments = new Set<string>();
    if (user) {
      const commentIds = comments.map((c) => c.id);
      const { data: upvotes } = await supabase
        .from("comment_upvotes")
        .select("comment_id")
        .eq("user_id", user.id)
        .in("comment_id", commentIds);

      if (upvotes) {
        for (const upvote of upvotes) {
          userUpvotedComments.add(upvote.comment_id);
        }
      }
    }

    // Fetch profiles for comment authors
    const commentUserIds = [...new Set(comments.map((c) => c.user_id))];
    const commentProfilesMap: Record<string, Profile> = {};

    if (commentUserIds.length > 0) {
      const { data: commentProfiles, error: commentProfilesError } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", commentUserIds);

      if (!commentProfilesError && commentProfiles) {
        for (const profile of commentProfiles) {
          commentProfilesMap[profile.id] = profile as Profile;
        }
      }
    }

    // Fetch all replies for these comments
    const commentIds = comments.map((c) => c.id);
    const { data: replies, error: repliesError } = await supabase
      .from("bill_comment_replies")
      .select("id, comment_id, user_id, text, upvotes, created_at")
      .in("comment_id", commentIds)
      .order("created_at", { ascending: true });

    if (repliesError) {
      console.error("Error fetching replies:", repliesError);
    }

    // Fetch user's upvotes for replies if authenticated
    const userUpvotedReplies = new Set<string>();
    if (user && replies && replies.length > 0) {
      const replyIds = replies.map((r) => r.id);
      const { data: replyUpvotes } = await supabase
        .from("comment_reply_upvotes")
        .select("reply_id")
        .eq("user_id", user.id)
        .in("reply_id", replyIds);

      if (replyUpvotes) {
        for (const upvote of replyUpvotes) {
          userUpvotedReplies.add(upvote.reply_id);
        }
      }
    }

    // Fetch profiles for reply authors
    const replyUserIds = replies
      ? [...new Set(replies.map((r) => r.user_id))]
      : [];
    const replyProfilesMap: Record<string, Profile> = {};

    if (replyUserIds.length > 0) {
      const { data: replyProfiles, error: replyProfilesError } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", replyUserIds);

      if (!replyProfilesError && replyProfiles) {
        for (const profile of replyProfiles) {
          replyProfilesMap[profile.id] = profile as Profile;
        }
      }
    }

    // Group replies by comment_id and attach profiles and upvote status
    const repliesByCommentId: Record<string, BillCommentReply[]> = {};
    if (replies) {
      for (const reply of replies) {
        if (!repliesByCommentId[reply.comment_id]) {
          repliesByCommentId[reply.comment_id] = [];
        }
        const replyData: BillCommentReply = {
          ...reply,
          author: replyProfilesMap[reply.user_id] || {
            id: reply.user_id,
            full_name: null,
            avatar_url: null,
          },
          isUpvoted: user ? userUpvotedReplies.has(reply.id) : false,
        } as BillCommentReply;
        repliesByCommentId[reply.comment_id].push(replyData);
      }
    }

    // Combine comments with their replies and attach profiles and upvote status
    const commentsWithReplies: BillComment[] = comments.map((comment) => {
      const commentData: BillComment = {
        ...comment,
        author: commentProfilesMap[comment.user_id] || {
          id: comment.user_id,
          full_name: null,
          avatar_url: null,
        },
        replies: repliesByCommentId[comment.id] || [],
        isUpvoted: user ? userUpvotedComments.has(comment.id) : false,
      } as BillComment;
      return commentData;
    });

    return commentsWithReplies;
  } catch (error) {
    console.error("Error in getBillComments:", error);
    return [];
  }
}

export async function createComment(
  billId: string,
  content: string,
): Promise<{ success: boolean; comment?: BillComment; error?: string }> {
  const supabase = await createClient();

  try {
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      return { success: false, error: "O comentário não pode estar vazio" };
    }

    if (trimmedContent.length > 5000) {
      return {
        success: false,
        error: "O comentário não pode ter mais de 5000 caracteres",
      };
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Você precisa estar autenticado para comentar" };
    }

    const numericBillId = Number.parseInt(billId, 10);
    if (Number.isNaN(numericBillId)) {
      return { success: false, error: "ID da lei inválido" };
    }

    const { data: comment, error: insertError } = await supabase
      .from("bill_comments")
      .insert({
        bill_id: numericBillId,
        user_id: user.id,
        text: trimmedContent,
        upvotes: 0,
      })
      .select("id, bill_id, user_id, text, upvotes, created_at")
      .single();

    if (insertError || !comment) {
      console.error("Error creating comment:", insertError);
      return {
        success: false,
        error: "Erro ao criar comentário. Tente novamente.",
      };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .eq("id", user.id)
      .single();

    const authorProfile: Profile = profile
      ? (profile as Profile)
      : {
          id: user.id,
          full_name: null,
          avatar_url: null,
        };

    const commentData: BillComment = {
      ...comment,
      author: authorProfile,
      replies: [],
    } as BillComment;

    revalidatePath(`/leis/${billId}`);

    return { success: true, comment: commentData };
  } catch (error) {
    console.error("Error in createComment:", error);
    return {
      success: false,
      error: "Erro inesperado ao criar comentário",
    };
  }
}

export async function createCommentReply(
  commentId: string,
  content: string,
): Promise<{ success: boolean; reply?: BillCommentReply; error?: string }> {
  const supabase = await createClient();

  try {
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      return { success: false, error: "A resposta não pode estar vazia" };
    }

    if (trimmedContent.length > 5000) {
      return {
        success: false,
        error: "A resposta não pode ter mais de 5000 caracteres",
      };
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Você precisa estar autenticado para responder" };
    }

    const { data: parentComment, error: commentError } = await supabase
      .from("bill_comments")
      .select("bill_id")
      .eq("id", commentId)
      .single();

    if (commentError || !parentComment) {
      return { success: false, error: "Comentário não encontrado" };
    }

    const { data: reply, error: insertError } = await supabase
      .from("bill_comment_replies")
      .insert({
        comment_id: commentId,
        user_id: user.id,
        text: trimmedContent,
        upvotes: 0,
      })
      .select("id, comment_id, user_id, text, upvotes, created_at")
      .single();

    if (insertError || !reply) {
      console.error("Error creating reply:", insertError);
      return {
        success: false,
        error: "Erro ao criar resposta. Tente novamente.",
      };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .eq("id", user.id)
      .single();

    const authorProfile: Profile = profile
      ? (profile as Profile)
      : {
          id: user.id,
          full_name: null,
          avatar_url: null,
        };

    const replyData: BillCommentReply = {
      ...reply,
      author: authorProfile,
    } as BillCommentReply;

    revalidatePath(`/leis/${parentComment.bill_id}`);

    return { success: true, reply: replyData };
  } catch (error) {
    console.error("Error in createCommentReply:", error);
    return {
      success: false,
      error: "Erro inesperado ao criar resposta",
    };
  }
}

