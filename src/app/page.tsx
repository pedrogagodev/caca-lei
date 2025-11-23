"use client";

import { useMemo, Suspense } from "react";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { Shield } from "@phosphor-icons/react";
import { Card } from "@/components/ui/card";
import { SidebarFilters } from "@/app/leis/_components/sidebar-filters";
import { MobileFilters } from "@/app/leis/_components/mobile-filters";
import { LawCard } from "@/app/leis/_components/law-card";
import { mockLaws } from "@/data/mock-laws";
import { themeMapping } from "@/constants/theme-mapping";

function HomeContent() {
  // URL state for theme filter
  const [activeTheme, setActiveTheme] = useQueryState("tema", {
    defaultValue: "all",
    clearOnDefault: true,
  });

  // Filter laws based on active theme
  const filteredLaws = useMemo(() => {
    if (activeTheme === "all") {
      return mockLaws;
    }

    const themesToMatch = themeMapping[activeTheme] || [];
    if (themesToMatch.length === 0) {
      return mockLaws;
    }

    return mockLaws.filter((law) =>
      law.topics.some((topic) => themesToMatch.includes(topic)),
    );
  }, [activeTheme]);

  return (
    <div className="relative min-h-screen">
      <div className="relative mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:grid-cols-[240px_1fr] lg:px-6">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden gap-6 sm:flex sm:flex-col">
          <SidebarFilters
            activeTheme={activeTheme}
            onThemeChange={setActiveTheme}
          />
        </aside>

        <section className="space-y-4">
          {/* Mobile Theme Pills - Only visible on small screens */}
          <div className="sm:hidden">
            <MobileFilters
              activeTheme={activeTheme}
              onThemeChange={setActiveTheme}
            />
          </div>

          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
                Lista de leis
              </p>
              <h1 className="text-3xl font-semibold sm:text-[34px]">
                Descubra, compare, reaja
              </h1>
            </div>
          </div>

          {/* Law List */}
          <div className="space-y-3">
            {filteredLaws.map((law) => (
              <Link key={law.id} href={`/leis/${law.id}`} className="block">
                <LawCard law={law} />
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {filteredLaws.length === 0 && (
            <Card className="flex flex-col items-center gap-3 px-6 py-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Shield
                  size={32}
                  weight="regular"
                  className="text-muted-foreground"
                />
              </div>
              <p className="text-lg font-semibold">Nenhuma lei encontrada</p>
              <p className="max-w-md text-sm text-muted-foreground">
                Ajuste os filtros acima ou refine sua busca para encontrar leis
                relevantes.
              </p>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <HomeContent />
    </Suspense>
  );
}
