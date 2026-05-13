import type { PropsWithChildren, ReactNode } from "react";

interface FormFieldProps extends PropsWithChildren {
  label: string;
  hint?: ReactNode;
  htmlFor?: string;
  labelId?: string;
}

export function FormField({
  label,
  hint,
  children,
  htmlFor,
  labelId,
}: FormFieldProps) {
  return (
    <label className="block space-y-2 text-sm" htmlFor={htmlFor}>
      <span className="font-medium text-foreground" id={labelId}>
        {label}
      </span>
      {children}
      {hint ? (
        <span className="text-xs text-muted-foreground">{hint}</span>
      ) : null}
    </label>
  );
}
