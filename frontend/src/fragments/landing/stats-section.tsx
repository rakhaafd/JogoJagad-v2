import { CloudRain, HandCoins, ShieldAlert, Trophy } from "lucide-react";
import { formatCurrency, formatNumber } from "../../utils/format";
import { StatCard } from "../../components/shared/stat-card";
import { Skeleton } from "../../components/ui/skeleton";
import { useApi } from "../../composables/useApi";
import { disasterService } from "../../services/disasterService";
import { donationService } from "../../services/donationService";
import { newsService } from "../../services/newsService";
import { useCallback } from "react";

export function StatsSection() {
  const { data: regions, loading: regionsLoading } = useApi(
    disasterService.regions,
  );
  const campaignsFetcher = useCallback(
    () => donationService.listCampaigns(false),
    [],
  );
  const { data: campaigns, loading: campaignsLoading } =
    useApi(campaignsFetcher);
  const { data: news, loading: newsLoading } = useApi(newsService.list);

  const regionsList = regions ?? [];
  const campaignsList = campaigns ?? [];

  const alerts = regionsList.filter(
    (region) => region.status !== "aman",
  ).length;
  const totalDonations = campaignsList.reduce(
    (sum, campaign) => sum + campaign.current_amount,
    0,
  );

  if (regionsLoading || campaignsLoading || newsLoading) {
    return (
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={`stat-${index}`} className="h-24 w-full" />
        ))}
      </section>
    );
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Monitored Regions"
        value={formatNumber(regionsList.length)}
        subtitle="Active GIS regions"
        icon={ShieldAlert}
      />
      <StatCard
        title="Active Alerts"
        value={formatNumber(alerts)}
        subtitle="Regions with warnings"
        icon={CloudRain}
      />
      <StatCard
        title="Published News"
        value={formatNumber((news ?? []).length)}
        subtitle="Verified newsroom updates"
        icon={Trophy}
      />
      <StatCard
        title="Donation Collected"
        value={formatCurrency(totalDonations)}
        subtitle="Live campaign totals"
        icon={HandCoins}
      />
    </section>
  );
}
