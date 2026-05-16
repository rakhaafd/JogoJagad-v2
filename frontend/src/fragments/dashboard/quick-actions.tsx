import { MessageCircleHeart, Newspaper, Siren, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../../components/ui/card";

const quickActions = [
  {
    icon: Siren,
    label: "Report Hazard",
    description: "Submit field situation update",
    path: "/hazard-report",
  },
  {
    icon: MessageCircleHeart,
    label: "Ask AI",
    description: "Get preventive guidance quickly",
    path: "/ai-quiz",
  },
  {
    icon: Newspaper,
    label: "News",
    description: "Read the latest disaster updates",
    path: "/news",
  },
  {
    icon: Wallet,
    label: "Donate Now",
    description: "Support active emergency campaigns",
    path: "/donation",
  },
];

export function QuickActions() {
  return (
    <Card className="h-full space-y-4">
      <h3 className="text-lg font-semibold">Quick Actions</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            to={action.path}
            className="rounded-xl border border-border bg-card p-3 text-left transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"
          >
            <action.icon className="h-5 w-5 text-primary" />
            <p className="mt-2 text-sm font-medium">{action.label}</p>
            <p className="text-xs text-muted-foreground">
              {action.description}
            </p>
          </Link>
        ))}
      </div>
    </Card>
  );
}
