import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays, CircleDollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/shared/page-header";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { EmptyState } from "../components/shared/empty-state";
import { Skeleton } from "../components/ui/skeleton";
import { useApi } from "../composables/useApi";
import { donationService } from "../services/donationService";
import { formatCurrency } from "../utils/format";
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

export function DonationHistoryPage() {
  const navigate = useNavigate();
  const {
    data: donationsData,
    loading,
    error,
  } = useApi(donationService.history);
  const donations = donationsData ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Donation History"
          description="Your donation contributions and transaction details."
        />
        <Button variant="outline" onClick={() => navigate("/donation")}>
          <ArrowLeft className="h-4 w-4" />
          Back to Campaigns
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={`loading-${index}`} className="space-y-3">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </Card>
          ))}
        </div>
      ) : error ? (
        <EmptyState title="Failed to load donation history" message={error} />
      ) : donations.length === 0 ? (
        <EmptyState
          title="No donations yet"
          message="Your donation history will appear here after you make your first contribution."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {donations.map((donation: Donation, index: number) => (
            <motion.div
              key={donation.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {donation.campaign?.title ?? `Donation #${donation.id}`}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Campaign ID: {donation.donation_campaign_id}
                    </p>
                  </div>
                  <Badge tone={getDonationStatusTone(donation.status)}>
                    {donation.status}
                  </Badge>
                </div>

                <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Amount
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(donation.amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Provider</span>
                    <span className="capitalize">
                      {donation.provider ?? "manual"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                  {donation.paid_at && (
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-3.5 w-3.5" />
                      <span>
                        Paid:{" "}
                        {new Date(donation.paid_at).toLocaleString("id-ID")}
                      </span>
                    </div>
                  )}
                  {donation.created_at && (
                    <div className="flex items-center gap-2">
                      <CircleDollarSign className="h-3.5 w-3.5" />
                      <span>
                        Created:{" "}
                        {new Date(donation.created_at).toLocaleString("id-ID")}
                      </span>
                    </div>
                  )}
                  {donation.external_id && (
                    <p className="break-all">
                      Transaction ID: {donation.external_id}
                    </p>
                  )}
                </div>

                {donation.checkout_url && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      donation.checkout_url
                        ? window.open(donation.checkout_url, "_blank")
                        : undefined
                    }
                  >
                    View Checkout
                  </Button>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
