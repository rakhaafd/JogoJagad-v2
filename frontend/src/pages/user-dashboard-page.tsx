import { Activity, Gift, Heart } from "lucide-react";
import { PageHeader } from "../components/shared/page-header";
import { StatCard } from "../components/shared/stat-card";
import { Card } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { NotificationsPanel } from "../fragments/dashboard/notifications-panel";
import { QuickActions } from "../fragments/dashboard/quick-actions";
import { WeatherWidget } from "../fragments/dashboard/weather-widget";
import { MonitoringMap } from "../fragments/map/monitoring-map";
import { campaigns, regionStatuses } from "../services/mock-data";

export function UserDashboardPage() {
  const dangerCount = regionStatuses.filter((region) => region.level === "danger").length;
  return (
    <div className="space-y-4">
      <PageHeader
        title="User Dashboard"
        description="Personal response cockpit with weather, alerts, quick actions, and social contribution tracking."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Danger Regions Nearby" value={`${dangerCount}`} subtitle="Escalated zones" icon={Activity} />
        <StatCard title="Preventive Points" value="1,240" subtitle="Reward eligibility active" icon={Gift} />
        <StatCard title="Donation Contributions" value={`Rp${campaigns.length * 150}.000`} subtitle="Total pledge amount" icon={Heart} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-4">
          <WeatherWidget />
          <Card className="space-y-3">
            <p className="text-sm text-muted-foreground">Data Synchronization</p>
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </Card>
          <QuickActions />
        </div>
        <NotificationsPanel />
      </div>

      <MonitoringMap compact />
    </div>
  );
}
