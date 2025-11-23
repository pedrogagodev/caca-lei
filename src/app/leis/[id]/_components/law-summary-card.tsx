import { CheckCircle } from "@phosphor-icons/react/dist/ssr";

interface LawSummaryCardProps {
  summary: string;
  keyPoints: string[];
  details?: {
    objective?: string;
    howItWorks?: string;
    whoIsImpacted?: string;
    nextSteps?: string;
  };
}

export function LawSummaryCard({
  summary,
  keyPoints,
  details,
}: LawSummaryCardProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-foreground md:text-2xl">
          O que esta lei faz
        </h2>
      </div>

      {/* Summary */}
      <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
        {summary}
      </p>

      {/* Key Points */}
      {keyPoints.length > 0 && (
        <div className="space-y-2.5">
          <h3 className="text-base font-semibold text-foreground">
            Principais pontos
          </h3>
          <ul className="space-y-2.5">
            {keyPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle
                  size={18}
                  weight="fill"
                  className="mt-0.5 shrink-0 text-primary"
                />
                <span className="text-sm leading-relaxed text-muted-foreground">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Details Sections */}
      {details && (
        <div className="space-y-4">
          {details.objective && (
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-foreground">
                Objetivo
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {details.objective}
              </p>
            </div>
          )}

          {details.howItWorks && (
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-foreground">
                Como funciona
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {details.howItWorks}
              </p>
            </div>
          )}

          {details.whoIsImpacted && (
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-foreground">
                Quem é impactado
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {details.whoIsImpacted}
              </p>
            </div>
          )}

          {details.nextSteps && (
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-foreground">
                Próximos passos
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {details.nextSteps}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
