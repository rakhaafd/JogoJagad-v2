import { Filter } from "lucide-react";
import { PageHeader } from "../components/shared/page-header";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { Select } from "../components/ui/select";
import { MonitoringMap } from "../fragments/map/monitoring-map";
import { regionStatuses } from "../services/mock-data";

export function MapMonitoringPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Map Monitoring"
        description="Fullscreen geo-visualization for regional disaster severity and disaster type classification."
        action={
          <div className="flex gap-2">
            <Select defaultValue="all">
              <option value="all">All Disaster Types</option>
              <option>Flood</option>
              <option>Storm</option>
              <option>Volcano</option>
            </Select>
            <button className="inline-flex h-11 items-center gap-2 rounded-xl border border-border px-4 text-sm">
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_0.35fr]">
        <MonitoringMap />
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
            {regionStatuses.map((region) => (
              <div key={region.id} className="rounded-xl border border-border bg-muted/20 p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{region.name}</p>
                  <Badge tone={region.level}>{region.level}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {region.disasterType} · {region.updatedAt}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
