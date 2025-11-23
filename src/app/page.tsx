import Link from "next/link";
import {
  Shield,
  FileText,
} from "@phosphor-icons/react/dist/ssr";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getProposicoes } from "@/app/actions/proposicoes";
import { ProposicaoCard } from "@/app/_components/proposicao-card";
import { PaginationControls } from "@/app/_components/pagination-controls";

interface HomePageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const itemsPerPage = 5;

  // Fetch propositions from Câmara API
  const { data: proposicoes, total } = await getProposicoes(
    currentPage,
    itemsPerPage,
  );

  // Calculate total pages (estimate)
  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <div className="relative min-h-screen">
      <div className="relative mx-auto max-w-4xl px-4 py-6 lg:px-6">
        <section className="space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
                Câmara dos Deputados
              </p>
              <h1 className="text-3xl font-semibold sm:text-[34px]">
                Proposições Legislativas
              </h1>
            </div>
          </div>

          {/* Propositions list */}
          <div className="space-y-3">
            {proposicoes.length > 0 ? (
              proposicoes.map((proposicao) => (
                <ProposicaoCard key={proposicao.id} proposicao={proposicao} />
              ))
            ) : (
              <Card className="flex flex-col items-center gap-3 px-6 py-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <FileText
                    size={32}
                    weight="regular"
                    className="text-muted-foreground"
                  />
                </div>
                <p className="text-lg font-semibold">
                  Nenhuma proposição encontrada
                </p>
                <p className="max-w-md text-sm text-muted-foreground">
                  Não foi possível carregar as proposições no momento. Tente
                  novamente mais tarde.
                </p>
              </Card>
            )}
          </div>

          {/* Pagination */}
          {proposicoes.length > 0 && totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
            />
          )}
        </section>
      </div>
    </div>
  );
}
