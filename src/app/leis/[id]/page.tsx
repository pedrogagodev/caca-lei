import { LawContent } from "./_components/law-content";
import { VideoSidebar } from "./_components/video-sidebar";

// Mock data - Replace with actual data fetching
const law = {
  id: "pl-123-2025",
  title: "Tarifa Zero no Transporte Municipal",
  status: "Em discussão",
  breadcrumb: ["Leis", "Transporte", "PL 123/2025"],
  code: "PL 123/2025",
  location: "São Paulo",
  author: "Vereadora Ana Costa",
  tags: ["Transporte", "Inclusão", "Mobilidade"],
};

const summary =
  "Este projeto de lei institui um programa piloto de tarifa zero no transporte público municipal aos fins de semana, focando inicialmente nas linhas troncais e perimetrais. A proposta visa democratizar o acesso ao transporte, promover inclusão social e avaliar a viabilidade de expansão futura do programa para outros dias da semana e regiões da cidade.";

const keyPoints = [
  "Tarifa zero aos fins de semana em 42 linhas troncais",
  "Programa piloto de 12 meses com avaliação trimestral",
  "Investimento de R$ 2,5 milhões/mês",
  "Prioridade para periferias e regiões com menor acesso"
];

const details = {
  objective:
    "Reduzir a desigualdade no acesso ao transporte público, permitindo que famílias de baixa renda possam se deslocar aos fins de semana sem o peso financeiro das passagens.",
  howItWorks:
    "O programa será implementado em fases. Primeira etapa: tarifa zero apenas aos sábados (meses 1-3). Segunda etapa: extensão para domingos (meses 4-6). A fiscalização usa o sistema de bilhetagem eletrônica existente para registro e análise de dados.",
  whoIsImpacted:
    "Aproximadamente 450 mil pessoas serão beneficiadas, principalmente famílias de baixa renda que atualmente limitam deslocamentos aos fins de semana. Comerciantes locais também podem se beneficiar do aumento de circulação.",
  nextSteps:
    "Atualmente em discussão na Comissão de Transportes. Audiências públicas previstas para fevereiro de 2025, seguidas de votação. Se aprovado, implementação em abril de 2025."
};

// Engagement metrics
const engagementMetrics = {
  views: 1247,
  comments: 45,
  supports: 234,
};

// Reaction counts
const reactionCounts = {
  apoio: 234,
  "nao-apoio": 12,
  "nao-entendi": 67,
  impacta: 89,
};

// Related bills
const relatedBills = [
  {
    id: "pl-456-2024",
    title: "Expansão dos Corredores de Ônibus",
    code: "PL 456/2024",
    status: "Aprovado",
    tags: ["Transporte", "Infraestrutura"],
    location: "São Paulo",
  },
  {
    id: "pl-789-2025",
    title: "Subsídio para Estudantes no Transporte Público",
    code: "PL 789/2025",
    status: "Em votação",
    tags: ["Educação", "Transporte"],
    location: "São Paulo",
  },
  {
    id: "pl-234-2025",
    title: "Integração Metrô-Ônibus Gratuita",
    code: "PL 234/2025",
    status: "Em discussão",
    tags: ["Transporte", "Mobilidade"],
    location: "São Paulo",
  },
];

// Comments
const comments = [
  {
    id: "1",
    author: {
      name: "João Silva",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JoaoSilva",
    },
    text: "Excelente proposta! Trabalho aos sábados e gasto quase 20% do meu salário só com passagem de fim de semana. Isso vai fazer uma diferença enorme.",
    timestamp: "2025-01-20T14:30:00Z",
    upvotes: 45,
    replies: [
      {
        id: "1-1",
        author: {
          name: "Maria Santos",
          avatar:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=MariaSantos",
        },
        text: "Concordo completamente! Meus filhos vão poder visitar a avó com mais frequência.",
        timestamp: "2025-01-20T15:00:00Z",
        upvotes: 12,
      },
      {
        id: "1-2",
        author: {
          name: "Vereadora Ana Costa",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AnaCosta",
          isAuthor: true,
        },
        text: "Obrigada pelo apoio, João! É exatamente esse impacto que queremos alcançar.",
        timestamp: "2025-01-20T16:00:00Z",
        upvotes: 23,
      },
    ],
  },
  {
    id: "2",
    author: {
      name: "Carlos Mendes",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CarlosMendes",
    },
    text: "Tenho dúvidas sobre a sustentabilidade financeira. Os R$ 2,5 milhões mensais não vão pesar muito no orçamento?",
    timestamp: "2025-01-21T09:15:00Z",
    upvotes: 34,
    replies: [
      {
        id: "2-1",
        author: {
          name: "Vereadora Ana Costa",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AnaCosta",
          isAuthor: true,
        },
        text: "Ótima pergunta, Carlos! O valor representa 0,3% do orçamento de transporte. Além disso, esperamos que o aumento de usuários gere receita indireta através do aquecimento econômico nas áreas contempladas.",
        timestamp: "2025-01-21T10:00:00Z",
        upvotes: 28,
      },
    ],
  },
  {
    id: "3",
    author: {
      name: "Ana Rodrigues",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=AnaRodrigues",
    },
    text: "Seria possível incluir as linhas que vão para a Zona Leste também? Muitas famílias de lá precisam desse benefício.",
    timestamp: "2025-01-22T11:00:00Z",
    upvotes: 19,
  },
  {
    id: "4",
    author: {
      name: "Pedro Lima",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PedroLima",
    },
    text: "Apoio total! Porto Alegre implementou algo similar e os resultados foram muito positivos. Temos que avançar nessa direção.",
    timestamp: "2025-01-22T13:30:00Z",
    upvotes: 27,
  },
  {
    id: "5",
    author: {
      name: "Juliana Costa",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JulianaCosta",
    },
    text: "Como cidadã, acho fundamental que tenhamos acesso aos relatórios de avaliação do projeto. Será divulgado publicamente?",
    timestamp: "2025-01-23T08:00:00Z",
    upvotes: 15,
    replies: [
      {
        id: "5-1",
        author: {
          name: "Vereadora Ana Costa",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AnaCosta",
          isAuthor: true,
        },
        text: "Com certeza, Juliana! Transparência é fundamental. Todos os dados serão publicados mensalmente no portal da Câmara.",
        timestamp: "2025-01-23T09:00:00Z",
        upvotes: 18,
      },
    ],
  },
];

// Temporary video URL - replace with actual video source
const videoSrc = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4";

export default function LawDetailPage() {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6 lg:py-8">
        {/* Desktop: Inverted Layout (Content 60% LEFT, Video 40% RIGHT) */}
        {/* Mobile: Stack (Video TOP via VideoSidebar mobile section) */}
        <div className="grid gap-8 lg:grid-cols-[3fr_2fr] lg:gap-12">
          {/* Main Content (LEFT on desktop, BELOW video on mobile) */}
          <LawContent
            law={law}
            summary={summary}
            keyPoints={keyPoints}
            details={details}
            engagementMetrics={engagementMetrics}
            reactionCounts={reactionCounts}
            relatedBills={relatedBills}
            comments={comments}
            totalComments={engagementMetrics.comments}
          />

          {/* Video Sidebar (RIGHT on desktop, TOP on mobile) */}
          {/* Desktop: Sticky sidebar → PiP on scroll */}
          {/* Mobile: Regular video at top */}
          <VideoSidebar src={videoSrc} />
        </div>
      </div>
    </div>
  );
}
