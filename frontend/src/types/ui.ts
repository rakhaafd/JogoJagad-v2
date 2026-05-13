import type { ReactNode } from "react";

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "textarea"
  | "select"
  | "file"
  | "date";

export interface FieldOption {
  label: string;
  value: string | number;
}

export interface FormFieldConfig {
  name: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
  hint?: string;
  options?: FieldOption[];
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  accept?: string;
}

export interface TableColumn<T> {
  key: keyof T | string;
  label?: string;
  align?: "left" | "right" | "center";
  render?: (value: unknown, row: T) => ReactNode;
}
