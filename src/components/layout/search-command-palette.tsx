"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlass,
  BookOpen,
} from "@phosphor-icons/react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { searchBills } from "@/app/actions/bills";
import type { Bill } from "@/types/database.types";

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
  const [results, setResults] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  // Debounced search effect
  useEffect(() => {
    if (!search || search.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const timeoutId = setTimeout(async () => {
      try {
        const bills = await searchBills(search);
        setResults(bills);
      } catch (error) {
        console.error("Error searching bills:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleSelect = useCallback(
    (callback: () => void) => {
      setOpen(false);
      callback();
    },
    [setOpen],
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

      <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
        <CommandInput
          placeholder="Busque por tema, número ou palavra-chave…"
          value={search}
          onValueChange={setSearch}
          className="h-14 border-none text-base focus:ring-0"
        />
        <CommandList className="max-h-[400px] scroll-py-2">
          {/* Show different messages based on state */}
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
                  {search.trim().length < 2
                    ? "Comece a digitar para buscar"
                    : isLoading
                      ? "Buscando..."
                      : "Nenhum resultado encontrado"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {search.trim().length < 2
                    ? "Digite pelo menos 2 caracteres para buscar leis"
                    : isLoading
                      ? "Aguarde enquanto buscamos as leis"
                      : "Tente buscar por outro termo ou palavra-chave"}
                </p>
              </div>
              {search && search.trim().length >= 2 && !isLoading && (
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

          {/* Search Results */}
          {!isLoading && results.length > 0 && (
            <CommandGroup heading="Resultados">
              {results.map((bill, index) => (
                <CommandItem
                  key={bill.id}
                  value={String(bill.id)}
                  onSelect={() =>
                    handleSelect(() => {
                      router.push(`/leis/${bill.id}`);
                    })
                  }
                  style={{
                    animationDelay: `${index * 30}ms`,
                    animationFillMode: "backwards",
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
                      {bill.code}
                    </span>
                    <span className="text-sm font-medium leading-tight tracking-tight text-foreground transition-colors duration-150">
                      {bill.title}
                    </span>
                    {bill.tags && bill.tags.length > 0 && (
                      <span className="mt-0.5 w-fit rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground transition-all duration-150 group-hover:bg-primary/10 group-hover:text-primary">
                        {bill.tags[0]}
                      </span>
                    )}
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
