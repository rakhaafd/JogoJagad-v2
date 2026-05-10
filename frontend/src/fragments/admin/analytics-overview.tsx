import { Activity, BadgeDollarSign, ShieldCheck } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { analyticsSeries } from "../../services/mock-data";
import { Card } from "../../components/ui/card";
import { StatCard } from "../../components/shared/stat-card";

export function AnalyticsOverview() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Triggered Alerts" value="1,982" subtitle="This week" icon={Activity} />
        <StatCard
          title="Verified Preventive Actions"
          value="836"
          subtitle="Moderation pipeline"
          icon={ShieldCheck}
        />
        <StatCard
          title="Donation Throughput"
          value="Rp1.2B"
          subtitle="Campaign transactions"
          icon={BadgeDollarSign}
        />
      </div>

      <Card>
        <h3 className="mb-3 text-lg font-semibold">Weekly Operations Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.35)" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <Tooltip />
              <Line type="monotone" dataKey="alerts" stroke="#0d9488" strokeWidth={2.2} />
              <Line type="monotone" dataKey="verifiedActions" stroke="#14b8a6" strokeWidth={2.2} />
              <Line type="monotone" dataKey="donations" stroke="#10b981" strokeWidth={2.2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
