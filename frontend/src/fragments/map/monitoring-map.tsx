import { Layers3 } from "lucide-react";
import L from "leaflet";
import { useEffect, useRef } from "react";
import type { Region, RegionStatus } from "../../types";
import { Card } from "../../components/ui/card";
import { EmptyState } from "../../components/shared/empty-state";
import { Skeleton } from "../../components/ui/skeleton";

function levelColor(level: RegionStatus) {
  if (level === "bahaya") return "#ef4444";
  if (level === "waspada") return "#eab308";
  return "#22c55e";
}

interface MonitoringMapProps {
  compact?: boolean;
  regions: Region[];
  loading?: boolean;
  error?: string | null;
}

export function MonitoringMap({
  compact,
  regions,
  loading,
  error,
}: MonitoringMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [-2.5, 118],
      zoom: 5,
      scrollWheelZoom: true,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    layersRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !layersRef.current) return;
    layersRef.current.clearLayers();
    regions
      .filter((region) => region.polygon && region.polygon.length)
      .forEach((region) => {
        const color = levelColor(region.status);
        L.polygon(region.polygon, {
          color,
          fillColor: color,
          fillOpacity: 0.3,
          weight: 2,
        })
          .bindPopup(
            `${region.kelurahan}<br/>${region.disaster_type ?? "Unknown"} - ${region.status.toUpperCase()}<br/>Updated ${new Date(
              region.updated_at,
            ).toLocaleString("id-ID")}`,
          )
          .addTo(layersRef.current!);
      });
  }, [regions]);

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Disaster Monitoring Map</h3>
        <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
          <Layers3 className="h-3.5 w-3.5" /> Live Layer
        </span>
      </div>
      <div className={compact ? "h-72" : "h-[70vh]"}>
        <div ref={mapContainerRef} className="h-full w-full rounded-2xl" />
        {loading ? (
          <div className="mt-3 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : null}
        {!loading && error ? (
          <div className="mt-3 text-sm text-danger">{error}</div>
        ) : null}
        {!loading && !error && regions.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              title="No region data"
              message="Region status updates will appear here once available."
            />
          </div>
        ) : null}
      </div>
    </Card>
  );
}
