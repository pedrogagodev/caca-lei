import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./status-badge";
import { LawSummaryCard } from "./law-summary-card";
import { LawDetailsAccordion } from "./law-details-accordion";

interface InfoSidebarProps {
  law: {
    breadcrumb: string[];
    status: string;
    tags: string[];
    title: string;
    code: string;
    location: string;
    author: string;
  };
  summary: string;
  keyPoints: string[];
  detailSections: Array<{
    title: string;
    content: string;
  }>;
}

export function InfoSidebar({
  law,
  summary,
  keyPoints,
  detailSections,
}: InfoSidebarProps) {
  return (
    <aside
      className="space-y-6 lg:h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-2"
      aria-label="Informações da lei"
    >
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {law.breadcrumb.map((item, idx) => (
            <span key={item} className="flex items-center gap-2">
              <Link
                href={idx === 0 ? "/" : "/leis"}
                className="transition-colors duration-200 hover:text-foreground"
              >
                {item}
              </Link>
              {idx < law.breadcrumb.length - 1 ? (
                <span className="text-muted-foreground/60">&gt;</span>
              ) : null}
            </span>
          ))}
        </div>
      </nav>

      {/* Status & Tags */}
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status={law.status} />
        <div className="flex flex-wrap gap-2">
          {law.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="transition-all duration-200 hover:scale-105"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Title & Metadata */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold leading-tight lg:text-3xl">
          {law.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {law.code} · {law.location} · {law.author}
        </p>
      </div>

      {/* Summary Card */}
      <LawSummaryCard summary={summary} keyPoints={keyPoints} />

      {/* Details Accordion */}
      <LawDetailsAccordion sections={detailSections} />
    </aside>
  );
}
