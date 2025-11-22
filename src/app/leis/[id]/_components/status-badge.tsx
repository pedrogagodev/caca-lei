import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant =
    status === "Em discussão"
      ? "default"
      : status === "Em votação"
        ? "secondary"
        : "outline";

  return (
    <Badge variant={variant} className="uppercase">
      {status}
    </Badge>
  );
}
