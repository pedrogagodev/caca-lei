export interface ProposicaoAPI {
  id: number;
  uri: string;
  siglaTipo: string;
  codTipo: number;
  numero: number;
  ano: number;
  ementa: string;
  dataApresentacao: string;
  urlInteiroTeor?: string; // PDF URL for full bill text
}

export interface ProposicoesResponse {
  dados: ProposicaoAPI[];
  links: Array<{
    rel: string;
    href: string;
  }>;
}

