/**
 * Theme Data
 * Theme/category filter data for law listing
 */

export interface Theme {
  id: string;
  label: string;
  count: number;
}

export const themes: Theme[] = [
  { id: "all", label: "Todas", count: 247 },
  { id: "transport", label: "Transporte", count: 54 },
  { id: "health", label: "Saúde", count: 72 },
  { id: "education", label: "Educação", count: 48 },
  { id: "security", label: "Segurança", count: 31 },
  { id: "privacy", label: "Dados & Privacidade", count: 28 },
  { id: "environment", label: "Meio Ambiente", count: 14 },
];
