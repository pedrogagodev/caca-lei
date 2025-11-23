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
    <div className="relative w-full">
      <div className="overflow-x-auto overflow-y-visible pb-2 scrollbar-none px-4">
        <div className="inline-flex gap-2">
        {themes.map((theme) => {
          const isActive = activeTheme === theme.id;

          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => handleThemeClick(theme.id)}
              className={`group shrink-0 whitespace-nowrap rounded-full border px-4 py-2.5 text-base font-medium transition-all duration-150 min-h-[44px] sm:min-h-auto sm:py-2 sm:text-sm ${
                isActive
                  ? "border-primary/20 bg-primary/10 text-primary shadow-sm"
                  : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                {theme.label}
                <span
                  className={`rounded-full border px-2 py-0.5 text-sm font-semibold tabular-nums transition-colors duration-150 sm:text-xs ${
                    isActive
                      ? "border-primary/30 text-primary"
                      : "border-border/50 text-muted-foreground group-hover:border-foreground/30"
                  }`}
                >
                  {theme.count}
                </span>
              </span>
            </button>
          );
        })}
        </div>
      </div>
    </div>
  );
}
