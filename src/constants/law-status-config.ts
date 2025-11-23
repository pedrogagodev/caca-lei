/**
 * Law Status Configuration
 * Canonical configuration for law status badges and styling
 */

import {
  Circle,
  ClockCounterClockwise,
  CheckCircle,
  XCircle,
} from "@phosphor-icons/react";
import type { LawStatus } from "@/types/law.types";

interface StatusConfig {
  variant: "default" | "secondary" | "outline" | "destructive";
  icon: React.ComponentType<{ size?: number; weight?: "regular" | "fill" }>;
  badgeClass: string;
}

export const lawStatusConfig: Record<LawStatus, StatusConfig> = {
  "Em discussão": {
    variant: "default",
    icon: Circle,
    badgeClass:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400",
  },
  "Em votação": {
    variant: "secondary",
    icon: ClockCounterClockwise,
    badgeClass:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400",
  },
  Aprovada: {
    variant: "outline",
    icon: CheckCircle,
    badgeClass:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400",
  },
  Arquivada: {
    variant: "destructive",
    icon: XCircle,
    badgeClass:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400",
  },
};
