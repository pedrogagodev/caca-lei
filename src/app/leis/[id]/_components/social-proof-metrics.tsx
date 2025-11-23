import { ChatCircle, ThumbsUp } from "@phosphor-icons/react/dist/ssr";

interface SocialProofMetricsProps {
  comments: number;
  supports: number;
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}

export function SocialProofMetrics({
  comments,
  supports,
}: SocialProofMetricsProps) {
  const metrics = [
    {
      icon: ChatCircle,
      label: "comentários",
      value: comments,
      ariaLabel: `${comments} comentários`,
    },
    {
      icon: ThumbsUp,
      label: "apoios",
      value: supports,
      ariaLabel: `${supports} apoios`,
    },
  ];

  return (
    <div
      className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground md:gap-6"
      aria-label="Métricas de engajamento"
    >
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.label}
            className="flex items-center gap-1.5 transition-colors duration-200 hover:text-foreground"
            aria-label={metric.ariaLabel}
          >
            <Icon className="h-4 w-4" weight="duotone" aria-hidden="true" />
            <span className="font-medium tabular-nums">
              {formatNumber(metric.value)}
            </span>
            <span className="hidden sm:inline">{metric.label}</span>
          </div>
        );
      })}
    </div>
  );
}
