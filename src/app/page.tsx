"use client";

import Link from "next/link";
import {
  ThumbsUp,
  ChatCircle,
  Shield,
  Bus,
  Heart,
  RoadHorizon,
  FirstAid,
  Briefcase,
  GraduationCap,
  LockKey,
  Circle,
  ClockCounterClockwise,
  CheckCircle,
  XCircle,
  Leaf,
  Eye,
  Recycle,
  Buildings
} from "@phosphor-icons/react";
import { useState, useMemo } from "react";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LawListCard } from "@/components/ui/law-list-card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarFilters } from "@/app/leis/_components/sidebar-filters";
import { MobileFilters } from "@/app/leis/_components/mobile-filters";

type Law = {
  id: string;
  title: string;
  status: "Em discussão" | "Em votação" | "Aprovada" | "Arquivada";
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
};

const laws: Law[] = [
  {
    id: "pl-123-2025",
    title: "Tarifa Zero no Transporte Municipal",
    status: "Em discussão",
    location: "São Paulo",
    author: "Vereadora Ana Costa",
    code: "PL 123/2025",
    summary:
      "Institui programa piloto de tarifa zero em linhas troncais aos fins de semana, com metas de acesso e métricas de engajamento social.",
    topics: ["Transporte", "Inclusão", "Mobilidade"],
    engagements: "🔥 1.2k engajamentos",
    support: "👍 72% apoio",
    videoLabel: "▶ Ver vídeo de 60s",
    manager: {
      feedbackLastDay: 54,
      trend: "Tendência estável",
    },
  },
  {
    id: "pl-412-2024",
    title: "Requalificação de Postos de Saúde 24h",
    status: "Em votação",
    location: "Curitiba",
    author: "Dep. Lucas Prado",
    code: "PL 412/2024",
    summary:
      "Prevê turnos ampliados para clínicas da família e contratação emergencial, priorizando bairros com maior fila de espera.",
    topics: ["Saúde", "Serviço Público"],
    engagements: "🔥 987 engajamentos",
    support: "👍 64% apoio",
    videoLabel: "▶ Ver vídeo de 60s",
  },
  {
    id: "pl-88-2023",
    title: "Proteção de Dados em Escolas",
    status: "Aprovada",
    location: "Recife",
    author: "Pref. Interino",
    code: "PL 088/2023",
    summary:
      "Define padrões mínimos de coleta, guarda e compartilhamento de dados estudantis com fornecedores de tecnologia educacional.",
    topics: ["Educação", "Privacidade"],
    engagements: "🔥 2.3k engajamentos",
    support: "👍 81% apoio",
    videoLabel: "▶ Ver vídeo de 60s",
  },
  {
    id: "pl-234-2025",
    title: "Ciclovias em Áreas Residenciais",
    status: "Em discussão",
    location: "Rio de Janeiro",
    author: "Ver. Carlos Silva",
    code: "PL 234/2025",
    summary:
      "Amplia rede de ciclovias conectando bairros residenciais a estações de metrô e BRT, com sinalização adequada e bicicletários.",
    topics: ["Transporte", "Mobilidade"],
    engagements: "🔥 856 engajamentos",
    support: "👍 68% apoio",
    videoLabel: "▶ Ver vídeo de 60s",
  },
  {
    id: "pl-567-2024",
    title: "Telemedicina no SUS",
    status: "Aprovada",
    location: "Brasília",
    author: "Sen. Maria Santos",
    code: "PL 567/2024",
    summary:
      "Regulamenta atendimento por telemedicina na rede pública, incluindo consultas, diagnósticos e prescrições remotas.",
    topics: ["Saúde", "Tecnologia"],
    engagements: "🔥 1.8k engajamentos",
    support: "👍 76% apoio",
    videoLabel: "▶ Ver vídeo de 60s",
  },
  {
    id: "pl-789-2024",
    title: "Educação Digital nas Escolas Públicas",
    status: "Em votação",
    location: "São Paulo",
    author: "Dep. João Oliveira",
    code: "PL 789/2024",
    summary:
      "Inclui programação e pensamento computacional no currículo obrigatório do ensino fundamental, com capacitação de professores.",
    topics: ["Educação", "Tecnologia"],
    engagements: "🔥 1.5k engajamentos",
    support: "👍 79% apoio",
    videoLabel: "▶ Ver vídeo de 60s",
  },
  {
    id: "pl-321-2023",
    title: "Câmeras em Viaturas Policiais",
    status: "Aprovada",
    location: "Belo Horizonte",
    author: "Ver. Patricia Lima",
    code: "PL 321/2023",
    summary:
      "Torna obrigatório uso de câmeras corporais e dashcams em todas as viaturas da Polícia Militar e Guarda Municipal.",
    topics: ["Segurança", "Transparência"],
    engagements: "🔥 2.1k engajamentos",
    support: "👍 84% apoio",
    videoLabel: "▶ Ver vídeo de 60s",
  },
  {
    id: "pl-456-2024",
    title: "LGPD Municipal para Serviços Digitais",
    status: "Em discussão",
    location: "Porto Alegre",
    author: "Ver. Rafael Costa",
    code: "PL 456/2024",
    summary:
      "Estabelece diretrizes municipais de proteção de dados pessoais em aplicativos e portais da prefeitura, com auditorias periódicas.",
    topics: ["Privacidade", "Tecnologia"],
    engagements: "🔥 743 engajamentos",
    support: "👍 71% apoio",
    videoLabel: "▶ Ver vídeo de 60s",
  },
  {
    id: "pl-654-2023",
    title: "Preservação de Áreas Verdes Urbanas",
    status: "Aprovada",
    location: "Curitiba",
    author: "Ver. Ana Verde",
    code: "PL 654/2023",
    summary:
      "Cria programa de mapeamento e proteção de áreas verdes urbanas, proibindo construções em raio de 100m de nascentes.",
    topics: ["Meio Ambiente", "Urbanismo"],
    engagements: "🔥 1.3k engajamentos",
    support: "👍 82% apoio",
    videoLabel: "▶ Ver vídeo de 60s",
  },
  {
    id: "pl-892-2025",
    title: "Coleta Seletiva Obrigatória em Condomínios",
    status: "Em votação",
    location: "Salvador",
    author: "Ver. Marcos Dias",
    code: "PL 892/2025",
    summary:
      "Determina instalação de pontos de coleta seletiva em todos os condomínios residenciais e comerciais com mais de 10 unidades.",
    topics: ["Meio Ambiente", "Sustentabilidade"],
    engagements: "🔥 621 engajamentos",
    support: "👍 65% apoio",
    videoLabel: "▶ Ver vídeo de 60s",
  },
  {
    id: "pl-147-2024",
    title: "Bolsa Escola para Famílias de Baixa Renda",
    status: "Em discussão",
    location: "Fortaleza",
    author: "Ver. Lucia Mendes",
    code: "PL 147/2024",
    summary:
      "Institui auxílio financeiro mensal para famílias com renda per capita inferior a meio salário mínimo que mantêm filhos na escola.",
    topics: ["Educação", "Inclusão"],
    engagements: "🔥 1.9k engajamentos",
    support: "👍 77% apoio",
    videoLabel: "▶ Ver vídeo de 60s",
  },
  {
    id: "pl-258-2023",
    title: "Ronda Escolar em Horários de Entrada e Saída",
    status: "Aprovada",
    location: "Recife",
    author: "Ver. Pedro Alves",
    code: "PL 258/2023",
    summary:
      "Amplia policiamento ostensivo em perímetro de 200m ao redor de escolas durante horários de entrada e saída de alunos.",
    topics: ["Segurança", "Educação"],
    engagements: "🔥 1.4k engajamentos",
    support: "👍 88% apoio",
    videoLabel: "▶ Ver vídeo de 60s",
  },
  {
    id: "pl-369-2025",
    title: "Corredores de Ônibus Inteligentes",
    status: "Em votação",
    location: "Brasília",
    author: "Dep. Fernanda Rocha",
    code: "PL 369/2025",
    summary:
      "Implementa sistema de semáforos sincronizados e câmeras de fiscalização automática em corredores exclusivos de ônibus.",
    topics: ["Transporte", "Tecnologia"],
    engagements: "🔥 934 engajamentos",
    support: "👍 69% apoio",
    videoLabel: "▶ Ver vídeo de 60s",
  },
  {
    id: "pl-741-2024",
    title: "Prontuário Eletrônico Unificado",
    status: "Em discussão",
    location: "São Paulo",
    author: "Dep. Roberto Farias",
    code: "PL 741/2024",
    summary:
      "Cria plataforma estadual de prontuário eletrônico único, permitindo acesso do paciente a todo histórico médico na rede pública.",
    topics: ["Saúde", "Tecnologia", "Privacidade"],
    engagements: "🔥 1.1k engajamentos",
    support: "👍 73% apoio",
    videoLabel: "▶ Ver vídeo de 60s",
  },
  {
    id: "pl-852-2023",
    title: "Incentivo Fiscal para Energia Solar",
    status: "Aprovada",
    location: "Belo Horizonte",
    author: "Ver. Claudia Nunes",
    code: "PL 852/2023",
    summary:
      "Reduz IPTU em até 20% para imóveis com painéis solares instalados, válido por 10 anos após instalação certificada.",
    topics: ["Meio Ambiente", "Sustentabilidade"],
    engagements: "🔥 1.7k engajamentos",
    support: "👍 80% apoio",
    videoLabel: "▶ Ver vídeo de 60s",
  },
  {
    id: "pl-963-2025",
    title: "Combate ao Bullying nas Escolas",
    status: "Em discussão",
    location: "Rio de Janeiro",
    author: "Ver. Sandra Ribeiro",
    code: "PL 963/2025",
    summary:
      "Estabelece protocolos obrigatórios de prevenção e combate ao bullying escolar, com treinamento semestral de professores e orientadores.",
    topics: ["Educação", "Segurança"],
    engagements: "🔥 2.2k engajamentos",
    support: "👍 91% apoio",
    videoLabel: "▶ Ver vídeo de 60s",
  },
];

// Topic icon mapping
const topicIcons: Record<string, React.ComponentType<{ size?: number; weight?: "regular" | "fill" }>> = {
  Transporte: Bus,
  Inclusão: Heart,
  Mobilidade: RoadHorizon,
  Saúde: FirstAid,
  "Serviço Público": Briefcase,
  Educação: GraduationCap,
  Privacidade: LockKey,
  "Meio Ambiente": Leaf,
  Segurança: Shield,
  Tecnologia: Eye,
  Sustentabilidade: Recycle,
  Urbanismo: Buildings,
  Transparência: Eye,
};

// Status configuration with icons
const statusConfig: Record<
  Law["status"],
  {
    variant: "default" | "secondary" | "outline" | "destructive";
    icon: React.ComponentType<{ size?: number; weight?: "regular" | "fill" }>;
    badgeClass: string;
  }
> = {
  "Em discussão": {
    variant: "default",
    icon: Circle,
    badgeClass: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400",
  },
  "Em votação": {
    variant: "secondary",
    icon: ClockCounterClockwise,
    badgeClass: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400",
  },
  Aprovada: {
    variant: "outline",
    icon: CheckCircle,
    badgeClass: "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400",
  },
  Arquivada: {
    variant: "destructive",
    icon: XCircle,
    badgeClass: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400",
  },
};

function UpvoteButton({ count, active, onClick }: { count: number; active?: boolean; onClick?: (e: React.MouseEvent) => void }) {
  return (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className="h-16 w-20 flex-col gap-1 rounded-lg border-foreground/10 p-2 text-xs font-semibold transition-all duration-200 hover:scale-105 hover:border-primary/40"
    >
      <ThumbsUp
        size={20}
        weight={active ? "fill" : "regular"}
      />
      <span className="tabular-nums">{count}%</span>
    </Button>
  );
}

function LawCard({ law }: { law: Law }) {
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(Number.parseInt(law.support.replace(/\D/g, "")));
  const engagementCount = law.engagements.split(" ")[1];

  // Tag limiting: show max 2 tags
  const visibleTopics = law.topics.slice(0, 2);
  const remainingTopicsCount = law.topics.length - visibleTopics.length;

  // Truncate description to 80 characters
  const maxDescriptionLength = 80;
  const isTruncated = law.summary.length > maxDescriptionLength;
  const truncatedSummary = isTruncated
    ? law.summary.slice(0, maxDescriptionLength).trim() + "..."
    : law.summary;

  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isUpvoted) {
      setIsUpvoted(true);
      setUpvoteCount((prev) => prev + 1);
    } else {
      setIsUpvoted(false);
      setUpvoteCount((prev) => prev - 1);
    }
  };

  // Get status configuration
  const status = statusConfig[law.status];
  const StatusIcon = status.icon;

  return (
    <LawListCard
      leading={undefined}
      actions={
        <div className="flex flex-col items-end gap-2">
          {/* Status badge - positioned with actions */}
          <Badge
            variant={status.variant}
            className={`gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium ${status.badgeClass}`}
          >
            <StatusIcon size={12} weight="fill" />
            <span>{law.status}</span>
          </Badge>
          <UpvoteButton count={upvoteCount} active={isUpvoted} onClick={handleUpvote} />
        </div>
      }
    >
      {/* Block 1: Title (Maximum weight) */}
      <div>
        <h3 className="text-xl font-bold leading-tight tracking-tight transition-colors duration-200 group-hover:text-primary">
          {law.title}
        </h3>
      </div>

      {/* Block 2: Topic Tags (with icons) */}
      <div className="flex flex-wrap items-center gap-1.5">
        {visibleTopics.map((topic) => {
          const TopicIcon = topicIcons[topic];
          return (
            <Badge
              key={topic}
              variant="secondary"
              className="gap-1 rounded-full border border-foreground/10 bg-muted/50 px-2.5 py-0.5 text-[10px] font-normal text-muted-foreground"
            >
              {TopicIcon && <TopicIcon size={11} weight="regular" />}
              <span>{topic}</span>
            </Badge>
          );
        })}
        {remainingTopicsCount > 0 && (
          <Badge
            variant="outline"
            className="rounded-full border-foreground/10 px-2 py-0.5 text-[10px] font-normal text-muted-foreground"
          >
            +{remainingTopicsCount}
          </Badge>
        )}
      </div>

      {/* Block 3: Description (Light weight, truncated) */}
      <div>
        <p className="text-sm font-normal leading-relaxed text-muted-foreground">
          {truncatedSummary}
          {isTruncated && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Aqui você pode adicionar lógica para expandir a descrição ou abrir modal
              }}
              className="ml-1 text-sm font-medium text-primary transition-colors duration-150 hover:text-primary/80"
            >
              Leia mais
            </button>
          )}
        </p>
      </div>

      {/* Block 4: Metrics (Compact) */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1 tabular-nums">
          <ChatCircle size={14} weight="regular" />
          <span className="font-medium text-foreground">{engagementCount}</span>
        </span>
        <span className="text-muted-foreground/50">·</span>
        <span className="text-muted-foreground/50">{law.location}</span>
      </div>
    </LawListCard>
  );
}

function SkeletonCard() {
  return (
    <LawListCard
      leading={undefined}
      actions={
        <div className="flex flex-col items-end gap-2">
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-16 w-20 rounded-lg" />
        </div>
      }
    >
      <Skeleton className="h-7 w-3/4 rounded" />
      <div className="flex gap-1.5">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-3 w-1/3 rounded" />
    </LawListCard>
  );
}

// Theme mapping: filter ID -> topics to match
const themeMapping: Record<string, string[]> = {
  all: [], // Empty array means show all
  transport: ["Transporte", "Mobilidade"],
  health: ["Saúde", "Serviço Público"],
  education: ["Educação"],
  security: ["Segurança"],
  privacy: ["Privacidade"],
  environment: ["Meio Ambiente", "Sustentabilidade", "Urbanismo"],
};

export default function Home() {
  // URL state for theme filter
  const [activeTheme, setActiveTheme] = useQueryState("tema", {
    defaultValue: "all",
    clearOnDefault: true,
  });

  // Filter laws based on active theme
  const filteredLaws = useMemo(() => {
    if (activeTheme === "all") {
      return laws;
    }

    const themesToMatch = themeMapping[activeTheme] || [];
    if (themesToMatch.length === 0) {
      return laws;
    }

    return laws.filter((law) =>
      law.topics.some((topic) => themesToMatch.includes(topic))
    );
  }, [activeTheme]);

  // Calculate dynamic counts for each theme
  const themeCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: laws.length,
      transport: 0,
      health: 0,
      education: 0,
      security: 0,
      privacy: 0,
      environment: 0,
    };

    laws.forEach((law) => {
      Object.entries(themeMapping).forEach(([themeId, topics]) => {
        if (themeId !== "all" && law.topics.some((topic) => topics.includes(topic))) {
          counts[themeId]++;
        }
      });
    });

    return counts;
  }, []);

  return (
    <div className="relative min-h-screen">
      <div className="relative mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:grid-cols-[240px_1fr] lg:px-6">
        <aside className="hidden gap-6 sm:flex sm:flex-col">
          <SidebarFilters
            activeTheme={activeTheme}
            onThemeChange={setActiveTheme}
          />
        </aside>

        <section className="space-y-4">
          {/* Mobile Theme Pills - Only visible on small screens */}
          <div className="sm:hidden">
            <MobileFilters
              activeTheme={activeTheme}
              onThemeChange={setActiveTheme}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Lista de leis</p>
              <h1 className="text-3xl font-semibold sm:text-[34px]">Descubra, compare, reaja</h1>
            </div>
          </div>

          <div className="space-y-3">
            {filteredLaws.map((law) => (
              <Link key={law.id} href={`/leis/${law.id}`} className="block">
                <LawCard law={law} />
              </Link>
            ))}
          </div>

          {filteredLaws.length === 0 && (
            <Card className="flex flex-col items-center gap-3 px-6 py-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Shield size={32} weight="regular" className="text-muted-foreground" />
              </div>
              <p className="text-lg font-semibold">Nenhuma lei encontrada</p>
              <p className="max-w-md text-sm text-muted-foreground">
                Ajuste os filtros acima ou refine sua busca para encontrar leis relevantes.
              </p>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}
