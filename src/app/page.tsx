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
  XCircle
} from "@phosphor-icons/react";
import { useState } from "react";
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
      className="h-10 gap-2 rounded-full border-foreground/10 px-4 text-sm font-semibold transition-all duration-200 hover:scale-105 hover:border-primary/40"
    >
      <ThumbsUp
        size={18}
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
        <div className="flex items-center gap-2">
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
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-10 w-20 rounded-full" />
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

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div className="relative mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:grid-cols-[240px_1fr] lg:px-6">
        <aside className="hidden gap-6 sm:flex sm:flex-col">
          <SidebarFilters
            defaultTheme="all"
            onThemeChange={(theme) => {
              console.log("Theme changed:", theme);
              // TODO: Implement theme filtering logic
            }}
          />
        </aside>

        <section className="space-y-4">
          {/* Mobile Theme Pills - Only visible on small screens */}
          <div className="sm:hidden">
            <MobileFilters
              defaultTheme="all"
              onThemeChange={(theme) => {
                console.log("Theme changed:", theme);
                // TODO: Implement theme filtering logic
              }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Lista de leis</p>
              <h1 className="text-3xl font-semibold sm:text-[34px]">Descubra, compare, reaja</h1>
            </div>
          </div>

          <div className="space-y-3">
            {laws.map((law) => (
              <Link key={law.id} href={`/leis/${law.id}`} className="block">
                <LawCard law={law} />
              </Link>
            ))}
            <SkeletonCard />
            <SkeletonCard />
          </div>

          <Card className="flex flex-col items-center gap-3 px-6 py-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Shield size={32} weight="regular" className="text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold">Nenhuma lei encontrada</p>
            <p className="max-w-md text-sm text-muted-foreground">
              Ajuste os filtros acima ou refine sua busca para encontrar leis relevantes.
            </p>
          </Card>
        </section>
      </div>
    </div>
  );
}
