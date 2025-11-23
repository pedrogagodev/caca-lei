import { Card } from "@/components/ui/card";
import { CheckCircle, Circle, Clock } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

type StageStatus = "completed" | "current" | "pending";

interface TimelineStage {
  stage: string;
  date: string | null;
  status: StageStatus;
  description?: string;
}

interface ProgressTimelineProps {
  stages: TimelineStage[];
}

export function ProgressTimeline({ stages }: ProgressTimelineProps) {
  return (
    <Card className="px-4 py-4 md:px-6 md:py-5">
      {/* Header */}
      <div className="mb-5">
        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
          Tramitação
        </p>
        <h2 className="text-xl font-semibold">Progresso do projeto</h2>
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {stages.map((item, index) => {
          const isLast = index === stages.length - 1;

          return (
            <div key={item.stage} className="relative flex gap-4">
              {/* Icon Column */}
              <div className="flex flex-col items-center">
                {/* Icon */}
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-200",
                    item.status === "completed" &&
                      "border-green-500 bg-green-500/10",
                    item.status === "current" &&
                      "border-primary bg-primary/10 ring-4 ring-primary/20",
                    item.status === "pending" &&
                      "border-muted-foreground/30 bg-background",
                  )}
                >
                  {item.status === "completed" && (
                    <CheckCircle
                      className="h-5 w-5 text-green-600 dark:text-green-400"
                      weight="fill"
                    />
                  )}
                  {item.status === "current" && (
                    <Clock className="h-5 w-5 text-primary" weight="duotone" />
                  )}
                  {item.status === "pending" && (
                    <Circle
                      className="h-4 w-4 text-muted-foreground/50"
                      weight="regular"
                    />
                  )}
                </div>

                {/* Connector Line */}
                {!isLast && (
                  <div
                    className={cn(
                      "mt-1 h-full w-0.5 flex-1 transition-colors duration-200",
                      item.status === "completed"
                        ? "bg-green-500/30"
                        : "bg-border",
                    )}
                    style={{ minHeight: "24px" }}
                  />
                )}
              </div>

              {/* Content Column */}
              <div className="flex-1 pb-2">
                <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                  <h3
                    className={cn(
                      "font-semibold transition-colors duration-200",
                      item.status === "completed" && "text-foreground",
                      item.status === "current" && "text-primary",
                      item.status === "pending" && "text-muted-foreground",
                    )}
                  >
                    {item.stage}
                  </h3>
                  {item.date && (
                    <time
                      className="text-sm text-muted-foreground"
                      dateTime={item.date}
                    >
                      {new Date(item.date).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </time>
                  )}
                </div>
                {item.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
