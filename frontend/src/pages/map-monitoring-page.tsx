import { Filter, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/shared/page-header";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { Select } from "../components/ui/select";
import { Button } from "../components/ui/button";
import { MonitoringMap } from "../fragments/map/monitoring-map";
import { Skeleton } from "../components/ui/skeleton";
import { EmptyState } from "../components/shared/empty-state";
import { useApi } from "../composables/useApi";
import { disasterService } from "../services/disasterService";
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

export function MapMonitoringPage() {
  const [filterDisaster, setFilterDisaster] = useState("all");

  // Disaster data
  const {
    data: regions = [],
    loading: regionsLoading,
    error: regionsError,
  } = useApi(disasterService.regions);

  // Action history data
  const {
    data: actionsData,
    loading: actionsLoading,
    error: actionsError,
  } = useApi(actionService.listHistory);

  const actions = (actionsData || []) as ActionReport[];

  const disasterTypes = useMemo(() => {
    const values = new Set(
      (regions ?? []).map((region) => region.disaster_type).filter(Boolean),
    );
    return Array.from(values).map((value) => String(value));
  }, [regions]);

  const filteredRegions = useMemo(() => {
    const regionsList = regions ?? [];
    if (filterDisaster === "all") return regionsList;
    return regionsList.filter(
      (region) => region.disaster_type === filterDisaster,
    );
  }, [regions, filterDisaster]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Action"
        description="Real-time disaster monitoring with action history tracking."
        action={
          <div className="flex gap-2">
            <Select
              value={filterDisaster}
              onChange={(event) => setFilterDisaster(event.target.value)}
            >
              <option value="all">All Disaster Types</option>
              {disasterTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
            <button className="inline-flex h-11 items-center gap-2 rounded-xl border border-border px-4 text-sm transition hover:bg-muted">
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>
        }
      />

      {/* Map Widget */}
      <Card className="relative overflow-hidden">
        <div className="h-64 rounded-lg overflow-hidden">
          <MonitoringMap
            regions={filteredRegions}
            loading={regionsLoading}
            error={regionsError}
          />
        </div>
      </Card>

      {/* Legend */}
      <Card className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          Region Status Legend
        </h3>
        <div className="grid gap-3 grid-cols-3">
          <div className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-safe" />
            <span className="text-xs text-muted-foreground">Safe</span>
          </div>
          <div className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-warning" />
            <span className="text-xs text-muted-foreground">Warning</span>
          </div>
          <div className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-danger" />
            <span className="text-xs text-muted-foreground">Danger</span>
          </div>
        </div>
      </Card>

      {/* Action History Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Action History
            </h3>
            <p className="text-sm text-muted-foreground">
              Your submitted reports
            </p>
          </div>
          <Link to="/hazard-report">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Report
            </Button>
          </Link>
        </div>

        {actionsLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={`loading-${index}`} className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </Card>
            ))}
          </div>
        ) : actionsError ? (
          <EmptyState title="Failed to load actions" message={actionsError} />
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
                  <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">
                          {action.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {action.action_type}
                        </p>
                      </div>
                      <Badge tone={getStatusColor(action.status)}>
                        {action.status}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {action.description}
                    </p>

                    <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                      <p>
                        Submitted:{" "}
                        {new Date(action.created_at).toLocaleDateString(
                          "id-ID",
                        )}
                      </p>
                      {action.verification && (
                        <div className="rounded-lg border border-border/50 bg-muted/20 p-2">
                          <p className="font-medium text-safe">
                            ✓ Verified · {action.verification.points_awarded}{" "}
                            pts
                          </p>
                          {action.verification.notes && (
                            <p className="text-xs">
                              {action.verification.notes}
                            </p>
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
    </div>
  );
}
