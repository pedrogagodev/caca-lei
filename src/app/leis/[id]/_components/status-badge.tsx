import { Badge } from "@/components/ui/badge";
import {
  Circle,
  ClockCounterClockwise,
  CheckCircle,
  XCircle,
} from "@phosphor-icons/react/dist/ssr";

type LawStatus = "Em discussão" | "Em votação" | "Aprovada" | "Arquivada";

interface StatusBadgeProps {
  status: string;
}

// Status configuration matching the listing page
const statusConfig: Record<
  LawStatus,
  {
    variant: "default" | "secondary" | "outline" | "destructive";
    icon: typeof Circle;
    badgeClass: string;
  }
> = {
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

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status as LawStatus];

  if (!config) {
    return (
      <Badge variant="outline" className="gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium">
        {status}
      </Badge>
    );
  }

  const StatusIcon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={`gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium ${config.badgeClass}`}
    >
      <StatusIcon size={12} weight="fill" />
      <span>{status}</span>
    </Badge>
  );
}
