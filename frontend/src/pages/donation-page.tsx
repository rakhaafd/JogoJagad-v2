import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { History } from "lucide-react";
import { PageHeader } from "../components/shared/page-header";
import { Button } from "../components/ui/button";
import { CampaignGrid } from "../fragments/donation/campaign-grid";
import { EmptyState } from "../components/shared/empty-state";
import { Skeleton } from "../components/ui/skeleton";
import { useApi } from "../composables/useApi";
import { donationService } from "../services/donationService";

export function DonationPage() {
  const navigate = useNavigate();
  const campaignsFetcher = useCallback(
    () => donationService.listCampaigns(false),
    [],
  );
  const { data: campaignsData, loading, error } = useApi(campaignsFetcher);
  const campaigns = campaignsData ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Donation Campaigns"
          description="Transparent progress tracking and targeted emergency funding."
        />
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => navigate("/donation-history")}
        >
          <History className="h-4 w-4" />
          Donation History
        </Button>
      </div>
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={`campaign-${index}`} className="h-64 w-full" />
          ))}
        </div>
      ) : error ? (
        <EmptyState title="Failed to load campaigns" message={error} />
      ) : campaigns.length === 0 ? (
        <EmptyState
          title="No campaigns"
          message="Donation campaigns will appear once published by admins."
        />
      ) : (
        <CampaignGrid
          campaigns={campaigns}
          onOpenDetail={(campaign) => navigate(`/donation/${campaign.id}`)}
        />
      )}
    </div>
  );
}
