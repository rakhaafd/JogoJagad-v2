import { Activity, Gift, Heart } from "lucide-react";
import { PageHeader } from "../components/shared/page-header";
import { StatCard } from "../components/shared/stat-card";
import { Card } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { NotificationsPanel } from "../fragments/dashboard/notifications-panel";
import { QuickActions } from "../fragments/dashboard/quick-actions";
import { WeatherWidget } from "../fragments/dashboard/weather-widget";
import { MonitoringMap } from "../fragments/map/monitoring-map";
import { useApi } from "../composables/useApi";
import { donationService } from "../services/donationService";
import { disasterService } from "../services/disasterService";
import { useAuth } from "../hooks/useAuth";

export function UserDashboardPage() {
  const { user } = useAuth();
  const {
    data: regions = [],
    loading: regionsLoading,
    error: regionsError,
  } = useApi(disasterService.regions);
  const { data: donationHistory = [] } = useApi(donationService.history);

  const relevantRegions = user
    ? regions.filter(
        (region) =>
          region.provinsi === user.provinsi &&
          region.kota === user.kota &&
          region.kecamatan === user.kecamatan &&
          region.kelurahan === user.kelurahan,
      )
    : regions;
  const dangerCount = relevantRegions.filter(
    (region) => region.status === "bahaya",
  ).length;
  const totalDonations = donationHistory.reduce(
    (sum, donation) => sum + donation.amount,
    0,
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="User Dashboard"
        description="Personal response cockpit with weather, alerts, quick actions, and social contribution tracking."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Danger Regions Nearby"
          value={`${dangerCount}`}
          subtitle="Escalated zones"
          icon={Activity}
        />
        <StatCard
          title="Preventive Points"
          value={`${user?.total_points ?? 0}`}
          subtitle="Reward eligibility active"
          icon={Gift}
        />
        <StatCard
          title="Donation Contributions"
          value={`Rp${totalDonations.toLocaleString("id-ID")}`}
          subtitle="Total pledge amount"
          icon={Heart}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-4">
          <WeatherWidget />
          <Card className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Data Synchronization
            </p>
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </Card>
          <QuickActions />
        </div>
        <NotificationsPanel />
      </div>

      <MonitoringMap
        compact
        regions={regions}
        loading={regionsLoading}
        error={regionsError}
      />
    </div>
  );
}
