"use server";

import { getCamaraEnv } from "@/env";
import type {
  ProposicaoListItem,
  ProposicaoDetalhada,
  CamaraApiListResponse,
  CamaraApiItemResponse,
} from "@/types/camara.types";

/**
 * Fetch propositions from Câmara API with pagination
 * @param page - Page number (1-indexed)
 * @param limit - Number of items per page (default: 5)
 * @returns Array of propositions and total count
 */
export async function getProposicoes(
  page = 1,
  limit = 5,
): Promise<{ data: ProposicaoListItem[]; total: number }> {
  const { url: baseUrl } = getCamaraEnv();

  try {
    // Calculate pagination parameters
    const offset = (page - 1) * limit;

    // Build query parameters
    const params = new URLSearchParams({
      itens: limit.toString(),
      pagina: page.toString(),
      ordenarPor: "id",
      ordem: "DESC",
    });

    const url = `${baseUrl}/proposicoes?${params.toString()}`;

    const response = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      console.error("Error fetching proposições:", response.statusText);
      return { data: [], total: 0 };
    }

    const result: CamaraApiListResponse<ProposicaoListItem> =
      await response.json();

    // The API doesn't return total count directly, so we estimate it
    // based on whether we got a full page of results
    const hasMore = result.dados.length === limit;
    const estimatedTotal = hasMore ? (page + 1) * limit : offset + result.dados.length;

    return {
      data: result.dados || [],
      total: estimatedTotal,
    };
  } catch (error) {
    console.error("Error in getProposicoes:", error);
    return { data: [], total: 0 };
  }
}

/**
 * Fetch a single proposition by ID with full details
 * @param id - Proposition ID
 * @returns Detailed proposition data or null if not found
 */
export async function getProposicaoById(
  id: number,
): Promise<ProposicaoDetalhada | null> {
  const { url: baseUrl } = getCamaraEnv();

  try {
    const url = `${baseUrl}/proposicoes/${id}`;

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour (propositions don't change often)
    });

    if (!response.ok) {
      console.error(
        `Error fetching proposição ${id}:`,
        response.statusText,
      );
      return null;
    }

    const result: CamaraApiItemResponse<ProposicaoDetalhada> =
      await response.json();

    return result.dados || null;
  } catch (error) {
    console.error(`Error in getProposicaoById(${id}):`, error);
    return null;
  }
}

/**
 * Search propositions by keyword
 * @param keywords - Search terms
 * @param limit - Number of results (default: 5)
 * @returns Array of matching propositions
 */
export async function searchProposicoes(
  keywords: string,
  limit = 5,
): Promise<ProposicaoListItem[]> {
  const { url: baseUrl } = getCamaraEnv();

  try {
    const params = new URLSearchParams({
      keywords,
      itens: limit.toString(),
      ordenarPor: "id",
      ordem: "DESC",
    });

    const url = `${baseUrl}/proposicoes?${params.toString()}`;

    const response = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      console.error("Error searching proposições:", response.statusText);
      return [];
    }

    const result: CamaraApiListResponse<ProposicaoListItem> =
      await response.json();

    return result.dados || [];
  } catch (error) {
    console.error("Error in searchProposicoes:", error);
    return [];
  }
}
