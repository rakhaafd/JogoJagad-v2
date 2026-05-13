import type { FormEvent, ReactNode } from "react";
import type { FormFieldConfig } from "../../types";
import { FormField } from "../ui/form-field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { cn } from "../../utils/cn";

interface DynamicFormProps<TValues extends Record<string, unknown>> {
  fields: FormFieldConfig[];
  values: TValues;
  onChange: (name: keyof TValues, value: unknown) => void;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  errors?: Record<string, string[]>;
  disabled?: boolean;
  actions?: ReactNode;
}

function renderField(
  field: FormFieldConfig,
  value: unknown,
  onChange: (value: unknown) => void,
  disabled?: boolean,
) {
  const fieldId = `field-${field.name}`;
  const labelId = `label-${field.name}`;
  if (field.type === "textarea") {
    return (
      <Textarea
        id={fieldId}
        name={field.name}
        placeholder={field.placeholder}
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled || field.disabled}
        aria-label={field.label}
        aria-labelledby={labelId}
        title={field.label}
      />
    );
  }

  if (field.type === "select") {
    return (
      <select
        id={fieldId}
        name={field.name}
        value={value ? String(value) : ""}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled || field.disabled}
        aria-label={field.label}
        aria-labelledby={labelId}
        title={field.label}
        className={cn(
          "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        )}
      >
        <option value="">Select {field.label}</option>
        {field.options?.map((option) => (
          <option key={`${field.name}-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <Input
      id={fieldId}
      name={field.name}
      type={field.type ?? "text"}
      placeholder={field.placeholder}
      value={
        field.type === "file"
          ? undefined
          : typeof value === "string" || typeof value === "number"
            ? String(value)
            : ""
      }
      onChange={(event) => {
        if (field.type === "file") {
          onChange(event.target.files?.[0] ?? null);
        } else if (field.type === "number") {
          onChange(event.target.value ? Number(event.target.value) : "");
        } else {
          onChange(event.target.value);
        }
      }}
      disabled={disabled || field.disabled}
      autoComplete={field.autoComplete}
      accept={field.accept}
      aria-label={field.label}
      aria-labelledby={labelId}
      title={field.label}
    />
  );
}

export function DynamicForm<TValues extends Record<string, unknown>>({
  fields,
  values,
  onChange,
  onSubmit,
  errors,
  disabled,
  actions,
}: DynamicFormProps<TValues>) {
  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      {fields.map((field) => (
        <FormField
          key={field.name}
          label={field.label}
          htmlFor={`field-${field.name}`}
          labelId={`label-${field.name}`}
          hint={
            errors?.[field.name]?.length
              ? errors[field.name].join(" ")
              : field.hint
          }
        >
          {renderField(
            field,
            values[field.name],
            (value) => onChange(field.name, value),
            disabled,
          )}
        </FormField>
      ))}
      {actions}
    </form>
  );
}
