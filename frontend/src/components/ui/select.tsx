import type { SelectHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  const resolvedLabel = props["aria-label"] ?? props.title ?? "Select";
  return (
    <select
      className={cn(
        "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        className,
      )}
      aria-label={resolvedLabel}
      title={props.title ?? resolvedLabel}
      {...props}
    />
  );
}
