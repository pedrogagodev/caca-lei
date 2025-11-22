import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "./_components/status-badge";
import { ReactionButton } from "./_components/reaction-button";
import { ManagerPanel } from "./_components/manager-panel";

const law = {
  id: "pl-123-2025",
  title: "Tarifa Zero no Transporte Municipal",
  status: "Em discussão",
  breadcrumb: ["Leis", "Transporte", "PL 123/2025"],
  code: "PL 123/2025",
  location: "São Paulo",
  author: "Vereadora Ana Costa",
  summary:
    "Piloto de tarifa zero nos fins de semana em linhas troncais e perimetrais, com metas de inclusão e métricas de engajamento cidadão.",
  videoDuration: "60s",
  videoStatus: "Resumo em 60s",
  support: "72% apoio",
  engagements: "1.2k engajamentos",
  tags: ["Transporte", "Inclusão", "Mobilidade"],
};

const summaryPoints = [
  "Linhas principais gratuitas aos sábados e domingos, priorizando zonas de maior deslocamento.",
  "Financiamento compartilhado: subsídio municipal + compensação por publicidade nos ônibus.",
  "Avaliação contínua via engajamento cidadão e dados de lotação para expansão futura.",
];

const accordion = [
  { title: "Quem é afetado", text: "Usuários de linhas troncais, trabalhadores de fim de semana e estudantes em deslocamento interbairros." },
  { title: "Quando entra em vigor", text: "Projeto-piloto inicia 90 dias após aprovação, com duração de 6 meses renováveis." },
  { title: "Principais mudanças", text: "Faixas de pico monitoradas, horários adicionais e painéis digitais com dados em tempo real." },
];

const comments = [
  {
    name: "Helena Duarte",
    reaction: "❤️ Apoio",
    text: "Uso essa linha todo domingo. Tarifa zero ajuda no orçamento e aumenta a frequência de visitas à minha mãe.",
  },
  {
    name: "Rafael Lima",
    reaction: "💢 Não apoio",
    text: "Precisa de mais ônibus, não só gratuidade. Se vier sem reforço de frota, vira caos.",
  },
  {
    name: "Carlos Ferreira",
    reaction: "⚠️ Impacta minha vida",
    text: "Trabalho à noite, qualquer mudança de horário mexe no meu trajeto. Quero mais detalhes sobre a madrugada.",
  },
];

const managerData = {
  totalEngagements: "12.4k",
  support: "68% favoráveis",
  understanding: 76,
  trend: "+12% nos últimos 7 dias",
  distribution: [
    { label: "❤️ Apoio", value: 62 },
    { label: "💢 Não apoio", value: 14 },
    { label: "🤔 Não entendi", value: 12 },
    { label: "⚠️ Impacta", value: 12 },
  ],
  topics: [
    "🚌 Transporte lotado (172)",
    "💰 Impacto na tarifa (98)",
    "⌚ Horários reduzidos (64)",
    "♿ Acessibilidade (41)",
  ],
  insights: [
    "Cidade pede transparência sobre como o subsídio será financiado.",
    "Reforçar comunicação de horários extras reduz dúvidas de madrugada.",
    "Apoio cresce após vídeos curtos; mantenha ritmo diário.",
  ],
};

const isManager = true;

export default function LawDetailPage() {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6">
        <Card className="relative overflow-hidden px-5 py-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {law.breadcrumb.map((item, idx) => (
              <span key={item} className="flex items-center gap-2">
                <Link href="/leis" className="hover:text-foreground">
                  {item}
                </Link>
                {idx < law.breadcrumb.length - 1 ? ">" : null}
              </span>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <StatusBadge status={law.status} />
            <div className="flex flex-wrap gap-2">
              {law.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <h1 className="text-3xl font-semibold leading-tight sm:text-[36px]">{law.title}</h1>
            <p className="text-sm text-muted-foreground">
              {law.code} · {law.location} · {law.author}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button>
              Ver texto oficial
            </Button>
            <Button variant="outline">
              Compartilhar
            </Button>
            <Button variant="outline">
              Favoritar
            </Button>
            <Badge variant="secondary">
              {law.support} · {law.engagements}
            </Badge>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-4">
              <Card className="overflow-hidden">
                <div className="relative aspect-[9/16] w-full bg-muted">
                <div className="absolute inset-0 flex items-center justify-center text-4xl">▶</div>
                <div className="absolute left-3 top-3 flex items-center gap-2 text-xs">
                  <Badge>{law.videoStatus}</Badge>
                  <Badge variant="secondary">{law.videoDuration}</Badge>
                </div>
                <div className="absolute bottom-3 left-3 right-16">
                  <div className="mb-2 flex items-center gap-2 text-xs">
                    <Badge variant="secondary">Play/Pause</Badge>
                    <Badge variant="secondary">Mute</Badge>
                  </div>
                  <Progress value={66} />
                </div>
                <div className="absolute right-3 top-16 flex flex-col gap-2 text-sm">
                  {["❤️ Apoio", "💢 Não apoio", "🤔 Não entendi", "⚠️ Impacta minha vida"].map((reaction) => (
                    <Button
                      key={reaction}
                      variant="secondary"
                      size="sm"
                      className="justify-start"
                    >
                      {reaction}
                    </Button>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 px-4 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="text-sm text-muted-foreground">{law.summary}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs sm:justify-end">
                  <Badge variant="outline">Download</Badge>
                  <Badge variant="outline">Compartilhar</Badge>
                  <Badge variant="outline">Salvar</Badge>
                </div>
              </div>
            </Card>

            <Card className="space-y-3 px-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Entenda em 3 pontos</p>
                  <h2 className="text-xl font-semibold">Resumo rápido</h2>
                </div>
                <Badge variant="outline">Modo cidadão</Badge>
              </div>
              <ol className="space-y-3 text-sm text-muted-foreground">
                {summaryPoints.map((item, idx) => (
                  <li key={item} className="flex gap-3">
                    <Badge variant="secondary">{idx + 1}</Badge>
                    <span className="leading-6">{item}</span>
                  </li>
                ))}
              </ol>
              <Separator />
              <Accordion type="single" collapsible className="space-y-2">
                {accordion.map((item, idx) => (
                  <AccordionItem key={item.title} value={`item-${idx}`} className="border rounded-xl px-3 bg-muted">
                    <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {item.text}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </section>

          <section className="space-y-4">
            {isManager ? <ManagerPanel data={managerData} /> : null}

            <Card className="px-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Feedback</p>
                  <h2 className="text-xl font-semibold">Reaja rápido</h2>
                </div>
                <Badge variant="secondary">
                  1.2k envios
                </Badge>
              </div>
              <div className="mt-3 grid gap-3">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <ReactionButton label="❤️ Apoio" active />
                  <ReactionButton label="💢 Não apoio" />
                  <ReactionButton label="🤔 Não entendi" />
                  <ReactionButton label="⚠️ Impacta minha vida" />
                </div>
                <Card className="px-3 py-3 bg-muted">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Intensidade</span>
                    <span className="font-semibold text-foreground">Forte</span>
                  </div>
                  <Slider defaultValue={[72]} max={100} step={1} className="mt-2" />
                  <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                    <span>Fraco</span>
                    <span>Médio</span>
                    <span>Forte</span>
                  </div>
                </Card>
                <div className="space-y-2">
                  <label className="text-sm font-semibold" htmlFor="feedback">
                    Comentário
                  </label>
                  <Textarea
                    id="feedback"
                    rows={3}
                    placeholder="Conte rapidamente como isso afeta o seu dia a dia."
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Sem login: pop-up para Entrar/Criar conta.</span>
                    <Button>
                      Enviar feedback
                    </Button>
                  </div>
                  <p className="text-xs text-green-600">Feedback enviado! Obrigado por participar.</p>
                </div>
              </div>
            </Card>

            <Card className="px-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Discussão</p>
                  <h2 className="text-xl font-semibold">Comentários</h2>
                </div>
                <Tabs defaultValue="principais" className="w-auto">
                  <TabsList>
                    <TabsTrigger value="principais">Principais</TabsTrigger>
                    <TabsTrigger value="recentes">Recentes</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="mt-4 space-y-3">
                {comments.map((comment) => (
                  <Card
                    key={comment.name}
                    className="px-3 py-3 bg-muted/80 transition hover:border-primary/60"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarFallback>{comment.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{comment.name}</p>
                          <p className="text-[12px] text-muted-foreground">Há 2h</p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {comment.reaction}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{comment.text}</p>
                    <Button variant="link" size="sm" className="mt-2 h-auto p-0 text-xs">
                      Ver mais
                    </Button>
                  </Card>
                ))}
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
