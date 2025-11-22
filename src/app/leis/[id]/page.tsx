import { LawHeader } from "./_components/law-header";
import { QuickActions } from "./_components/quick-actions";
import { LawSummaryCard } from "./_components/law-summary-card";
import { LawDetailsAccordion } from "./_components/law-details-accordion";
import { ReactionButtons } from "./_components/reaction-buttons";

// Mock data - Replace with actual data fetching
const law = {
  id: "pl-123-2025",
  title: "Tarifa Zero no Transporte Municipal",
  status: "Em discussão",
  breadcrumb: ["Leis", "Transporte", "PL 123/2025"],
  code: "PL 123/2025",
  location: "São Paulo",
  author: "Vereadora Ana Costa",
  tags: ["Transporte", "Inclusão", "Mobilidade"],
};

const summary =
  "Piloto de tarifa zero nos fins de semana em linhas troncais e perimetrais, com metas de inclusão e métricas de engajamento cidadão.";

const keyPoints = [
  "Linhas principais gratuitas aos sábados e domingos, priorizando zonas de maior deslocamento.",
  "Financiamento compartilhado: subsídio municipal + compensação por publicidade nos ônibus.",
  "Avaliação contínua via engajamento cidadão e dados de lotação para expansão futura.",
];

const detailSections = [
  {
    title: "Quem é afetado",
    content:
      "Usuários de linhas troncais, trabalhadores de fim de semana e estudantes em deslocamento interbairros.",
  },
  {
    title: "Quando entra em vigor",
    content:
      "Projeto-piloto inicia 90 dias após aprovação, com duração de 6 meses renováveis.",
  },
  {
    title: "Principais mudanças",
    content:
      "Faixas de pico monitoradas, horários adicionais e painéis digitais com dados em tempo real.",
  },
];

export default function LawDetailPage() {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-6">
        {/* Header Card */}
        <LawHeader
          breadcrumb={law.breadcrumb}
          status={law.status}
          tags={law.tags}
          title={law.title}
          code={law.code}
          location={law.location}
          author={law.author}
        />

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Content - Mobile-first single column */}
        <div className="mt-6 space-y-6">
          {/* Summary */}
          <LawSummaryCard summary={summary} keyPoints={keyPoints} />

          {/* Details Accordion */}
          <LawDetailsAccordion sections={detailSections} />

          {/* Reactions */}
          <ReactionButtons />
        </div>
      </div>
    </div>
  );
}
