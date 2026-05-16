import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import type { ActionReport, ActionListResponse } from "../types";
import { PageHeader } from "../components/shared/page-header";
import { EmptyState } from "../components/shared/empty-state";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { Modal } from "../components/ui/modal";
import { Select } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { MonitoringMap } from "../fragments/map/monitoring-map";
import { useApi } from "../composables/useApi";
import { useToast } from "../components/ui/toast";
import { actionService } from "../services/actionService";
import { disasterService } from "../services/disasterService";

export function ActionReportsPage() {
  const { pushToast } = useToast();
  const { data, loading, error, refetch } = useApi(actionService.list);
  const {
    data: regions = [],
    loading: regionsLoading,
    error: regionsError,
  } = useApi(disasterService.regions);

  const items: ActionReport[] =
    (data as ActionListResponse | undefined)?.actions ?? [];

  const [verifyingActionId, setVerifyingActionId] = useState<number | null>(
    null,
  );
  const [verifyForm, setVerifyForm] = useState<{
    category: string;
    notes: string;
  }>({ category: "Moderate", notes: "" });
  const [verifying, setVerifying] = useState(false);

  const openVerifyModal = useCallback((id: number) => {
    setVerifyingActionId(id);
    setVerifyForm({ category: "Moderate", notes: "" });
  }, []);

  const closeVerifyModal = useCallback(() => {
    setVerifyingActionId(null);
    setVerifyForm({ category: "Moderate", notes: "" });
  }, []);

  const handleSubmitVerify = useCallback(async () => {
    if (verifyingActionId === null) return;

    setVerifying(true);
    try {
      await actionService.verify(verifyingActionId, {
        category: verifyForm.category,
        notes: verifyForm.notes,
      });
      pushToast("Action verified successfully.");
      await refetch();
      closeVerifyModal();
    } catch {
      pushToast("Failed to verify action.", "info");
    } finally {
      setVerifying(false);
    }
  }, [verifyingActionId, verifyForm, pushToast, refetch, closeVerifyModal]);

  const mapWidget = (
    <MonitoringMap
      compact
      regions={regions ?? []}
      loading={regionsLoading}
      error={regionsError}
    />
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <PageHeader
          title="Action Reports"
          description="List of reported actions."
        />
        {mapWidget}
        <Card className="space-y-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <PageHeader
          title="Action Reports"
          description="List of reported actions."
        />
        {mapWidget}
        <EmptyState title="Failed to load actions" message={error} />
      </div>
    );
  }

  const verified = items.filter((a) => a.status === "verified");
  const others = items.filter((a) => a.status !== "verified");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <PageHeader
        title="Action Reports"
        description="Review and verify reported actions."
      />

      {mapWidget}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="mb-2 text-lg font-semibold">Verified</h3>
          {verified.length === 0 ? (
            <Card className="p-6 text-sm text-muted-foreground">
              No verified action reports.
            </Card>
          ) : (
            <div className="space-y-3">
              {verified.map((action) => (
                <Card
                  key={action.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold">
                      {action.title ?? `Action #${action.id}`}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {action.description ?? "-"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Reported by: {action.user?.name ?? "-"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" disabled>
                      Verified
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-2 text-lg font-semibold">Other Statuses</h3>
          {others.length === 0 ? (
            <Card className="p-6 text-sm text-muted-foreground">
              No other action reports.
            </Card>
          ) : (
            <div className="space-y-3">
              {others.map((action) => (
                <Card
                  key={action.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold">
                      {action.title ?? `Action #${action.id}`}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {action.description ?? "-"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Reported by: {action.user?.name ?? "-"}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      className="gap-2"
                      onClick={() => void openVerifyModal(action.id)}
                    >
                      Verify
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        open={verifyingActionId !== null}
        onOpenChange={(open) => {
          if (!open) closeVerifyModal();
        }}
        title="Verify Action Report"
        description="Review and verify this action report by selecting a category and adding notes."
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select
              value={verifyForm.category}
              onChange={(e) =>
                setVerifyForm((p) => ({ ...p, category: e.target.value }))
              }
              disabled={verifying}
            >
              <option value="Minor">Minor</option>
              <option value="Major">Major</option>
              <option value="Moderate">Moderate</option>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              value={verifyForm.notes}
              onChange={(e) =>
                setVerifyForm((p) => ({ ...p, notes: e.target.value }))
              }
              placeholder="Add verification notes..."
              rows={4}
              disabled={verifying}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={closeVerifyModal}
              disabled={verifying}
            >
              Cancel
            </Button>
            <Button
              onClick={() => void handleSubmitVerify()}
              disabled={verifying}
            >
              {verifying ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
