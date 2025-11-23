"use server";

import { createClient } from "@/supabase/server";
import type {
  Bill,
  BillWithDetails,
  ReactionCounts,
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
          didactic_summary: bill.didactic_summary,
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

export async function updateBillSummaries(
  billId: number,
  summary: string | null,
  didacticSummary: string | null,
): Promise<boolean> {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("bills")
      .update({
        summary,
        didactic_summary: didacticSummary,
        updated_at: new Date().toISOString(),
      })
      .eq("id", billId);

    if (error) {
      console.error("Error updating bill summaries:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in updateBillSummaries:", error);
    return false;
  }
}
