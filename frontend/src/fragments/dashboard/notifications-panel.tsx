import { Bell } from "lucide-react";
import { useCallback } from "react";
import { EmptyState } from "../../components/shared/empty-state";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { useApi } from "../../composables/useApi";
import { notificationService } from "../../services/notificationService";
import { useAuth } from "../../hooks/useAuth";

export function NotificationsPanel() {
  const { user } = useAuth();
  const fetcher = useCallback(() => {
    if (!user) return Promise.resolve([]);
    return notificationService.myRegionAlerts(user);
  }, [user]);

  const {
    data: notifications = [],
    loading,
    error,
  } = useApi(fetcher, {
    immediate: Boolean(user),
  });

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="inline-flex items-center gap-2 text-lg font-semibold">
          <Bell className="h-4 w-4 text-primary" /> Notifications
        </h3>
        <Badge>{notifications.length} New</Badge>
      </div>
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : error ? (
          <div className="text-sm text-danger">{error}</div>
        ) : notifications.length === 0 ? (
          <EmptyState
            title="No active notifications"
            message="Your monitored regions are currently stable."
          />
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-border bg-muted/30 p-3"
            >
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
