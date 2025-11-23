/**
 * Law Types
 * Canonical type definitions for laws/bills in the application
 */

export type LawStatus =
  | "Em discussão"
  | "Em votação"
  | "Aprovada"
  | "Arquivada";

export interface Law {
  id: string;
  title: string;
  status: LawStatus;
  location: string;
  author: string;
  code: string;
  summary: string;
  topics: string[];
  engagements: string;
  support: string;
  videoLabel: string;
  manager?: {
    feedbackLastDay: number;
    trend: string;
  };
}
