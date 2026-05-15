import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/shared/page-header";
import { EmptyState } from "../components/shared/empty-state";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Skeleton } from "../components/ui/skeleton";
import { useApi } from "../composables/useApi";
import { donationService } from "../services/donationService";
import { formatCurrency, formatNumber } from "../utils/format";
import type { DonationCampaign } from "../types";

export function AdminDonationPage() {
  const navigate = useNavigate();
  const fetcher = useCallback(() => donationService.listCampaigns(true), []);
  const { data: campaignsData, loading, error } = useApi(fetcher);
  const campaigns = campaignsData ?? [];

  const openCreatePage = useCallback(() => {
    navigate("/admin/donations/create");
  }, [navigate]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Donation Management"
        description="Kelola campaign donasi untuk publik: buat, edit, lihat detail, dan hapus campaign."
        action={
          <Button variant="default" onClick={openCreatePage}>
            Add Donation
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
          <EmptyState
            title="Failed to load donation campaigns"
            message={error}
          />
        ) : campaigns.length === 0 ? (
          <EmptyState
            title="No donation campaigns"
            message="Donation campaigns will appear here once created by admins."
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border text-sm">
                <thead className="bg-muted/60 text-left text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Campaign</th>
                    <th className="px-4 py-3 font-semibold">Funding</th>
                    <th className="px-4 py-3 font-semibold">Progress</th>
                    <th className="px-4 py-3 font-semibold">Updated</th>
                    <th className="px-4 py-3 font-semibold text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {campaigns.map((item: DonationCampaign, idx: number) => {
                    const progress = item.target_amount
                      ? (item.current_amount / item.target_amount) * 100
                      : 0;

                    return (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        className="hover:bg-muted/50"
                      >
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <p className="font-medium">{item.title}</p>
                            <p className="text-xs text-muted-foreground">
                              ID #{item.id} • {item.donations_count ?? 0}{" "}
                              donations
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <p className="font-medium">
                              {formatCurrency(item.current_amount)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Target {formatCurrency(item.target_amount)}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 w-56">
                          <div className="space-y-2">
                            <Progress value={progress} />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{Math.round(progress)}%</span>
                              <span>
                                {formatNumber(item.donations_count ?? 0)} donors
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(item.updated_at).toLocaleString("id-ID")}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate(`/admin/donations/${item.id}`)
                              }
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default AdminDonationPage;
