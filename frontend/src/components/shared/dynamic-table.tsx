import type { ReactNode } from "react";
import type { TableColumn } from "../../types";
import { EmptyState } from "./empty-state";
import {
  ResponsiveTable,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableHeaderRow,
  TableRow,
} from "../ui/table";

interface DynamicTableProps<T> {
  data: T[];
  columns?: TableColumn<T>[];
  emptyTitle?: string;
  emptyMessage?: string;
}

function formatValue(value: unknown): ReactNode {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "string" || typeof value === "number") return value;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function DynamicTable<T extends Record<string, unknown>>({
  data,
  columns,
  emptyTitle = "No data",
  emptyMessage = "There is no data to display yet.",
}: DynamicTableProps<T>) {
  if (!data.length) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />;
  }

  const resolvedColumns: TableColumn<T>[] =
    columns ??
    Object.keys(data[0]).map((key) => ({
      key,
      label: key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase()),
    }));

  return (
    <ResponsiveTable>
      <Table>
        <TableHead>
          <TableHeaderRow>
            {resolvedColumns.map((column) => (
              <TableHeaderCell key={String(column.key)}>
                {column.label ?? column.key}
              </TableHeaderCell>
            ))}
          </TableHeaderRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={`row-${rowIndex}`}>
              {resolvedColumns.map((column) => (
                <TableCell key={`${String(column.key)}-${rowIndex}`}>
                  {column.render
                    ? column.render(row[column.key as keyof T], row)
                    : formatValue(row[column.key as keyof T])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ResponsiveTable>
  );
}
