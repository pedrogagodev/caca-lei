/**
 * Theme Mapping
 * Maps theme/category filter IDs to law topics
 */

export const themeMapping: Record<string, string[]> = {
  all: [], // Empty array means show all
  transport: ["Transporte", "Mobilidade"],
  health: ["Saúde", "Serviço Público"],
  education: ["Educação"],
  security: ["Segurança"],
  privacy: ["Privacidade"],
  environment: ["Meio Ambiente", "Sustentabilidade", "Urbanismo"],
};
