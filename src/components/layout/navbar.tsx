"use client";

import Link from "next/link";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Navbar() {
  return (
    <>
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary text-center text-lg font-black text-primary-foreground shadow-lg">
              <span className="leading-10">CL</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">CaçaLei</p>
              <p className="text-[12px] text-muted-foreground">80% institucional · 20% caos</p>
            </div>
          </Link>

          <div className="relative flex-1">
            <Input
              type="search"
              name="search"
              autoComplete="off"
              className="w-full rounded-full pr-10"
              placeholder="Busque por tema, número ou palavra-chave"
              aria-label="Buscar leis por tema, número ou palavra-chave"
            />
            <MagnifyingGlass
              size={16}
              weight="regular"
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <Button variant="outline">Entrar</Button>
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/40" aria-label="Perfil do usuário">
                <span className="sr-only">Avatar do usuário</span>
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
    </>
  );
}
