import * as React from "react";

import { cn } from "@/lib/utils";

type LawListCardProps = React.ComponentPropsWithRef<"article"> & {
  leading?: React.ReactNode;
  leadingClassName?: string;
  actions?: React.ReactNode;
  actionsClassName?: string;
  contentClassName?: string;
};

const LawListCard = React.forwardRef<
  React.ElementRef<"article">,
  LawListCardProps
>(
  (
    {
      className,
      leading,
      leadingClassName,
      actions,
      actionsClassName,
      contentClassName,
      children,
      ...props
    },
    ref,
  ) => {
    const hasLeading = Boolean(leading);
    const columns = hasLeading
      ? "grid-cols-[auto_minmax(0,1fr)_auto]"
      : "grid-cols-[minmax(0,1fr)_auto]";
    const actionsColumn = hasLeading ? "col-start-3" : "col-start-2";

    return (
      <article
        ref={ref}
        className={cn(
          "group relative isolate grid items-start gap-6 overflow-hidden rounded-2xl border border-foreground/10 bg-card p-8 text-card-foreground transition-all duration-200 ease-out md:p-6",
          "hover:-translate-y-[2px] hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2",
          columns,
          className,
        )}
        {...props}
      >
        {leading ? (
          <div
            data-slot="law-card-leading"
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg border border-foreground/10 bg-muted/30 text-[10px] font-medium uppercase tracking-wide text-muted-foreground transition-transform duration-150 group-hover:-translate-y-[1px]",
              leadingClassName,
            )}
          >
            {leading}
          </div>
        ) : null}

        <div
          data-slot="law-card-content"
          className={cn("min-w-0 space-y-4", contentClassName)}
        >
          {children}
        </div>

        {actions ? (
          <div
            data-slot="law-card-actions"
            className={cn(
              actionsColumn,
              "row-span-full row-start-1 flex items-start gap-1.5 self-start justify-self-end text-muted-foreground transition-transform duration-150 group-hover:-translate-y-[1px]",
              actionsClassName,
            )}
          >
            {actions}
          </div>
        ) : null}
      </article>
    );
  },
);

LawListCard.displayName = "LawListCard";

export { LawListCard };
