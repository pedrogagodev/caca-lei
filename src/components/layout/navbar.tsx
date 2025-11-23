"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  MagnifyingGlass,
  List,
  X,
  User,
  Gear,
  SignOut,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchCommandPalette } from "@/components/layout/search-command-palette";
import Logo from "@/assets/logo-lei.png";
import { useAuth } from "@/contexts/auth-context";
import { signOut } from "@/app/actions/auth";
import { toast } from "sonner";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Add background blur on scroll for depth
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      // Note: signOut() redirects, so code below won't execute on success
      toast.success("Você saiu da sua conta");
    } catch (error) {
      // Only catch actual errors, not NEXT_REDIRECT
      if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
        // This is expected behavior - redirect is working
        return;
      }
      console.error("Error signing out:", error);
      toast.error("Erro ao sair");
      setIsSigningOut(false);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.user_metadata?.full_name) return "U";
    const names = user.user_metadata.full_name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to content
      </a>

      <header
        className={`sticky top-0 z-30 border-b transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md"
            : "bg-background/85 backdrop-blur-md"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 lg:px-6">
          {/* Logo with luxury hover effect */}
          <Link
            href="/"
            className="group flex cursor-pointer items-center gap-2 rounded-lg transition-all duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-background transition-all duration-300 ">
              <Image
                src={Logo}
                alt="Logo CacaLei"
                fill
                sizes="40px"
                className="object-cover transition duration-300 group-hover:scale-[1.04]"
                priority
              />
              <span className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-white/10 mix-blend-soft-light" />
            </div>
          </Link>

          {/* Search Trigger Button (Command Palette) */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="group flex min-w-0 cursor-pointer items-center gap-2 rounded-full border bg-muted/50 px-4 py-2 text-sm text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:ml-6 md:max-w-md"
          >
            <MagnifyingGlass
              size={16}
              weight="regular"
              className="shrink-0 transition-transform duration-200 group-hover:scale-110"
              aria-hidden="true"
            />
            <span className="truncate">Buscar leis</span>
            <kbd className="ml-auto hidden shrink-0 rounded border bg-background px-2 py-0.5 text-xs font-semibold text-muted-foreground transition-colors duration-200 group-hover:border-primary/50 group-hover:text-foreground sm:inline-block">
              ⌘K
            </kbd>
          </button>

          {/* Desktop: User Actions */}
          <div className="ml-auto hidden items-center gap-2 md:flex">
            {!loading && !user && (
              <>
                <Button
                  variant="outline"
                  className="cursor-pointer transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
                  asChild
                >
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button
                  variant="default"
                  className="cursor-pointer transition-all duration-200"
                  asChild
                >
                  <Link href="/register">Criar conta</Link>
                </Button>
              </>
            )}

            {!loading && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="group relative cursor-pointer rounded-full transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback
                        className="bg-primary/40 transition-colors duration-200 group-hover:bg-primary/60"
                        aria-label="Perfil do usuário"
                      >
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.user_metadata?.full_name || "Usuário"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer gap-2">
                    <User size={16} weight="regular" />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer gap-2">
                    <Gear size={16} weight="regular" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                  >
                    <SignOut size={16} weight="regular" />
                    {isSigningOut ? "Saindo..." : "Sair"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile: Hamburger Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer transition-all duration-200 hover:bg-muted md:hidden"
                aria-label="Menu de navegação"
              >
                {isMobileMenuOpen ? (
                  <X
                    size={24}
                    weight="regular"
                    className="transition-transform duration-200"
                  />
                ) : (
                  <List
                    size={24}
                    weight="regular"
                    className="transition-transform duration-200"
                  />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>

              {/* Mobile Navigation Links */}
              <div className="mt-6 flex flex-col gap-1">
                {navLinks.map((link, index) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`group relative cursor-pointer rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                        isActive ? "bg-muted text-primary" : "text-foreground"
                      }`}
                      style={{
                        animation: isMobileMenuOpen
                          ? `slideIn 0.3s ease-out ${index * 0.05}s both`
                          : undefined,
                      }}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              {/* Mobile: User Actions */}
              <div className="mt-6 flex flex-col gap-3 border-t pt-6">
                {!loading && !user && (
                  <>
                    <Button
                      variant="outline"
                      className="w-full cursor-pointer justify-start"
                      asChild
                    >
                      <Link
                        href="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Entrar
                      </Link>
                    </Button>
                    <Button
                      variant="default"
                      className="w-full cursor-pointer justify-start"
                      asChild
                    >
                      <Link
                        href="/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Criar conta
                      </Link>
                    </Button>
                  </>
                )}

                {!loading && user && (
                  <>
                    <div className="mb-2 px-2">
                      <p className="text-sm font-medium">
                        {user.user_metadata?.full_name || "Usuário"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full cursor-pointer justify-start gap-2 transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
                    >
                      <User size={16} weight="regular" />
                      Perfil
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full cursor-pointer justify-start gap-2 transition-all duration-200 hover:bg-muted"
                    >
                      <Gear size={16} weight="regular" />
                      Configurações
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full cursor-pointer justify-start gap-2 transition-all duration-200 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                    >
                      <SignOut size={16} weight="regular" />
                      {isSigningOut ? "Saindo..." : "Sair"}
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </header>

      {/* Command Palette for Search */}
      <SearchCommandPalette
        open={isSearchOpen}
        onOpenChange={setIsSearchOpen}
      />

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}
