"use server";

import { createClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";
import type {
  Bill,
  BillComment,
  BillCommentReply,
  BillWithDetails,
  Profile,
  ReactionCounts,
  ReactionType,
} from "@/types/database.types";
import {
  fetchProposicoes,
  fetchProposicaoById,
  transformProposicaoToBill,
} from "@/lib/camara-api";


async function upsertBill(
  bill: Omit<Bill, "comments_count" | "supports_count">,
): Promise<boolean> {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("bills")
      .upsert(
        {
          id: bill.id,
          title: bill.title,
          code: bill.code,
          status: bill.status,
          location: bill.location,
          author: bill.author,
          summary: bill.summary,
          tags: bill.tags,
          created_at: bill.created_at,
          updated_at: bill.updated_at || new Date().toISOString(),
          pdf_url: bill.pdf_url,
        },
        {
          onConflict: "id",
        },
      );

    if (error) {
      console.error("Error upserting bill:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in upsertBill:", error);
    return false;
  }
}

/**
 * Fetch a single bill by ID with reaction counts and related bills
 */
export async function getBillById(id: string): Promise<BillWithDetails | null> {
  const supabase = await createClient();

  try {
    const billId = Number.parseInt(id, 10);
    
    if (Number.isNaN(billId)) {
      console.error("Invalid bill ID:", id);
      return null;
    }

    let bill: Omit<Bill, "comments_count" | "supports_count"> | null = null;

    const proposicao = await fetchProposicaoById(billId);
    if (proposicao) {
      bill = transformProposicaoToBill(proposicao);
      upsertBill(bill).catch((error: unknown) => {
        console.error("Failed to save bill to database:", error);
      });
    }

    if (!bill) {
      const { data: dbBill, error: billError } = await supabase
        .from("bills")
        .select("*")
        .eq("id", billId)
        .single();

      if (billError || !dbBill) {
        console.error("Error fetching bill:", billError);
        return null;
      }

      bill = dbBill as Omit<Bill, "comments_count" | "supports_count">;
    }

    if (!bill) {
      return null;
    }

    const { data: reactions, error: reactionsError } = await supabase
      .from("bill_reactions")
      .select("type")
      .eq("bill_id", billId);

    if (reactionsError) {
      console.error("Error fetching reactions:", reactionsError);
    }

    // Aggregate reaction counts
    const reactionCounts: ReactionCounts = {
      apoio: 0,
      "nao-apoio": 0,
      "nao-entendi": 0,
      impacta: 0,
    };

    if (reactions) {
      for (const reaction of reactions) {
        if (reaction.type in reactionCounts) {
          reactionCounts[reaction.type as keyof ReactionCounts]++;
        }
      }
    }

    const { data: comments, error: commentsError } = await supabase
      .from("bill_comments")
      .select("id")
      .eq("bill_id", billId);

    if (commentsError) {
      console.error("Error fetching comments count:", commentsError);
    }

    const commentsCount = comments?.length || 0;

    const supportsCount = reactionCounts.apoio;

    // Fetch related bills (same tags or location, exclude current bill)
    let relatedBills: Bill[] = [];

    const relatedApiResponse = await fetchProposicoes(1, 3);
    if (relatedApiResponse?.dados) {
      const relatedProposicoes = relatedApiResponse.dados
        .filter((p) => p.id !== billId)
        .slice(0, 3);

      const relatedBillsData = await Promise.all(
        relatedProposicoes.map(async (p) => {
          const relatedBill = transformProposicaoToBill(p);
          const relatedEngagement = await fetchBillsEngagementData([
            relatedBill.id,
          ]);
          return {
            ...relatedBill,
            comments_count:
              relatedEngagement.commentsCount[relatedBill.id] || 0,
            supports_count:
              relatedEngagement.supportsCount[relatedBill.id] || 0,
          };
        }),
      );

      relatedBills = relatedBillsData;
    }

    return {
      ...bill,
      comments_count: commentsCount,
      supports_count: supportsCount,
      reactionCounts,
      relatedBills,
    };
  } catch (error) {
    console.error("Error in getBillById:", error);
    return null;
  }
}

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


export async function upvoteComment(
  commentId: string,
): Promise<{ success: boolean; newCount?: number; error?: string }> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Você precisa estar autenticado para dar upvote" };
    }

    const { data: existingUpvote } = await supabase
      .from("comment_upvotes")
      .select("id")
      .eq("comment_id", commentId)
      .eq("user_id", user.id)
      .single();

    if (existingUpvote) {
      return { success: false, error: "Você já deu upvote neste comentário" };
    }

    const { data: currentComment, error: fetchError } = await supabase
      .from("bill_comments")
      .select("upvotes")
      .eq("id", commentId)
      .single();

    if (fetchError || !currentComment) {
      console.error("Error fetching comment:", fetchError);
      return {
        success: false,
        error: "Comentário não encontrado",
      };
    }

    const { error: upvoteError } = await supabase
      .from("comment_upvotes")
      .insert({
        comment_id: commentId,
        user_id: user.id,
      });

    if (upvoteError) {
      console.error("Error creating upvote record:", upvoteError);
      return {
        success: false,
        error: "Erro ao dar upvote. Tente novamente.",
      };
    }

    const newUpvotes = (currentComment.upvotes || 0) + 1;
    const { data: comment, error: updateError } = await supabase
      .from("bill_comments")
      .update({ upvotes: newUpvotes })
      .eq("id", commentId)
      .select("upvotes")
      .single();

    if (updateError || !comment) {
      console.error("Error updating comment upvotes:", updateError);
      await supabase
        .from("comment_upvotes")
        .delete()
        .eq("comment_id", commentId)
        .eq("user_id", user.id);
      return {
        success: false,
        error: "Erro ao atualizar upvote. Tente novamente.",
      };
    }

    return { success: true, newCount: comment.upvotes };
  } catch (error) {
    console.error("Error in upvoteComment:", error);
    return {
      success: false,
      error: "Erro inesperado ao dar upvote",
    };
  }
}


export async function removeCommentUpvote(
  commentId: string,
): Promise<{ success: boolean; newCount?: number; error?: string }> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Você precisa estar autenticado" };
    }

    const { data: existingUpvote } = await supabase
      .from("comment_upvotes")
      .select("id")
      .eq("comment_id", commentId)
      .eq("user_id", user.id)
      .single();

    if (!existingUpvote) {
      return { success: false, error: "Você não deu upvote neste comentário" };
    }

    const { data: currentComment, error: fetchError } = await supabase
      .from("bill_comments")
      .select("upvotes")
      .eq("id", commentId)
      .single();

    if (fetchError || !currentComment) {
      console.error("Error fetching comment:", fetchError);
      return {
        success: false,
        error: "Comentário não encontrado",
      };
    }

    const { error: deleteError } = await supabase
      .from("comment_upvotes")
      .delete()
      .eq("comment_id", commentId)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Error deleting upvote record:", deleteError);
      return {
        success: false,
        error: "Erro ao remover upvote. Tente novamente.",
      };
    }

    const newUpvotes = Math.max((currentComment.upvotes || 0) - 1, 0);
    const { data: comment, error: updateError } = await supabase
      .from("bill_comments")
      .update({ upvotes: newUpvotes })
      .eq("id", commentId)
      .select("upvotes")
      .single();

    if (updateError || !comment) {
      console.error("Error updating comment upvotes:", updateError);
      return {
        success: false,
        error: "Erro ao atualizar contador. Tente novamente.",
      };
    }

    return { success: true, newCount: comment.upvotes };
  } catch (error) {
    console.error("Error in removeCommentUpvote:", error);
    return {
      success: false,
      error: "Erro inesperado ao remover upvote",
    };
  }
}

export async function upvoteCommentReply(
  replyId: string,
): Promise<{ success: boolean; newCount?: number; error?: string }> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Você precisa estar autenticado para dar upvote" };
    }

    const { data: existingUpvote } = await supabase
      .from("comment_reply_upvotes")
      .select("id")
      .eq("reply_id", replyId)
      .eq("user_id", user.id)
      .single();

    if (existingUpvote) {
      return { success: false, error: "Você já deu upvote nesta resposta" };
    }

    const { data: currentReply, error: fetchError } = await supabase
      .from("bill_comment_replies")
      .select("upvotes")
      .eq("id", replyId)
      .single();

    if (fetchError || !currentReply) {
      console.error("Error fetching reply:", fetchError);
      return {
        success: false,
        error: "Resposta não encontrada",
      };
    }

    const { error: upvoteError } = await supabase
      .from("comment_reply_upvotes")
      .insert({
        reply_id: replyId,
        user_id: user.id,
      });

    if (upvoteError) {
      console.error("Error creating upvote record:", upvoteError);
      return {
        success: false,
        error: "Erro ao dar upvote. Tente novamente.",
      };
    }

    const newUpvotes = (currentReply.upvotes || 0) + 1;
    const { data: reply, error: updateError } = await supabase
      .from("bill_comment_replies")
      .update({ upvotes: newUpvotes })
      .eq("id", replyId)
      .select("upvotes")
      .single();

    if (updateError || !reply) {
      console.error("Error updating reply upvotes:", updateError);
      await supabase
        .from("comment_reply_upvotes")
        .delete()
        .eq("reply_id", replyId)
        .eq("user_id", user.id);
      return {
        success: false,
        error: "Erro ao atualizar upvote. Tente novamente.",
      };
    }

    return { success: true, newCount: reply.upvotes };
  } catch (error) {
    console.error("Error in upvoteCommentReply:", error);
    return {
      success: false,
      error: "Erro inesperado ao dar upvote",
    };
  }
}

export async function removeCommentReplyUpvote(
  replyId: string,
): Promise<{ success: boolean; newCount?: number; error?: string }> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Você precisa estar autenticado" };
    }

    const { data: existingUpvote } = await supabase
      .from("comment_reply_upvotes")
      .select("id")
      .eq("reply_id", replyId)
      .eq("user_id", user.id)
      .single();

    if (!existingUpvote) {
      return { success: false, error: "Você não deu upvote nesta resposta" };
    }

    const { data: currentReply, error: fetchError } = await supabase
      .from("bill_comment_replies")
      .select("upvotes")
      .eq("id", replyId)
      .single();

    if (fetchError || !currentReply) {
      console.error("Error fetching reply:", fetchError);
      return {
        success: false,
        error: "Resposta não encontrada",
      };
    }

    const { error: deleteError } = await supabase
      .from("comment_reply_upvotes")
      .delete()
      .eq("reply_id", replyId)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Error deleting upvote record:", deleteError);
      return {
        success: false,
        error: "Erro ao remover upvote. Tente novamente.",
      };
    }

    const newUpvotes = Math.max((currentReply.upvotes || 0) - 1, 0);
    const { data: reply, error: updateError } = await supabase
      .from("bill_comment_replies")
      .update({ upvotes: newUpvotes })
      .eq("id", replyId)
      .select("upvotes")
      .single();

    if (updateError || !reply) {
      console.error("Error updating reply upvotes:", updateError);
      return {
        success: false,
        error: "Erro ao atualizar contador. Tente novamente.",
      };
    }

    return { success: true, newCount: reply.upvotes };
  } catch (error) {
    console.error("Error in removeCommentReplyUpvote:", error);
    return {
      success: false,
      error: "Erro inesperado ao remover upvote",
    };
  }
}

async function fetchBillsEngagementData(
  billIds: number[],
): Promise<{
  reactions: Record<number, ReactionCounts>;
  commentsCount: Record<number, number>;
  supportsCount: Record<number, number>;
}> {
  const supabase = await createClient();
  const result = {
    reactions: {} as Record<number, ReactionCounts>,
    commentsCount: {} as Record<number, number>,
    supportsCount: {} as Record<number, number>,
  };

  if (billIds.length === 0) {
    return result;
  }

  try {
    for (const billId of billIds) {
      result.reactions[billId] = {
        apoio: 0,
        "nao-apoio": 0,
        "nao-entendi": 0,
        impacta: 0,
      };
      result.commentsCount[billId] = 0;
      result.supportsCount[billId] = 0;
    }

    const { data: reactions, error: reactionsError } = await supabase
      .from("bill_reactions")
      .select("bill_id, type")
      .in("bill_id", billIds);

    if (!reactionsError && reactions) {
      for (const reaction of reactions) {
        const billId = reaction.bill_id;
        if (billId && result.reactions[billId]) {
          const type = reaction.type as keyof ReactionCounts;
          if (type in result.reactions[billId]) {
            result.reactions[billId][type]++;
          }
        }
      }
    }

    const { data: comments, error: commentsError } = await supabase
      .from("bill_comments")
      .select("bill_id")
      .in("bill_id", billIds);

    if (!commentsError && comments) {
      for (const comment of comments) {
        const billId = comment.bill_id;
        if (billId && result.commentsCount[billId] !== undefined) {
          result.commentsCount[billId]++;
        }
      }
    }

    for (const billId of billIds) {
      result.supportsCount[billId] = result.reactions[billId]?.apoio || 0;
    }
  } catch (error) {
    console.error("Error fetching bills engagement data:", error);
  }

  return result;
}


export async function getAllBills(options?: {
  limit?: number;
  offset?: number;
  status?: string;
  location?: string;
  tags?: string[];
}): Promise<Bill[]> {
  try {
    const itemsPerPage = 5; // Always fetch 5 at a time from API
    const offset = options?.offset || 0;
    const page = Math.floor(offset / itemsPerPage) + 1;

    const apiResponse = await fetchProposicoes(page, itemsPerPage);

    if (!apiResponse || !apiResponse.dados || apiResponse.dados.length === 0) {
      console.warn("No proposições found in API response");
      return [];
    }

    const billsFromAPI = apiResponse.dados.map(transformProposicaoToBill);

    const billIds = billsFromAPI.map((bill) => bill.id);

    const engagementData = await fetchBillsEngagementData(billIds);

    const bills: Bill[] = billsFromAPI.map((bill) => ({
      ...bill,
      comments_count: engagementData.commentsCount[bill.id] || 0,
      supports_count: engagementData.supportsCount[bill.id] || 0,
    }));

    let filteredBills = bills;

    if (options?.status) {
      filteredBills = filteredBills.filter((bill) => bill.status === options.status);
    }

    if (options?.location) {
      filteredBills = filteredBills.filter(
        (bill) => bill.location === options.location,
      );
    }

    if (options?.tags && options.tags.length > 0) {
      const filterTags = options.tags;
      filteredBills = filteredBills.filter((bill) =>
        filterTags.some((tag) => bill.tags.includes(tag)),
      );
    }

    if (options?.limit) {
      filteredBills = filteredBills.slice(0, options.limit);
    }

    return filteredBills;
  } catch (error) {
    console.error("Error in getAllBills:", error);
    return [];
  }
}

export async function loadMoreBills(offset: number): Promise<Bill[]> {
  return getAllBills({ offset, limit: 5 });
}

export async function saveBillReaction(
  billId: number,
  reactionType: ReactionType,
): Promise<boolean> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("User not authenticated:", userError);
      return false;
    }

    const { error } = await supabase
      .from("bill_reactions")
      .upsert(
        {
          bill_id: billId,
          user_id: user.id,
          type: reactionType,
        },
        {
          onConflict: "bill_id,user_id",
        },
      );

    if (error) {
      console.error("Error saving reaction:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in saveBillReaction:", error);
    return false;
  }
}


export async function removeBillReaction(billId: number): Promise<boolean> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("User not authenticated:", userError);
      return false;
    }

    const { error } = await supabase
      .from("bill_reactions")
      .delete()
      .eq("bill_id", billId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error removing reaction:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in removeBillReaction:", error);
    return false;
  }
}

