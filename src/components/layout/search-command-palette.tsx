"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlass,
  BookOpen,
  Clock,
  TrendUp,
} from "@phosphor-icons/react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

// Mock data - replace with real data from your API/database
const mockLaws = [
  {
    id: "1",
    number: "Lei 13.709/2018",
    title: "Lei Geral de Proteção de Dados (LGPD)",
    category: "Privacidade",
  },
  {
    id: "2",
    number: "Lei 12.965/2014",
    title: "Marco Civil da Internet",
    category: "Internet",
  },
  {
    id: "3",
    number: "Lei 8.078/1990",
    title: "Código de Defesa do Consumidor",
    category: "Consumidor",
  },
  {
    id: "4",
    number: "Lei 9.610/1998",
    title: "Lei de Direitos Autorais",
    category: "Propriedade Intelectual",
  },
];

const recentSearches = [
  { id: "r1", query: "LGPD", timestamp: "2 horas atrás" },
  { id: "r2", query: "Marco Civil", timestamp: "1 dia atrás" },
];

const trendingSearches = [
  { id: "t1", query: "reforma tributária", count: 245 },
  { id: "t2", query: "direito digital", count: 189 },
];

interface SearchCommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SearchCommandPalette({
  open: controlledOpen,
  onOpenChange,
}: SearchCommandPaletteProps = {}) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Use controlled or uncontrolled state
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange! : setInternalOpen;

  // Handle ⌘K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen, open]);

  const handleSelect = useCallback(
    (callback: () => void) => {
      setOpen(false);
      callback();
    },
    [setOpen]
  );

  const filteredLaws = mockLaws.filter(
    (law) =>
      search === "" ||
      law.title.toLowerCase().includes(search.toLowerCase()) ||
      law.number.toLowerCase().includes(search.toLowerCase()) ||
      law.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Hidden trigger for keyboard shortcut */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="sr-only"
        aria-label="Abrir busca"
      />

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Busque por tema, número ou palavra-chave…"
          value={search}
          onValueChange={setSearch}
          className="h-14 border-none text-base focus:ring-0"
        />
        <CommandList className="max-h-[400px] scroll-py-2">
          <CommandEmpty className="py-12 text-center">
            <div className="mx-auto flex max-w-xs flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
                <MagnifyingGlass
                  size={24}
                  weight="regular"
                  className="text-muted-foreground/60"
                />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  Nenhum resultado encontrado
                </p>
                <p className="text-xs text-muted-foreground">
                  Tente buscar por outro termo ou palavra-chave
                </p>
              </div>
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-2 text-xs text-primary transition-colors hover:text-primary/80 hover:underline"
                >
                  Limpar busca
                </button>
              )}
            </div>
          </CommandEmpty>

          {/* Recent Searches */}
          {search === "" && recentSearches.length > 0 && (
            <>
              <CommandGroup heading="Buscas Recentes">
                {recentSearches.map((item, index) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() =>
                      handleSelect(() => {
                        setSearch(item.query);
                      })
                    }
                    style={{
                      animationDelay: `${index * 30}ms`,
                      animationFillMode: 'backwards'
                    }}
                    className="group cursor-pointer gap-2.5 rounded-lg px-3 py-2.5 transition-all duration-200 data-[selected=true]:bg-accent/60 hover:bg-accent/40 animate-in fade-in slide-in-from-bottom-1"
                  >
                    <Clock
                      size={16}
                      weight="regular"
                      className="shrink-0 text-muted-foreground/60 transition-all duration-200 group-hover:scale-110 group-hover:text-primary group-data-[selected=true]:text-primary"
                    />
                    <div className="flex flex-1 items-center justify-between">
                      <span className="text-sm font-medium transition-colors duration-200 group-hover:text-foreground">
                        {item.query}
                      </span>
                      <span className="text-[11px] text-foreground/50 opacity-60 transition-opacity duration-200 group-hover:opacity-100">
                        {item.timestamp}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator className="my-2 bg-gradient-to-r from-transparent via-border to-transparent" />
            </>
          )}

          {/* Trending Searches */}
          {search === "" && trendingSearches.length > 0 && (
            <>
              <CommandGroup heading="Em Alta">
                {trendingSearches.map((item, index) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() =>
                      handleSelect(() => {
                        setSearch(item.query);
                      })
                    }
                    style={{
                      animationDelay: `${index * 30}ms`,
                      animationFillMode: 'backwards'
                    }}
                    className="group cursor-pointer gap-2.5 rounded-lg px-3 py-2.5 transition-all duration-200 data-[selected=true]:bg-accent/60 hover:bg-accent/40 animate-in fade-in slide-in-from-bottom-1"
                  >
                    <TrendUp
                      size={16}
                      weight="regular"
                      className="shrink-0 text-muted-foreground/60 transition-all duration-200 group-hover:scale-110 group-hover:text-amber-500 group-data-[selected=true]:text-amber-500"
                    />
                    <div className="flex flex-1 items-center justify-between">
                      <span className="text-sm font-medium transition-colors duration-200 group-hover:text-foreground">
                        {item.query}
                      </span>
                      <span className="min-w-[2rem] rounded-full bg-muted px-2 py-0.5 text-center text-xs font-medium tabular-nums text-muted-foreground transition-all duration-200 group-hover:scale-105 group-hover:bg-primary/10 group-hover:text-primary">
                        {item.count}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator className="my-2 bg-gradient-to-r from-transparent via-border to-transparent" />
            </>
          )}

          {/* Law Results */}
          {filteredLaws.length > 0 && (
            <CommandGroup heading="Leis">
              {filteredLaws.map((law, index) => (
                <CommandItem
                  key={law.id}
                  onSelect={() =>
                    handleSelect(() => {
                      router.push(`/leis/${law.id}`);
                    })
                  }
                  style={{
                    animationDelay: `${index * 30}ms`,
                    animationFillMode: 'backwards'
                  }}
                  className="group cursor-pointer gap-3 rounded-lg px-3 py-3 transition-all duration-200 data-[selected=true]:bg-accent/60 hover:bg-accent/40 animate-in fade-in slide-in-from-bottom-1"
                >
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-all duration-200 group-hover:scale-110 group-hover:bg-primary/20 group-hover:shadow-sm group-hover:shadow-primary/20">
                    <BookOpen
                      size={20}
                      weight="regular"
                      className="text-primary transition-transform duration-200 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 rounded-lg ring-1 ring-primary/0 transition-all duration-200 group-hover:ring-primary/30" />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider tabular-nums text-muted-foreground transition-colors duration-150 group-hover:text-primary">
                      {law.number}
                    </span>
                    <span className="text-sm font-medium leading-tight tracking-tight text-foreground transition-colors duration-150">
                      {law.title}
                    </span>
                    <span className="mt-0.5 w-fit rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground transition-all duration-150 group-hover:bg-primary/10 group-hover:text-primary">
                      {law.category}
                    </span>
                  </div>
                  <MagnifyingGlass
                    size={16}
                    weight="regular"
                    className="shrink-0 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>

        {/* Footer with keyboard shortcuts */}
        <div className="border-t border-border/60 bg-gradient-to-b from-muted/20 to-muted/40 px-4 py-3 backdrop-blur-sm">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  <kbd className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded border border-border/60 bg-background px-1 font-mono text-[10px] font-semibold shadow-sm transition-all duration-150 hover:border-foreground/20 hover:shadow">
                    ↑
                  </kbd>
                  <kbd className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded border border-border/60 bg-background px-1 font-mono text-[10px] font-semibold shadow-sm transition-all duration-150 hover:border-foreground/20 hover:shadow">
                    ↓
                  </kbd>
                </div>
                <span className="ml-0.5 font-medium">navegar</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded border border-border/60 bg-background px-1.5 font-mono text-[10px] font-semibold shadow-sm transition-all duration-150 hover:border-foreground/20 hover:shadow">
                  ↵
                </kbd>
                <span className="font-medium">selecionar</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded border border-border/60 bg-background px-1.5 font-mono text-[10px] font-semibold shadow-sm transition-all duration-150 hover:border-foreground/20 hover:shadow">
                Esc
              </kbd>
              <span className="font-medium">fechar</span>
            </div>
          </div>
        </div>
      </CommandDialog>
    </>
  );
}
