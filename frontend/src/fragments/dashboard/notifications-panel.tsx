import { Bell } from "lucide-react";
import { EmptyState } from "../../components/shared/empty-state";
import { notifications } from "../../services/mock-data";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";

export function NotificationsPanel() {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="inline-flex items-center gap-2 text-lg font-semibold">
          <Bell className="h-4 w-4 text-primary" /> Notifications
        </h3>
        <Badge>{notifications.length} New</Badge>
      </div>
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <EmptyState
            title="No active notifications"
            message="Your monitored regions are currently stable."
          />
        ) : (
          notifications.map((item) => (
            <div key={item.id} className="rounded-xl border border-border bg-muted/30 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{item.title}</p>
                <Badge tone={item.level}>{item.level}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
              <p className="mt-2 text-xs text-muted-foreground">{item.time}</p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
