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

    // Group replies by comment_id
    const repliesByCommentId: Record<string, BillCommentReply[]> = {};
    if (replies) {
      for (const reply of replies) {
        if (!repliesByCommentId[reply.comment_id]) {
          repliesByCommentId[reply.comment_id] = [];
        }
        repliesByCommentId[reply.comment_id].push(reply as BillCommentReply);
      }
    }

    // Combine comments with their replies
    const commentsWithReplies: BillComment[] = comments.map((comment) => ({
      ...comment,
      replies: repliesByCommentId[comment.id] || [],
    })) as BillComment[];

    return commentsWithReplies;
  } catch (error) {
    console.error("Error in getBillComments:", error);
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
      // Fallback to manual increment if RPC doesn't exist
      const { error: updateError } = await supabase
        .from("bills")
        .update({ views: supabase.raw("views + 1") })
        .eq("id", billId);

      if (updateError) {
        console.error("Error in fallback increment:", updateError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Error in incrementBillViews:", error);
    return false;
  }
}
