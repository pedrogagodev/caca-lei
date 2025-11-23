"use server";

import { createClient } from "@/supabase/server";
import type {
  Bill,
  BillComment,
  BillCommentReply,
  BillWithDetails,
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

    // Fetch top-level comments with author profiles
    const { data: comments, error: commentsError } = await supabase
      .from("bill_comments")
      .select(
        `
        id,
        bill_id,
        user_id,
        text,
        upvotes,
        created_at,
        author:profiles!bill_comments_user_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `,
      )
      .eq("bill_id", numericBillId)
      .order("created_at", { ascending: false });

    if (commentsError) {
      console.error("Error fetching comments:", commentsError);
      return [];
    }

    if (!comments || comments.length === 0) {
      return [];
    }

    // Fetch all replies for these comments with author profiles
    const commentIds = comments.map((c) => c.id);
    const { data: replies, error: repliesError } = await supabase
      .from("bill_comment_replies")
      .select(
        `
        id,
        comment_id,
        user_id,
        text,
        upvotes,
        created_at,
        author:profiles!bill_comment_replies_user_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `,
      )
      .in("comment_id", commentIds)
      .order("created_at", { ascending: true });

    if (repliesError) {
      console.error("Error fetching replies:", repliesError);
    }

    // Group replies by comment_id
    const repliesByCommentId: Record<string, BillCommentReply[]> = {};
    if (replies) {
      for (const reply of replies) {
        if (!repliesByCommentId[reply.comment_id]) {
          repliesByCommentId[reply.comment_id] = [];
        }
        const replyData: BillCommentReply = {
          ...reply,
          author: Array.isArray(reply.author)
            ? reply.author[0]
            : reply.author,
        } as BillCommentReply;
        repliesByCommentId[reply.comment_id].push(replyData);
      }
    }

    // Combine comments with their replies
    const commentsWithReplies: BillComment[] = comments.map((comment) => {
      const commentData: BillComment = {
        ...comment,
        author: Array.isArray(comment.author)
          ? comment.author[0]
          : comment.author,
        replies: repliesByCommentId[comment.id] || [],
      } as BillComment;
      return commentData;
    });

    return commentsWithReplies;
  } catch (error) {
    console.error("Error in getBillComments:", error);
    return [];
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

