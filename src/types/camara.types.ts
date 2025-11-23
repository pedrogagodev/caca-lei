/**
 * Câmara API Types
 * Types for the Câmara dos Deputados Open Data API
 * https://dadosabertos.camara.leg.br/api/v2
 */

/**
 * Proposição (Proposition) list item
 * Returned by /proposicoes endpoint
 */
export interface ProposicaoListItem {
  id: number;
  uri: string;
  siglaTipo: string;
  codTipo: number;
  numero: number;
  ano: number;
  ementa: string;
}

/**
 * Status information for a proposição
 */
export interface StatusProposicao {
  dataHora: string;
  sequencia: number;
  siglaOrgao: string;
  uriOrgao: string;
  uriUltimoRelator?: string;
  regime?: string;
  descricaoTramitacao: string;
  codTipoTramitacao: string;
  descricaoSituacao: string;
  codSituacao: number;
  despacho?: string;
  url?: string;
  ambito?: string;
}

/**
 * Detailed proposição information
 * Returned by /proposicoes/{id} endpoint
 */
export interface ProposicaoDetalhada {
  id: number;
  uri: string;
  siglaTipo: string;
  codTipo: number;
  numero: number;
  ano: number;
  ementa: string;
  dataApresentacao: string;
  uriOrgaoNumerador: string;
  statusProposicao: StatusProposicao;
  uriAutores: string;
  descricaoTipo: string;
  ementaDetalhada?: string;
  keywords?: string;
  uriPropPrincipal?: string | null;
  uriPropAnterior?: string | null;
  uriPropPosterior?: string | null;
  urlInteiroTeor?: string;
  urnFinal?: string | null;
  texto?: string | null;
  justificativa?: string | null;
}

/**
 * API response wrapper for list endpoints
 */
export interface CamaraApiListResponse<T> {
  dados: T[];
  links?: Array<{
    rel: string;
    href: string;
  }>;
}

/**
 * API response wrapper for single item endpoints
 */
export interface CamaraApiItemResponse<T> {
  dados: T;
  links?: Array<{
    rel: string;
    href: string;
  }>;
}
