import type { ProposicaoAPI, ProposicoesResponse } from "@/types/camara-api.types";
import type { Bill } from "@/types/database.types";

const CAMARA_API_BASE_URL = "https://dadosabertos.camara.leg.br/api/v2";

export async function fetchProposicoes(
  page: number = 1,
  itemsPerPage: number = 5,
): Promise<ProposicoesResponse | null> {
  try {
    const url = new URL(`${CAMARA_API_BASE_URL}/proposicoes`);
    url.searchParams.set("pagina", page.toString());
    url.searchParams.set("itens", itemsPerPage.toString());
    url.searchParams.set("ordem", "desc");
    url.searchParams.set("ordenarPor", "id");
    url.searchParams.set("siglaTipo", "PL");

    const response = await fetch(url.toString(), {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      console.error(
        `Error fetching proposições: ${response.status} ${response.statusText}`,
      );
      return null;
    }

    const data: ProposicoesResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching proposições from API:", error);
    return null;
  }
}

export async function fetchProposicaoById(
  id: number,
): Promise<ProposicaoAPI | null> {
  try {
    const url = `${CAMARA_API_BASE_URL}/proposicoes/${id}`;

    const response = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      console.error(
        `Error fetching proposição ${id}: ${response.status} ${response.statusText}`,
      );
      return null;
    }

    const data: { dados: ProposicaoAPI } = await response.json();
    return data.dados;
  } catch (error) {
    console.error(`Error fetching proposição ${id} from API:`, error);
    return null;
  }
}

export function transformProposicaoToBill(proposicao: ProposicaoAPI): Omit<
  Bill,
  "views" | "comments_count" | "supports_count"
> {
  // Generate code: "PL 11/2003"
  const code = `${proposicao.siglaTipo} ${proposicao.numero}/${proposicao.ano}`;

  // Generate title from code or use truncated ementa
  const title =
    proposicao.ementa.length > 100
      ? `${code}: ${proposicao.ementa.slice(0, 97)}...`
      : `${code}: ${proposicao.ementa}`;

  return {
    id: proposicao.id,
    title,
    code,
    status: "Em discussão", // Default status
    location: "Brasil", // Default location
    author: proposicao.siglaTipo, // Use siglaTipo as author placeholder
    summary: proposicao.ementa,
    tags: [proposicao.siglaTipo], // Use siglaTipo as tag
    created_at: proposicao.dataApresentacao,
    updated_at: proposicao.dataApresentacao,
    pdf_url: proposicao.urlInteiroTeor || null, // PDF URL for full bill text
  };
}

