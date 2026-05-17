import type { PropsWithChildren } from "react";
import { cn } from "../../utils/cn";

interface BadgeProps extends PropsWithChildren {
  tone?: "default" | "safe" | "warning" | "danger";
  className?: string;
  variant?: "solid" | "outline";
}

const toneClass: Record<NonNullable<BadgeProps["tone"]>, string> = {
  default: "bg-muted text-muted-foreground",
  safe: "bg-safe/15 text-safe",
  warning: "bg-warning/20 text-amber-700 dark:text-amber-300",
  danger: "bg-danger/15 text-danger",
};

export function Badge({ children, tone = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
