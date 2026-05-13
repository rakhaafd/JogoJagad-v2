import { Filter } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "../components/shared/page-header";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { Select } from "../components/ui/select";
import { MonitoringMap } from "../fragments/map/monitoring-map";
import { Skeleton } from "../components/ui/skeleton";
import { EmptyState } from "../components/shared/empty-state";
import { useApi } from "../composables/useApi";
import { disasterService } from "../services/disasterService";

export function MapMonitoringPage() {
  const [filter, setFilter] = useState("all");
  const {
    data: regions = [],
    loading,
    error,
  } = useApi(disasterService.regions);

  const disasterTypes = useMemo(() => {
    const values = new Set(
      regions.map((region) => region.disaster_type).filter(Boolean),
    );
    return Array.from(values).map((value) => String(value));
  }, [regions]);

  const filteredRegions = useMemo(() => {
    if (filter === "all") return regions;
    return regions.filter((region) => region.disaster_type === filter);
  }, [regions, filter]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Map Monitoring"
        description="Fullscreen geo-visualization for regional disaster severity and disaster type classification."
        action={
          <div className="flex gap-2">
            <Select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="all">All Disaster Types</option>
              {disasterTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
            <button className="inline-flex h-11 items-center gap-2 rounded-xl border border-border px-4 text-sm">
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_0.35fr]">
        <MonitoringMap
          regions={filteredRegions}
          loading={loading}
          error={error}
        />
        <Card className="space-y-4">
          <h3 className="text-lg font-semibold">Region Status Legend</h3>
          <div className="space-y-2">
            <p className="inline-flex items-center gap-2 text-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-safe" /> Safe
            </p>
            <p className="inline-flex items-center gap-2 text-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-warning" /> Warning
            </p>
            <p className="inline-flex items-center gap-2 text-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-danger" /> Danger
            </p>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : error ? (
              <div className="text-sm text-danger">{error}</div>
            ) : filteredRegions.length === 0 ? (
              <EmptyState
                title="No region alerts"
                message="There are no region updates matching this filter."
              />
            ) : (
              filteredRegions.map((region) => (
                <div
                  key={region.id}
                  className="rounded-xl border border-border bg-muted/20 p-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{region.kelurahan}</p>
                    <Badge
                      tone={
                        region.status === "bahaya"
                          ? "danger"
                          : region.status === "waspada"
                            ? "warning"
                            : "safe"
                      }
                    >
                      {region.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {region.disaster_type ?? "Unknown"} ·{" "}
                    {new Date(region.updated_at).toLocaleString("id-ID")}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
