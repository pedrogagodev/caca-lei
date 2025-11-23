import { SlidersHorizontal } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface SortPillProps {
  label: string;
  desc: string;
  active?: boolean;
}

export function SortPill({ label, desc, active }: SortPillProps) {
  return (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      className="h-auto w-full justify-start gap-2 px-3 py-2"
    >
      <SlidersHorizontal
        size={16}
        weight="regular"
        className={active ? "opacity-100" : "opacity-60"}
      />
      <div className="text-left">
        <p className="text-sm font-semibold leading-tight">{label}</p>
        <p className="text-[11px] text-muted-foreground">{desc}</p>
      </div>
    </Button>
  );
}
