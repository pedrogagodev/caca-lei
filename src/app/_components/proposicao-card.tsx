import Link from "next/link";
import { FileText, Calendar } from "@phosphor-icons/react/dist/ssr";
import { LawListCard } from "@/components/ui/law-list-card";
import { Badge } from "@/components/ui/badge";
import type { ProposicaoListItem } from "@/types/camara.types";

interface ProposicaoCardProps {
  proposicao: ProposicaoListItem;
}

export function ProposicaoCard({ proposicao }: ProposicaoCardProps) {
  // Format the title: "PL 2295/2000"
  const title = `${proposicao.siglaTipo} ${proposicao.numero}/${proposicao.ano}`;

  // Truncate ementa (summary) to 120 characters for card display
  const maxLength = 120;
  const ementa = proposicao.ementa || "";
  const isTruncated = ementa.length > maxLength;
  const truncatedEmenta = isTruncated
    ? `${ementa.slice(0, maxLength).trim()}…`
    : ementa;

  return (
    <Link href={`/proposicoes/${proposicao.id}`} className="block">
      <LawListCard
        leading={
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/10 bg-muted/50 transition-all duration-200 group-hover:scale-110 group-hover:border-primary/30 group-hover:bg-primary/5">
            <FileText
              size={20}
              weight="regular"
              className="text-muted-foreground transition-colors duration-200 group-hover:text-primary"
            />
          </div>
        }
        actions={
          <div className="flex items-center gap-2">
            {/* Type badge */}
            <Badge
              variant="secondary"
              className="gap-1 rounded-full border border-foreground/10 bg-muted/50 px-2.5 py-1 text-[10px] font-medium text-muted-foreground transition-all duration-200 hover:border-primary/20 hover:bg-muted"
            >
              <FileText size={11} weight="regular" />
              <span>{proposicao.siglaTipo}</span>
            </Badge>

            {/* Year badge */}
            <Badge
              variant="outline"
              className="gap-1 rounded-full border-foreground/10 px-2.5 py-1 text-[10px] font-normal text-muted-foreground transition-all duration-200 hover:border-primary/20"
            >
              <Calendar size={11} weight="regular" />
              <span>{proposicao.ano}</span>
            </Badge>
          </div>
        }
      >
        {/* Block 1: Title (Proposition identifier) */}
        <div>
          <h3 className="text-xl font-bold leading-tight tracking-tight transition-colors duration-200 group-hover:text-primary">
            {title}
          </h3>
        </div>

        {/* Block 2: Ementa (Summary/Description) */}
        <div>
          <p className="text-sm font-normal leading-relaxed text-muted-foreground transition-colors duration-200 group-hover:text-foreground/80">
            {truncatedEmenta}
          </p>
        </div>

        {/* Block 3: Metadata */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="font-medium text-foreground">
              ID: {proposicao.id}
            </span>
          </span>
          <span className="text-muted-foreground/50">·</span>
          <span className="text-muted-foreground/70">
            Código {proposicao.codTipo}
          </span>
        </div>
      </LawListCard>
    </Link>
  );
}
