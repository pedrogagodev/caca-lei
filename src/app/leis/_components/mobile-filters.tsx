"use client";

import { useState } from "react";
import { themes } from "@/constants/theme-data";

interface MobileThemeSidebarProps {
  defaultTheme?: string;
  onThemeChange?: (theme: string) => void;
  activeTheme?: string;
}

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
              {theme.label}
            </button>
          );
        })}
        </div>
      </div>
    </div>
  );
}
