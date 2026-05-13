import { Activity, BadgeDollarSign, ShieldCheck } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { Card } from "../../components/ui/card";
import { StatCard } from "../../components/shared/stat-card";
import { Skeleton } from "../../components/ui/skeleton";

interface AnalyticsOverviewProps {
  stats: {
    alerts: number;
    verifiedActions: number;
    donationTotal: number;
  };
  series: Array<{
    name: string;
    alerts: number;
    verifiedActions: number;
    donations: number;
  }>;
  loading?: boolean;
}

export function AnalyticsOverview({
  stats,
  series,
  loading,
}: AnalyticsOverviewProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={`stat-${index}`} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Triggered Alerts"
          value={stats.alerts.toLocaleString("id-ID")}
          subtitle="Active warning regions"
          icon={Activity}
        />
        <StatCard
          title="Verified Preventive Actions"
          value={stats.verifiedActions.toLocaleString("id-ID")}
          subtitle="Moderation pipeline"
          icon={ShieldCheck}
        />
        <StatCard
          title="Donation Throughput"
          value={`Rp${stats.donationTotal.toLocaleString("id-ID")}`}
          subtitle="Campaign transactions"
          icon={BadgeDollarSign}
        />
      </div>

      <Card>
        <h3 className="mb-3 text-lg font-semibold">Weekly Operations Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(148,163,184,0.35)"
              />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="alerts"
                stroke="#0d9488"
                strokeWidth={2.2}
              />
              <Line
                type="monotone"
                dataKey="verifiedActions"
                stroke="#14b8a6"
                strokeWidth={2.2}
              />
              <Line
                type="monotone"
                dataKey="donations"
                stroke="#10b981"
                strokeWidth={2.2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
