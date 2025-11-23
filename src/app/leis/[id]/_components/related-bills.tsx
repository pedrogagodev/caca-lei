import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./status-badge";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { topicIcons } from "@/constants/topic-icons";

interface RelatedBill {
  id: number;
  title: string;
  code: string;
  status: string;
  tags: string[];
  location: string;
}

interface RelatedBillsProps {
  bills: RelatedBill[];
}

export function RelatedBills({ bills }: RelatedBillsProps) {
  if (bills.length === 0) {
    return null;
  }

  return (
    <Card className="px-4 py-4 md:px-6 md:py-5">
      {/* Header */}
      <div className="mb-5">
        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
          Projetos relacionados
        </p>
        <h2 className="text-xl font-semibold">
          Você também pode se interessar
        </h2>
      </div>

      {/* Bills Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {bills.map((bill) => (
          <Link key={bill.id} href={`/leis/${bill.id}`} className="group block">
            <Card className="h-full border border-border bg-card p-4 transition-all duration-200 hover:scale-[1.02] hover:border-primary/50 hover:shadow-md active:scale-[0.98]">
              {/* Status & Tags */}
              <div className="mb-3 flex flex-wrap items-center gap-1.5">
                <StatusBadge status={bill.status} />
                {bill.tags.slice(0, 2).map((tag) => {
                  const TopicIcon = topicIcons[tag];
                  return (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="gap-1 rounded-full border border-foreground/10 bg-muted/50 px-2.5 py-0.5 text-[10px] font-normal text-muted-foreground transition-all duration-200 group-hover:scale-105"
                    >
                      {TopicIcon && <TopicIcon size={11} weight="regular" />}
                      <span>{tag}</span>
                    </Badge>
                  );
                })}
              </div>

              {/* Title */}
              <h3 className="mb-2 line-clamp-2 font-semibold leading-snug text-foreground transition-colors duration-200 group-hover:text-primary">
                {bill.title}
              </h3>

              {/* Metadata */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{bill.code}</span>
                <span className="flex items-center gap-1 transition-transform duration-200 group-hover:translate-x-1">
                  Ver mais
                  <ArrowRight className="h-4 w-4" weight="bold" />
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* View All Link */}
      <div className="mt-4 text-center">
        <Link
          href="/leis"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-all duration-200 hover:gap-2 hover:underline"
        >
          Ver todos os projetos
          <ArrowRight className="h-4 w-4" weight="bold" />
        </Link>
      </div>
    </Card>
  );
}
