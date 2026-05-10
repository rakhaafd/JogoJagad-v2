import { PageHeader } from "../components/shared/page-header";
import { Card } from "../components/ui/card";
import { AnalyticsOverview } from "../fragments/admin/analytics-overview";
import { VerificationTable } from "../fragments/admin/verification-table";
import { MonitoringMap } from "../fragments/map/monitoring-map";

export function AdminDashboardPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Admin Dashboard"
        description="Operational command center for analytics, field verification, donation moderation, and content governance."
      />
      <AnalyticsOverview />
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <VerificationTable />
        <Card className="space-y-3">
          <h3 className="text-lg font-semibold">Donation & News Management</h3>
          <p className="text-sm text-muted-foreground">
            Approve campaigns, audit transaction integrity, and moderate disaster updates.
          </p>
          <div className="rounded-xl border border-border bg-muted/25 p-3 text-sm text-muted-foreground">
            14 donation requests pending compliance validation.
          </div>
          <div className="rounded-xl border border-border bg-muted/25 p-3 text-sm text-muted-foreground">
            7 news submissions queued for editorial review.
          </div>
        </Card>
      </div>
      <MonitoringMap compact />
    </div>
  );
}
