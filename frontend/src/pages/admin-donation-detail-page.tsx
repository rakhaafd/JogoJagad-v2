import { motion } from "framer-motion";
import { ArrowLeft, Edit2, RefreshCw, Trash2, Users } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EmptyState } from "../components/shared/empty-state";
import { PageHeader } from "../components/shared/page-header";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Skeleton } from "../components/ui/skeleton";
import { useToast } from "../components/ui/toast";
import { useApi } from "../composables/useApi";
import { donationService } from "../services/donationService";
import { formatCurrency, formatNumber } from "../utils/format";
import type { Donation } from "../types";

function getDonationStatusTone(status: string) {
  switch (status.toLowerCase()) {
    case "paid":
    case "settled":
      return "safe";
    case "pending":
    case "process":
      return "warning";
    case "expired":
    case "failed":
      return "danger";
    default:
      return "default";
  }
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString("id-ID");
}

export function AdminDonationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const [deleting, setDeleting] = useState(false);

  const fetcher = useCallback(
    () =>
      id
        ? donationService.campaignDetail(Number(id), true)
        : Promise.reject(new Error("Missing id")),
    [id],
  );

  const {
    data: campaign,
    loading,
    error,
  } = useApi(fetcher, {
    immediate: Boolean(id),
  });

  const progress = campaign?.target_amount
    ? (campaign.current_amount / campaign.target_amount) * 100
    : 0;

  const handleDelete = useCallback(async () => {
    if (!id) return;
    const confirmed = window.confirm("Delete this donation campaign?");
    if (!confirmed) return;

    setDeleting(true);
    try {
      await donationService.deleteCampaign(Number(id));
      pushToast("Donation campaign deleted.");
      navigate("/admin/donations");
    } catch {
      pushToast("Failed to delete donation campaign.", "info");
    } finally {
      setDeleting(false);
    }
  }, [id, navigate, pushToast]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Donation Campaign Detail"
        description="Lihat detail campaign, progress, dan daftar donasi terbaru."
        action={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/donations")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            {campaign ? (
              <>
                <Button
                  variant="default"
                  onClick={() =>
                    navigate(`/admin/donations/${campaign.id}/edit`)
                  }
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
              </>
            ) : null}
          </div>
        }
      />

      {loading ? (
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="space-y-4 p-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </Card>
          <Card className="space-y-3 p-6">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </Card>
        </div>
      ) : error ? (
        <EmptyState title="Failed to load donation campaign" message={error} />
      ) : campaign ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]"
        >
          <div className="space-y-4">
            <Card className="overflow-hidden p-0">
              <div className="relative h-72 w-full bg-muted">
                {campaign.image_path ? (
                  <img
                    src={campaign.image_path}
                    alt={campaign.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent text-sm text-muted-foreground">
                    No campaign image available
                  </div>
                )}
              </div>

              <div className="space-y-4 p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="safe">Active Campaign</Badge>
                  <Badge tone="default">ID #{campaign.id}</Badge>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {campaign.title}
                  </h2>
                  <p className="mt-2 whitespace-pre-wrap leading-relaxed text-muted-foreground">
                    {campaign.description}
                  </p>
                </div>
              </div>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              <Card className="space-y-2 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Raised
                </p>
                <p className="text-2xl font-semibold">
                  {formatCurrency(campaign.current_amount)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Current collected amount
                </p>
              </Card>
              <Card className="space-y-2 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Target
                </p>
                <p className="text-2xl font-semibold">
                  {formatCurrency(campaign.target_amount)}
                </p>
                <p className="text-xs text-muted-foreground">Funding goal</p>
              </Card>
              <Card className="space-y-2 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Donations
                </p>
                <p className="text-2xl font-semibold">
                  {formatNumber(
                    campaign.donations_count ?? campaign.donations.length,
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  Total contribution records
                </p>
              </Card>
            </div>

            <Card className="space-y-3 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">Progress</h3>
                  <p className="text-sm text-muted-foreground">
                    {Math.round(progress)}% of the target has been reached.
                  </p>
                </div>
                <Badge tone={progress >= 100 ? "safe" : "warning"}>
                  {Math.round(progress)}%
                </Badge>
              </div>
              <Progress value={progress} />
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span>
                  Remaining:{" "}
                  {formatCurrency(
                    Math.max(
                      campaign.target_amount - campaign.current_amount,
                      0,
                    ),
                  )}
                </span>
                <span>Updated: {formatDate(campaign.updated_at)}</span>
                <span>Created: {formatDate(campaign.created_at)}</span>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="space-y-3 p-5">
              <h3 className="text-lg font-semibold">Campaign Summary</h3>
              <div className="rounded-2xl border border-border bg-muted/20 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Collected</span>
                  <span className="font-medium">
                    {formatCurrency(campaign.current_amount)}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Remaining</span>
                  <span className="font-medium">
                    {formatCurrency(
                      Math.max(
                        campaign.target_amount - campaign.current_amount,
                        0,
                      ),
                    )}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                {formatNumber(campaign.donations.length)} donation records
              </div>
            </Card>

            <Card className="space-y-3 p-5">
              <h3 className="text-lg font-semibold">Latest Donations</h3>
              {campaign.donations.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Belum ada donasi pada campaign ini.
                </p>
              ) : (
                <div className="space-y-3">
                  {campaign.donations.map((donation: Donation) => (
                    <div
                      key={donation.id}
                      className="rounded-2xl border border-border bg-muted/20 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="font-medium">
                            {formatCurrency(donation.amount)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {donation.user?.name ?? `User #${donation.user_id}`}
                          </p>
                        </div>
                        <Badge tone={getDonationStatusTone(donation.status)}>
                          {donation.status}
                        </Badge>
                      </div>
                      <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
                        <p>Paid at: {formatDate(donation.paid_at)}</p>
                        <p>Created: {formatDate(donation.created_at)}</p>
                        <p>External ID: {donation.external_id}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}

export default AdminDonationDetailPage;
