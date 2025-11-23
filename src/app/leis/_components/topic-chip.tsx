interface TopicChipProps {
  label: string;
  count: number;
  heat: number;
  active?: boolean;
}

export function TopicChip({ label, count, heat, active }: TopicChipProps) {
  return (
    <button
      className={`flex w-full flex-col rounded-xl border px-3 py-2 text-left transition ${
        active
          ? "border-secondary bg-secondary/10"
          : "border-border bg-muted/40 hover:border-secondary/50"
      }`}
    >
      <div className="flex items-center justify-between text-sm font-semibold">
        <span>{label}</span>
        <span className="text-xs text-muted-foreground">{count}</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-background/60">
        <div
          className="h-1.5 bg-secondary"
          style={{ width: `${Math.min(100, heat)}%` }}
        />
      </div>
    </button>
  );
}
