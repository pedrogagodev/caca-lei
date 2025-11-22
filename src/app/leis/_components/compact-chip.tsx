interface CompactChipProps {
  label: string;
  active?: boolean;
}

export function CompactChip({ label, active }: CompactChipProps) {
  return (
    <button
      className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition ${
        active ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted/60 text-muted-foreground"
      }`}
    >
      {label}
    </button>
  );
}
