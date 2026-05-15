import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/shared/page-header";
import { EmptyState } from "../components/shared/empty-state";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { useApi } from "../composables/useApi";
import { regionService } from "../services/regionService";

export function AdminRegionStatusPage() {
  const { data: regionsData, loading, error } = useApi(regionService.list);
  const regions = regionsData ?? [];

  const navigate = useNavigate();

  const openCreatePage = useCallback(() => {
    navigate("/admin/regions/create");
  }, [navigate]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Region Status Management"
        description="Kelola status dan informasi wilayah bencana."
        action={
          <Button variant="default" onClick={openCreatePage}>
            Add Region
          </Button>
        }
      />

      <Card>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : error ? (
          <EmptyState title="Failed to load regions" message={error} />
        ) : regions.length === 0 ? (
          <EmptyState title="No regions" message="No region status found." />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border text-sm">
                <thead className="bg-muted/60 text-left text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Location</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Description</th>
                    <th className="px-4 py-3 font-semibold text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {regions.map((item, idx) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="hover:bg-muted/50"
                    >
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <p className="font-medium">
                            {item.kelurahan}, {item.kecamatan}, {item.kota},{" "}
                            {item.provinsi}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ID #{item.id}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block rounded px-2 py-1 text-xs font-semibold capitalize bg-warning/20 text-warning">
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {item.description}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate(`/admin/regions/${item.id}`)
                            }
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default AdminRegionStatusPage;
