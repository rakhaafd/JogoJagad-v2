import { Gift, MessageCircleHeart, Siren, Wallet } from "lucide-react";
import { Card } from "../../components/ui/card";

const quickActions = [
  { icon: Siren, label: "Report Hazard", description: "Submit field situation update" },
  { icon: MessageCircleHeart, label: "Ask AI", description: "Get preventive guidance quickly" },
  { icon: Gift, label: "Submit Action", description: "Upload preventive action proof" },
  { icon: Wallet, label: "Donate Now", description: "Support active emergency campaigns" },
];

export function QuickActions() {
  return (
    <Card className="space-y-4">
      <h3 className="text-lg font-semibold">Quick Actions</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {quickActions.map((action) => (
          <button
            key={action.label}
            className="rounded-xl border border-border bg-card p-3 text-left transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"
          >
            <action.icon className="h-5 w-5 text-primary" />
            <p className="mt-2 text-sm font-medium">{action.label}</p>
            <p className="text-xs text-muted-foreground">{action.description}</p>
          </button>
        ))}
      </div>
    </Card>
  );
}
