import { CloudRain, HandCoins, ShieldAlert, Trophy } from "lucide-react";
import { landingStats } from "../../services/mock-data";
import { formatCurrency, formatNumber } from "../../utils/format";
import { StatCard } from "../../components/shared/stat-card";

export function StatsSection() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title={landingStats[0].label}
        value={formatNumber(landingStats[0].value)}
        subtitle="Active GIS regions"
        icon={ShieldAlert}
      />
      <StatCard
        title={landingStats[1].label}
        value={formatNumber(landingStats[1].value)}
        subtitle="Geo-targeted notification events"
        icon={CloudRain}
      />
      <StatCard
        title={landingStats[2].label}
        value={formatNumber(landingStats[2].value)}
        subtitle="Community prevention proof"
        icon={Trophy}
      />
      <StatCard
        title={landingStats[3].label}
        value={formatCurrency(landingStats[3].value)}
        subtitle="Total social impact donations"
        icon={HandCoins}
      />
    </section>
  );
}
