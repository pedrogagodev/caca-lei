import { Badge } from "@/components/ui/badge";
import { lawStatusConfig } from "@/constants/law-status-config";
import type { LawStatus } from "@/types/law.types";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = lawStatusConfig[status as LawStatus];

  if (!config) {
    return (
      <Badge
        variant="outline"
        className="gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium"
      >
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
