interface StatusTileProps {
  label: string;
  hint: string;
  active?: boolean;
}

export function StatusTile({ label, hint, active }: StatusTileProps) {
  return (
    <button
      className={`group relative flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-3 text-left transition ${
        active
          ? "border-primary bg-primary/10 shadow-[0_18px_45px_-30px_rgba(0,0,0,0.8)]"
          : "border-border bg-muted/50 hover:border-primary/40"
      }`}
    >
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground">{hint}</p>
      </div>
      <span
        className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
          active ? "bg-primary text-primary-foreground" : "border border-border bg-background text-muted-foreground"
        }`}
      >
        {active ? "Ativo" : "Ativar"}
      </span>
    </button>
  );
}
