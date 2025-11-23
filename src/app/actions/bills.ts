"use server";

import { createClient } from "@/supabase/server";
import type {
  Bill,
  BillComment,
  BillCommentReply,
  BillWithDetails,
  ReactionCounts,
} from "@/types/database.types";

/**
 * Fetch a single bill by ID with reaction counts and related bills
 */
export async function getBillById(id: string): Promise<BillWithDetails | null> {
  const supabase = await createClient();

  try {
    // Fetch the main bill
    const { data: bill, error: billError } = await supabase
      .from("bills")
      .select("*")
      .eq("id", id)
      .single();

    if (billError || !bill) {
      console.error("Error fetching bill:", billError);
      return null;
    }

    // Fetch reaction counts grouped by type
    const { data: reactions, error: reactionsError } = await supabase
      .from("bill_reactions")
      .select("type")
      .eq("bill_id", id);

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

    // Fetch related bills (same tags or location, exclude current bill)
    const { data: relatedBills, error: relatedError } = await supabase
      .from("bills")
      .select("*")
      .neq("id", id)
      .or(`tags.cs.{${bill.tags.join(",")}},location.eq.${bill.location}`)
      .limit(3);

    if (relatedError) {
      console.error("Error fetching related bills:", relatedError);
    }

    return {
      ...bill,
      reactionCounts,
      relatedBills: (relatedBills as Bill[]) || [],
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
          name,
          avatar_url
        )
      `,
      )
      .eq("bill_id", billId)
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
          name,
          avatar_url
        )
      `,
      )
      .in("comment_id", commentIds)
      .order("created_at", { ascending: true });

    if (repliesError) {
      console.error("Error fetching replies:", repliesError);
    }

    // Group replies by comment_id and normalize author field
    const repliesByCommentId: Record<string, BillCommentReply[]> = {};
    if (replies) {
      for (const reply of replies) {
        if (!repliesByCommentId[reply.comment_id]) {
          repliesByCommentId[reply.comment_id] = [];
        }
        // Extract author from array (Supabase returns foreign keys as arrays)
        const normalizedReply: BillCommentReply = {
          ...reply,
          author: Array.isArray(reply.author) ? reply.author[0] : reply.author,
        } as BillCommentReply;
        repliesByCommentId[reply.comment_id].push(normalizedReply);
      }
    }

    // Combine comments with their replies and normalize author field
    const commentsWithReplies: BillComment[] = comments.map((comment) => ({
      ...comment,
      // Extract author from array (Supabase returns foreign keys as arrays)
      author: Array.isArray(comment.author) ? comment.author[0] : comment.author,
      replies: repliesByCommentId[comment.id] || [],
    })) as BillComment[];

    return commentsWithReplies;
  } catch (error) {
    console.error("Error in getBillComments:", error);
    return [];
  }
}

/**
 * Fetch all bills with optional filtering and sorting
 */
export async function getAllBills(options?: {
  limit?: number;
  offset?: number;
  status?: string;
  location?: string;
  tags?: string[];
}): Promise<Bill[]> {
  const supabase = await createClient();

  try {
    let query = supabase
      .from("bills")
      .select("*")
      .order("created_at", { ascending: false });

    // Apply filters if provided
    if (options?.status) {
      query = query.eq("status", options.status);
    }

    if (options?.location) {
      query = query.eq("location", options.location);
    }

    if (options?.tags && options.tags.length > 0) {
      query = query.contains("tags", options.tags);
    }

    // Apply pagination
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1,
      );
    }

    const { data: bills, error } = await query;

    if (error) {
      console.error("Error fetching bills:", error);
      return [];
    }

    return (bills as Bill[]) || [];
  } catch (error) {
    console.error("Error in getAllBills:", error);
    return [];
  }
}

/**
 * Increment the view count for a bill
 */
export async function incrementBillViews(billId: string): Promise<boolean> {
  const supabase = await createClient();

  try {
    const { error } = await supabase.rpc("increment_bill_views", {
      bill_id: billId,
    });

    if (error) {
      console.error("Error incrementing bill views:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in incrementBillViews:", error);
    return false;
  }
}

// Normalize text so searches ignore accents/diacritics
function normalizeText(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function billMatchesTerm(bill: Bill, normalizedTerm: string) {
  const searchableFields = [
    bill.title,
    bill.code,
    bill.summary || "",
    bill.location,
    bill.author,
    ...(bill.tags || []),
  ];

  return searchableFields
    .filter(Boolean)
    .map((field) => normalizeText(String(field)))
    .some((field) => field.includes(normalizedTerm));
}

/**
 * Search bills by term (searches in title, code, tags, summary)
 */
export async function searchBills(searchTerm: string): Promise<Bill[]> {
  const supabase = await createClient();

  // Return empty if search term is empty or too short
  if (!searchTerm || searchTerm.trim().length < 2) {
    return [];
  }

  try {
    const term = searchTerm.trim();
    const normalizedTerm = normalizeText(term);

    // Primary search with raw term (accent-sensitive)
    const { data: primaryData, error: primaryError } = await supabase
      .from("bills")
      .select("*")
      .or(
        `title.ilike.%${term}%,code.ilike.%${term}%,summary.ilike.%${term}%`,
      )
      .order("views", { ascending: false })
      .limit(50);

    if (primaryError) {
      console.error("Error searching bills:", primaryError);
      return [];
    }

    // Accent-insensitive filtering across title/code/summary/tags/location/author
    let results = ((primaryData as Bill[]) || []).filter((bill) =>
      billMatchesTerm(bill, normalizedTerm),
    );

    // Fallback: broaden search to catch accentless/tag-only queries
    if (results.length < 10) {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("bills")
        .select("*")
        .order("views", { ascending: false })
        .limit(200);

      if (fallbackError) {
        console.error(
          "Error fetching fallback bills for search:",
          fallbackError,
        );
      } else {
        const fallbackMatches = ((fallbackData as Bill[]) || []).filter(
          (bill) => billMatchesTerm(bill, normalizedTerm),
        );

        const seenIds = new Set(results.map((bill) => bill.id));
        for (const bill of fallbackMatches) {
          if (seenIds.has(bill.id)) continue;
          results.push(bill);
          seenIds.add(bill.id);
          if (results.length >= 10) break;
        }
      }
    }

    return results.slice(0, 10);
  } catch (error) {
    console.error("Error in searchBills:", error);
    return [];
  }
}
