"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { themes } from "@/constants/theme-data";

interface ThemeSidebarProps {
  defaultTheme?: string;
  onThemeChange?: (theme: string) => void;
  activeTheme?: string;
}

export function SidebarFilters({
  defaultTheme = "all",
  onThemeChange,
  activeTheme: controlledTheme,
}: ThemeSidebarProps) {
  const [localTheme, setLocalTheme] = useState(defaultTheme);

  // Use controlled or uncontrolled state
  const activeTheme = controlledTheme || localTheme;

  const handleThemeClick = (themeId: string) => {
    if (!controlledTheme) {
      setLocalTheme(themeId);
    }
    onThemeChange?.(themeId);
  };

  return (
    <Card className="overflow-hidden p-0">
      <nav className="flex flex-col p-2">
        {themes.map((theme) => {
          const isActive = activeTheme === theme.id;

          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => handleThemeClick(theme.id)}
              className={`group relative flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              {/* Linear-style left accent */}
              {isActive && (
                <span className="absolute left-0 top-[20%] h-[60%] w-[2px] rounded-r-sm bg-primary" />
              )}

              {/* Label */}
              <span className="flex-1 text-left">{theme.label}</span>

              {/* Count badge */}
              <span
                className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-semibold tabular-nums transition-colors duration-150 ${
                  isActive
                    ? "border-primary/30 text-primary"
                    : "border-border/50 text-muted-foreground group-hover:border-foreground/30 group-hover:text-foreground"
                }`}
              >
                {theme.count}
              </span>
            </button>
          );
        })}
      </nav>
    </Card>
  );
}
