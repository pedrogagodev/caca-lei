import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface LawSummaryCardProps {
  summary: string;
  keyPoints: string[];
}

export function LawSummaryCard({ summary, keyPoints }: LawSummaryCardProps) {
  return (
    <Card className="space-y-4 px-4 py-4 md:px-5 md:py-5">
      {/* Summary Section */}
      <div>
        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
          O que esta lei faz
        </p>
        <p className="max-w-prose text-sm leading-relaxed text-foreground md:text-base">
          {summary}
        </p>
      </div>

      <Separator />

      {/* Key Points Section */}
      <div>
        <h2 className="mb-3 text-xl font-semibold">Entenda em 3 pontos</h2>
        <ol className="space-y-3">
          {keyPoints.map((point, idx) => (
            <li key={idx} className="flex gap-3">
              <Badge
                variant="secondary"
                className="h-6 w-6 flex-shrink-0 items-center justify-center rounded-full p-0 text-sm font-semibold"
              >
                {idx + 1}
              </Badge>
              <span className="text-sm leading-6 text-muted-foreground md:text-base">
                {point}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </Card>
  );
}
