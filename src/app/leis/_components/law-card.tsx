import { BookmarkSimple, ChatCircle } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LawListCard } from "@/components/ui/law-list-card";
import { UpvoteButton } from "./upvote-button";

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

const statusVariant: Record<Law["status"], "default" | "secondary" | "outline" | "destructive"> = {
  "Em discussão": "default",
  "Em votação": "secondary",
  Aprovada: "outline",
  Arquivada: "destructive",
};

interface LawCardProps {
  law: Law;
}

export function LawCard({ law }: LawCardProps) {
  const supportPercent = Number.parseInt(law.support.replace(/\D/g, ""));
  const engagementCount = law.engagements.split(" ")[1];

  return (
    <LawListCard className="group relative flex gap-4 overflow-hidden p-4 transition hover:border-primary">
      <div className="flex flex-col items-center gap-3">
        <UpvoteButton count={supportPercent} active={false} />
        <Button variant="ghost" size="sm" className="flex h-auto flex-col items-center gap-0.5 p-1">
          <ChatCircle size={16} weight="regular" />
          <span className="text-xs font-medium tabular-nums">{engagementCount}</span>
        </Button>
      </div>

      <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-gradient-to-br from-primary/10 to-secondary/10">
        <span className="text-2xl font-bold text-primary">{law.code.split(" ")[0]}</span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={statusVariant[law.status]}>{law.status}</Badge>
          {law.topics.slice(0, 3).map((topic) => (
            <Badge key={topic} variant="secondary">
              {topic}
            </Badge>
          ))}
          {law.manager && <Badge variant="outline">Gestor</Badge>}
        </div>

        <div>
          <h3 className="text-lg font-semibold leading-tight group-hover:text-primary">{law.title}</h3>
          <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{law.summary}</p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{law.code}</span>
          <span>·</span>
          <span>{law.location}</span>
          <span>·</span>
          <span>{law.author}</span>
        </div>
      </div>

      <div className="flex flex-shrink-0 items-start gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 transition group-hover:opacity-100"
          aria-label="Salvar para depois"
        >
          <BookmarkSimple size={20} weight="regular" />
        </Button>
      </div>
    </LawListCard>
  );
}

export type { Law };
