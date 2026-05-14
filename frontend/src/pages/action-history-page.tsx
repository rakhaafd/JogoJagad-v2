import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { PageHeader } from "../components/shared/page-header";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { EmptyState } from "../components/shared/empty-state";
import { Skeleton } from "../components/ui/skeleton";
import { useApi } from "../composables/useApi";
import { actionService } from "../services/actionService";
import type { ActionReport } from "../types";

function getStatusColor(status: string) {
  switch (status) {
    case "verified":
      return "safe";
    case "pending":
      return "warning";
    default:
      return "default";
  }
}

export function ActionHistoryPage() {
  const {
    data: actionsData,
    loading,
    error,
  } = useApi(actionService.listHistory);

  const actions = (actionsData || []) as ActionReport[];

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <PageHeader
          title="Action History"
          description="Laporan aksi yang telah Anda kirimkan untuk diverifikasi."
        />
        <Link to="/hazard-report">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Report
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={`loading-${index}`} className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </Card>
          ))}
        </div>
      ) : error ? (
        <EmptyState title="Failed to load actions" message={error} />
      ) : actions.length === 0 ? (
        <EmptyState
          title="No action reports yet"
          message="Mulai dengan membuat laporan aksi baru untuk berkontribusi."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {actions.map((action: ActionReport, index: number) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/actions/${action.id}`} className="block">
                <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{action.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {action.action_type}
                      </p>
                    </div>
                    <Badge tone={getStatusColor(action.status)}>
                      {action.status}
                    </Badge>
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {action.description}
                  </p>

                  <div className="mt-3 flex flex-col gap-2 text-xs text-muted-foreground">
                    <p>
                      Submitted:{" "}
                      {new Date(action.created_at).toLocaleDateString("id-ID")}
                    </p>
                    {action.verification && (
                      <div className="rounded-lg border border-border/50 bg-muted/20 p-2">
                        <p className="font-medium">
                          Verified: {action.verification.category} (
                          {action.verification.points_awarded} pts)
                        </p>
                        {action.verification.notes && (
                          <p className="text-xs">{action.verification.notes}</p>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
