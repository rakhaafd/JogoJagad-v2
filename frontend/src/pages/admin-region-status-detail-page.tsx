import { motion } from "framer-motion";
import { ArrowLeft, Edit2, RefreshCw, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../components/shared/page-header";
import { EmptyState } from "../components/shared/empty-state";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { useApi } from "../composables/useApi";
import { useToast } from "../components/ui/toast";
import { regionService } from "../services/regionService";

function getStatusTone(status: string) {
  switch (status.toLowerCase()) {
    case "aman":
      return "safe";
    case "waspada":
      return "warning";
    case "bahaya":
      return "danger";
    default:
      return "default";
  }
}

function formatDate(value?: string) {
  if (!value) return "-";
  return new Date(value).toLocaleString("id-ID");
}

export function AdminRegionStatusDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const [deleting, setDeleting] = useState(false);

  const fetcher = useCallback(
    () =>
      id
        ? regionService.detail(Number(id))
        : Promise.reject(new Error("No ID")),
    [id],
  );

  const {
    data: region,
    loading,
    error,
  } = useApi(fetcher, {
    immediate: Boolean(id),
  });

  const handleDelete = useCallback(async () => {
    if (!id) return;

    const confirmed = window.confirm("Delete this region status?");
    if (!confirmed) return;

    setDeleting(true);
    try {
      await regionService.remove(Number(id));
      pushToast("Region deleted.");
      navigate("/admin/regions");
    } catch {
      pushToast("Failed to delete region.", "info");
    } finally {
      setDeleting(false);
    }
  }, [id, navigate, pushToast]);

  if (loading) {
    return (
      <div className="space-y-4">
        <PageHeader
          title="Region Status Detail"
          description="Lihat detail lengkap informasi wilayah bencana."
          action={
            <Button
              variant="outline"
              onClick={() => navigate("/admin/regions")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          }
        />
        <Card className="space-y-4 p-6">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-5 w-72" />
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
          <Skeleton className="h-28 w-full" />
        </Card>
      </div>
    );
  }

  if (error || !region) {
    return (
      <div className="space-y-4">
        <PageHeader
          title="Region Status Detail"
          description="Lihat detail lengkap informasi wilayah bencana."
          action={
            <Button
              variant="outline"
              onClick={() => navigate("/admin/regions")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          }
        />
        <EmptyState
          title="Region not found"
          message={error ?? "No region status found."}
        />
      </div>
    );
  }

  const location = [
    region.kelurahan,
    region.kecamatan,
    region.kota,
    region.provinsi,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <PageHeader
        title="Region Status Detail"
        description="Lihat detail lengkap informasi wilayah bencana."
        action={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/regions")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              variant="default"
              onClick={() => navigate(`/admin/regions/${region.id}/edit`)}
            >
              <Edit2 className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="danger"
              onClick={() => void handleDelete()}
              disabled={deleting}
            >
              {deleting ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete
            </Button>
          </div>
        }
      />

      <Card className="overflow-hidden">
        <div className="border-b border-border/70 bg-muted/20 px-6 py-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Region Summary</p>
              <h2 className="text-2xl font-semibold tracking-tight">
                {region.kelurahan}, {region.kecamatan}
              </h2>
              <p className="text-sm text-muted-foreground">
                ID #{region.id}
                {location ? ` • ${location}` : ""}
              </p>
            </div>

            <Badge tone={getStatusTone(region.status)}>{region.status}</Badge>
          </div>
        </div>

        <div className="space-y-6 p-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-border bg-muted/20 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Provinsi
              </p>
              <p className="mt-2 text-base font-medium">{region.provinsi}</p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/20 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Kota
              </p>
              <p className="mt-2 text-base font-medium">{region.kota}</p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/20 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Kecamatan
              </p>
              <p className="mt-2 text-base font-medium">{region.kecamatan}</p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/20 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Kelurahan
              </p>
              <p className="mt-2 text-base font-medium">{region.kelurahan}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm font-semibold text-muted-foreground">
              Description
            </p>
            <p className="mt-3 whitespace-pre-wrap leading-relaxed text-foreground">
              {region.description || "-"}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
            <span>Created: {formatDate(region.created_at)}</span>
            <span>Updated: {formatDate(region.updated_at)}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default AdminRegionStatusDetailPage;
