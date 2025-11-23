import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

interface ManagerData {
  totalEngagements: string;
  support: string;
  understanding: number;
  trend: string;
  distribution: Array<{ label: string; value: number }>;
  topics: string[];
  insights: string[];
}

interface ManagerPanelProps {
  data: ManagerData;
}

export function ManagerPanel({ data }: ManagerPanelProps) {
  return (
    <Card className="border-2">
      <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/50">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="uppercase text-[11px]">
            Somente você vê isso
          </Badge>
          <p className="text-sm font-semibold">Painel do Gestor</p>
        </div>
        <div className="text-xs text-muted-foreground">{data.trend}</div>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-2">
        <Card className="flex flex-col px-3 py-3">
          <p className="text-xs text-muted-foreground">Engajamentos totais</p>
          <p className="text-2xl font-semibold">{data.totalEngagements}</p>
          <p className="text-xs text-muted-foreground">+1.8k esta semana</p>
        </Card>
        <Card className="flex flex-col px-3 py-3">
          <p className="text-xs text-muted-foreground">Apoio da população</p>
          <p className="text-2xl font-semibold">{data.support}</p>
          <Progress value={68} className="mt-2" />
        </Card>
        <Card className="flex flex-col px-3 py-3">
          <p className="text-xs text-muted-foreground">Nível de entendimento</p>
          <Progress value={76} className="mt-2" />
          <p className="mt-1 text-xs text-muted-foreground">
            76% dizem entender o projeto
          </p>
        </Card>
        <Card className="flex flex-col px-3 py-3">
          <p className="text-xs text-muted-foreground">Tendência</p>
          <div className="mt-2 flex items-end gap-1 h-10">
            {data.distribution.map((item) => (
              <div
                key={item.label}
                className="flex h-full w-3 items-end overflow-hidden rounded-full bg-muted"
              >
                <div
                  className="w-full bg-primary"
                  style={{ height: `${item.value}%` }}
                />
              </div>
            ))}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Reações por tipo</p>
        </Card>
      </div>
      <Separator />
      <div className="grid gap-4 p-4 sm:grid-cols-[1.2fr_1fr]">
        <Card className="px-3 py-3">
          <p className="text-xs text-muted-foreground">
            Distribuição de reações
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            {data.distribution.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border bg-muted px-3 py-2"
              >
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-lg font-semibold">{item.value}%</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="px-3 py-3">
          <p className="text-xs text-muted-foreground">
            Principais temas citados
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {data.topics.map((topic) => (
              <Badge key={topic} variant="secondary">
                {topic}
              </Badge>
            ))}
          </div>
        </Card>
      </div>
      <Separator />
      <div className="grid gap-3 p-4 sm:grid-cols-[1.6fr_auto]">
        <div>
          <p className="text-xs text-muted-foreground">
            Insights gerados por IA
          </p>
          <ul className="mt-2 space-y-2 text-sm">
            {data.insights.map((insight) => (
              <li
                key={insight}
                className="rounded-lg border bg-muted px-3 py-2"
              >
                {insight}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <Button>Ver comentários em detalhes</Button>
          <Button variant="outline">Exportar relatório</Button>
        </div>
      </div>
    </Card>
  );
}
