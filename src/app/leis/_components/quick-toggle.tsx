import type { ElementType } from "react";

interface QuickToggleProps {
  label: string;
  icon: ElementType;
  active?: boolean;
}

export function QuickToggle({ label, icon: Icon, active }: QuickToggleProps) {
  return (
    <button
      className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition ${
        active
          ? "border-primary bg-primary/10 text-primary shadow-[0_10px_35px_-30px_rgba(0,0,0,0.8)]"
          : "border-border bg-muted/40 text-muted-foreground hover:border-primary/50 hover:text-foreground"
      }`}
    >
      <Icon size={16} weight={active ? "fill" : "regular"} />
      <span>{label}</span>
    </button>
  );
}
