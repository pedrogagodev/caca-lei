interface LawSummaryCardProps {
  summary: string;
  keyPoints: string[];
}

export function LawSummaryCard({ summary }: LawSummaryCardProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground md:text-xl">
        O que esta lei faz
      </h2>
      <p className="text-base leading-relaxed text-muted-foreground md:text-lg md:leading-relaxed">
        {summary}
      </p>
    </div>
  );
}
