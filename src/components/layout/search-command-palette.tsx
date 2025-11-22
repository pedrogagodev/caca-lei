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
        setOpen((prev: boolean) => !prev);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  const handleSelect = useCallback(
    (callback: () => void) => {
      setOpen(false);
      callback();
    },
    []
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
          placeholder="Busque por tema, número ou palavra-chave..."
          value={search}
          onValueChange={setSearch}
          className="border-none focus:ring-0"
        />
        <CommandList className="max-h-[400px]">
          <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
            Nenhum resultado encontrado.
          </CommandEmpty>

          {/* Recent Searches */}
          {search === "" && recentSearches.length > 0 && (
            <>
              <CommandGroup heading="Buscas Recentes">
                {recentSearches.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() =>
                      handleSelect(() => {
                        setSearch(item.query);
                      })
                    }
                    className="group cursor-pointer gap-2 transition-colors duration-150"
                  >
                    <Clock
                      size={16}
                      weight="regular"
                      className="shrink-0 text-muted-foreground transition-colors duration-150 group-hover:text-primary"
                    />
                    <div className="flex flex-1 items-center justify-between">
                      <span className="transition-colors duration-150 group-hover:text-primary">
                        {item.query}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.timestamp}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {/* Trending Searches */}
          {search === "" && trendingSearches.length > 0 && (
            <>
              <CommandGroup heading="Em Alta">
                {trendingSearches.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() =>
                      handleSelect(() => {
                        setSearch(item.query);
                      })
                    }
                    className="group cursor-pointer gap-2 transition-colors duration-150"
                  >
                    <TrendUp
                      size={16}
                      weight="regular"
                      className="shrink-0 text-muted-foreground transition-colors duration-150 group-hover:text-primary"
                    />
                    <div className="flex flex-1 items-center justify-between">
                      <span className="transition-colors duration-150 group-hover:text-primary">
                        {item.query}
                      </span>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground transition-colors duration-150 group-hover:bg-primary/10">
                        {item.count}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {/* Law Results */}
          {filteredLaws.length > 0 && (
            <CommandGroup heading="Leis">
              {filteredLaws.map((law) => (
                <CommandItem
                  key={law.id}
                  onSelect={() =>
                    handleSelect(() => {
                      router.push(`/leis/${law.id}`);
                    })
                  }
                  className="group cursor-pointer gap-3 py-3 transition-all duration-150"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-all duration-150 group-hover:bg-primary/20 group-hover:scale-105">
                    <BookOpen
                      size={18}
                      weight="regular"
                      className="text-primary"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground transition-colors duration-150 group-hover:text-primary">
                        {law.number}
                      </span>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {law.category}
                      </span>
                    </div>
                    <span className="text-sm font-medium transition-colors duration-150 group-hover:text-primary">
                      {law.title}
                    </span>
                  </div>
                  <MagnifyingGlass
                    size={16}
                    weight="regular"
                    className="shrink-0 text-muted-foreground opacity-0 transition-all duration-150 group-hover:opacity-100"
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>

        {/* Footer with keyboard shortcuts */}
        <div className="border-t bg-muted/30 px-4 py-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <kbd className="rounded bg-background px-1.5 py-0.5 font-mono font-semibold border border-border/60">
                  ↑
                </kbd>
                <kbd className="rounded bg-background px-1.5 py-0.5 font-mono font-semibold border border-border/60">
                  ↓
                </kbd>
                <span className="ml-1">navegar</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="rounded bg-background px-1.5 py-0.5 font-mono font-semibold border border-border/60">
                  Enter
                </kbd>
                <span className="ml-1">selecionar</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="rounded bg-background px-1.5 py-0.5 font-mono font-semibold border border-border/60">
                Esc
              </kbd>
              <span className="ml-1">fechar</span>
            </div>
          </div>
        </div>
      </CommandDialog>
    </>
  );
}
