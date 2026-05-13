import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import { DynamicTable } from "../../components/shared/dynamic-table";
import type { ActionReport, TableColumn } from "../../types";
import { Skeleton } from "../../components/ui/skeleton";
import { EmptyState } from "../../components/shared/empty-state";

interface VerificationTableProps {
  actions: ActionReport[];
  loading?: boolean;
  error?: string | null;
}

export function VerificationTable({
  actions,
  loading,
  error,
}: VerificationTableProps) {
  const columns: TableColumn<ActionReport>[] = [
    {
      key: "user",
      label: "User",
      render: (_, row) => row.user?.name ?? "-",
    },
    { key: "title", label: "Action" },
    { key: "action_type", label: "Type" },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <Badge
          tone={
            value === "verified"
              ? "safe"
              : value === "pending"
                ? "warning"
                : "default"
          }
        >
          {String(value)}
        </Badge>
      ),
    },
    {
      key: "verification",
      label: "Points",
      render: (_, row) => row.verification?.points_awarded ?? "-",
    },
  ];

  return (
    <Card className="space-y-4">
      <h3 className="text-lg font-semibold">Preventive Action Verification</h3>
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : error ? (
        <EmptyState title="Unable to load actions" message={error} />
      ) : (
        <DynamicTable
          data={actions}
          columns={columns}
          emptyTitle="No actions"
          emptyMessage="Incoming action reports will appear here for verification."
        />
      )}
    </Card>
  );
}
