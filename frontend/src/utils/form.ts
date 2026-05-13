import type { FormFieldConfig } from "../types";

function toTitleCase(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function buildFormFields(
  payload: Record<string, unknown>,
  overrides: Record<string, Partial<FormFieldConfig>> = {},
) {
  return Object.keys(payload).map<FormFieldConfig>((key) => {
    const override = overrides[key] ?? {};
    const sampleValue = payload[key];
    let type: FormFieldConfig["type"] = "text";

    if (typeof sampleValue === "number") type = "number";
    if (typeof sampleValue === "string" && key.toLowerCase().includes("email"))
      type = "email";
    if (key.toLowerCase().includes("password")) type = "password";

    return {
      name: key,
      label: toTitleCase(key),
      type,
      placeholder: override.placeholder ?? `Enter ${toTitleCase(key)}`,
      ...override,
    };
  });
}
