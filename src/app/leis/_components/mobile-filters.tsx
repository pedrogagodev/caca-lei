"use client";

import { useState } from "react";

interface MobileThemeSidebarProps {
  defaultTheme?: string;
  onThemeChange?: (theme: string) => void;
  activeTheme?: string;
}

const themes = [
  { id: "all", label: "Todas", count: 247 },
  { id: "transport", label: "Transporte", count: 54 },
  { id: "health", label: "Saúde", count: 72 },
  { id: "education", label: "Educação", count: 48 },
  { id: "security", label: "Segurança", count: 31 },
  { id: "privacy", label: "Dados & Privacidade", count: 28 },
  { id: "environment", label: "Meio Ambiente", count: 14 },
];

export function MobileFilters({
  defaultTheme = "all",
  onThemeChange,
  activeTheme: controlledTheme,
}: MobileThemeSidebarProps) {
  const [localTheme, setLocalTheme] = useState(defaultTheme);

  const activeTheme = controlledTheme || localTheme;

  const handleThemeClick = (themeId: string) => {
    if (!controlledTheme) {
      setLocalTheme(themeId);
    }
    onThemeChange?.(themeId);
  };

  return (
    <div className="overflow-x-auto pb-2 scrollbar-none">
      <div className="flex gap-2">
        {themes.map((theme) => {
          const isActive = activeTheme === theme.id;

          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => handleThemeClick(theme.id)}
              className={`group shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "border-primary/20 bg-primary/10 text-primary shadow-sm"
                  : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                {theme.label}
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums transition-colors duration-150 ${
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground group-hover:bg-muted-foreground/10"
                  }`}
                >
                  {theme.count}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <style jsx>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
