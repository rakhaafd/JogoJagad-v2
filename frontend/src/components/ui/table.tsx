import type { PropsWithChildren } from "react";

export function ResponsiveTable({ children }: PropsWithChildren) {
  return <div className="overflow-hidden rounded-2xl border border-border">{children}</div>;
}

export function Table({ children }: PropsWithChildren) {
  return <table className="min-w-full divide-y divide-border text-sm">{children}</table>;
}

export function TableHead({ children }: PropsWithChildren) {
  return <thead className="bg-muted/60 text-left text-muted-foreground">{children}</thead>;
}

export function TableHeaderRow({ children }: PropsWithChildren) {
  return <tr>{children}</tr>;
}

export function TableBody({ children }: PropsWithChildren) {
  return <tbody className="divide-y divide-border bg-card">{children}</tbody>;
}

export function TableRow({ children }: PropsWithChildren) {
  return <tr className="hover:bg-muted/50">{children}</tr>;
}

export function TableCell({ children }: PropsWithChildren) {
  return <td className="px-4 py-3">{children}</td>;
}

export function TableHeaderCell({ children }: PropsWithChildren) {
  return <th className="px-4 py-3 font-semibold">{children}</th>;
}
