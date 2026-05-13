import { PageHeader } from "../components/shared/page-header";
import { Card } from "../components/ui/card";
import { AnalyticsOverview } from "../fragments/admin/analytics-overview";
import { VerificationTable } from "../fragments/admin/verification-table";
import { MonitoringMap } from "../fragments/map/monitoring-map";
import { useApi } from "../composables/useApi";
import { disasterService } from "../services/disasterService";
import { donationService } from "../services/donationService";
import { newsService } from "../services/newsService";
import { useCallback, useMemo } from "react";

export function AdminDashboardPage() {
  const actionsFetcher = useCallback(() => disasterService.adminActions(), []);
  const campaignsFetcher = useCallback(
    () => donationService.listCampaigns(false),
    [],
  );
  const newsFetcher = useCallback(() => newsService.list(), []);

  const {
    data: actions = [],
    loading: actionsLoading,
    error: actionsError,
  } = useApi(actionsFetcher);
  const {
    data: regions = [],
    loading: regionsLoading,
    error: regionsError,
  } = useApi(disasterService.regions);
  const { data: campaigns = [], loading: campaignsLoading } =
    useApi(campaignsFetcher);
  const { data: news = [] } = useApi(newsFetcher);

  const analytics = useMemo(() => {
    const alerts = regions.filter((region) => region.status !== "aman").length;
    const verifiedActions = actions.filter(
      (action) => action.status === "verified",
    ).length;
    const donationTotal = campaigns.reduce(
      (sum, campaign) => sum + campaign.current_amount,
      0,
    );

    const series = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const label = date.toLocaleDateString("id-ID", { weekday: "short" });
      const dateKey = date.toISOString().slice(0, 10);
      const alertsCount = regions.filter((region) =>
        region.updated_at.startsWith(dateKey),
      ).length;
      const verifiedCount = actions.filter(
        (action) =>
          action.created_at.startsWith(dateKey) && action.status === "verified",
      ).length;
      const campaignCount = campaigns.filter((campaign) =>
        campaign.created_at.startsWith(dateKey),
      ).length;

      return {
        name: label,
        alerts: alertsCount,
        verifiedActions: verifiedCount,
        donations: campaignCount,
      };
    });

    return { alerts, verifiedActions, donationTotal, series };
  }, [regions, actions, campaigns]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Admin Dashboard"
        description="Operational command center for analytics, field verification, donation moderation, and content governance."
      />
      <AnalyticsOverview
        stats={{
          alerts: analytics.alerts,
          verifiedActions: analytics.verifiedActions,
          donationTotal: analytics.donationTotal,
        }}
        series={analytics.series}
        loading={actionsLoading || regionsLoading || campaignsLoading}
      />
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <VerificationTable
          actions={actions}
          loading={actionsLoading}
          error={actionsError}
        />
        <Card className="space-y-3">
          <h3 className="text-lg font-semibold">Donation & News Management</h3>
          <p className="text-sm text-muted-foreground">
            Approve campaigns, audit transaction integrity, and moderate
            disaster updates.
          </p>
          <div className="rounded-xl border border-border bg-muted/25 p-3 text-sm text-muted-foreground">
            {campaigns.length} active donation campaigns monitored.
          </div>
          <div className="rounded-xl border border-border bg-muted/25 p-3 text-sm text-muted-foreground">
            {news.length} news posts available for moderation.
          </div>
        </Card>
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
