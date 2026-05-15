import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  CircleDollarSign,
  Heart,
  Users,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EmptyState } from "../components/shared/empty-state";
import { PageHeader } from "../components/shared/page-header";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Modal } from "../components/ui/modal";
import { Progress } from "../components/ui/progress";
import { Skeleton } from "../components/ui/skeleton";
import { useToast } from "../components/ui/toast";
import { DynamicForm } from "../components/shared/dynamic-form";
import { useApi } from "../composables/useApi";
import { useMutation } from "../composables/useMutation";
import { donationService } from "../services/donationService";
import { buildFormFields } from "../utils/form";
import { formatCurrency, formatNumber } from "../utils/format";
import type { DonationCreatePayload, FormFieldConfig } from "../types";

function getDonationStatusTone(status: string) {
  switch (status.toLowerCase()) {
    case "paid":
    case "settled":
      return "safe";
    case "pending":
    case "process":
      return "warning";
    case "expired":
    case "failed":
      return "danger";
    default:
      return "default";
  }
}

export function DonationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationForm, setDonationForm] = useState<DonationCreatePayload>({
    amount: 0,
  });

  const fetcher = useCallback(
    () =>
      id
        ? donationService.campaignDetail(Number(id))
        : Promise.reject(new Error("Missing id")),
    [id],
  );

  const {
    data: campaign,
    loading,
    error,
    refetch,
  } = useApi(fetcher, {
    immediate: !!id,
  });

  const donateMutation = useMutation(async (payload: DonationCreatePayload) => {
    if (!id) throw new Error("Campaign ID not found");
    return donationService.donate(Number(id), payload);
  });

  const donationFields = useMemo<FormFieldConfig[]>(() => {
    return buildFormFields(
      { amount: donationForm.amount } as Record<string, unknown>,
      {
        amount: {
          label: "Donation Amount (IDR)",
          type: "number",
          placeholder: "Masukkan nominal donasi (IDR)",
        },
      },
    );
  }, [donationForm.amount]);

  const handleDonationSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    try {
      const result = await donateMutation.mutate(donationForm);
      pushToast("Donation submitted successfully!");
      setShowDonationModal(false);
      setDonationForm({ amount: 0 });
      if (result.checkout_url) {
        window.open(result.checkout_url, "_blank");
      }
      // Refresh campaign data to update donation list
      await refetch();
    } catch {
      pushToast("Failed to submit donation. Please try again.", "info");
    }
  };

  const totalRaised = campaign?.current_amount ?? 0;
  const targetAmount = campaign?.target_amount ?? 0;
  const progress = targetAmount ? (totalRaised / targetAmount) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title={campaign?.title ?? "Donation Detail"}
          description="Informasi lengkap campaign beserta riwayat donasi terbaru."
        />
        <div className="flex gap-2">
          <Button className="gap-2" onClick={() => setShowDonationModal(true)}>
            <Heart className="h-4 w-4" />
            Donate Now
          </Button>
          <Button variant="outline" onClick={() => navigate("/donation")}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
          <Card className="space-y-4">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </Card>
          <Card className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </Card>
        </div>
      ) : error ? (
        <EmptyState title="Failed to load donation detail" message={error} />
      ) : campaign ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]"
        >
          <div className="space-y-4">
            <Card className="space-y-4 overflow-hidden p-0">
              <div className="relative h-64 w-full bg-muted">
                {campaign.image_path ? (
                  <img
                    src={campaign.image_path}
                    alt={campaign.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-teal-500/20 via-emerald-500/10 to-transparent text-sm text-muted-foreground">
                    No campaign image available
                  </div>
                )}
              </div>
              <div className="space-y-4 px-5 pb-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="safe">Active Donation</Badge>
                  <Badge tone="default">Campaign #{campaign.id}</Badge>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{campaign.title}</h2>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                    {campaign.description}
                  </p>
                </div>
              </div>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              <Card className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Collected
                </p>
                <p className="text-2xl font-semibold">
                  {formatCurrency(totalRaised)}
                </p>
                <p className="text-xs text-muted-foreground">Current amount</p>
              </Card>
              <Card className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Target
                </p>
                <p className="text-2xl font-semibold">
                  {formatCurrency(targetAmount)}
                </p>
                <p className="text-xs text-muted-foreground">Funding goal</p>
              </Card>
              <Card className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Donors
                </p>
                <p className="text-2xl font-semibold">
                  {formatNumber(campaign.donations.length)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Contribution count
                </p>
              </Card>
            </div>

            <Card className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">Progress</h3>
                  <p className="text-sm text-muted-foreground">
                    {Math.round(progress)}% of the target has been reached.
                  </p>
                </div>
                <Badge tone="safe">{Math.round(progress)}%</Badge>
              </div>
              <Progress value={progress} />
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <CircleDollarSign className="h-3.5 w-3.5" />
                  {formatCurrency(totalRaised)} raised
                </span>
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Updated{" "}
                  {new Date(campaign.updated_at).toLocaleString("id-ID")}
                </span>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="space-y-3">
              <h3 className="text-lg font-semibold">Donation Summary</h3>
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Raised</span>
                  <span className="font-medium">
                    {formatCurrency(totalRaised)}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Remaining</span>
                  <span className="font-medium">
                    {formatCurrency(Math.max(targetAmount - totalRaised, 0))}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                {formatNumber(campaign.donations.length)} donation records
              </div>
            </Card>

            <Card className="space-y-3">
              <h3 className="text-lg font-semibold">Recent Donations</h3>
              {campaign.donations.length === 0 ? (
                <EmptyState
                  title="No donations yet"
                  message="Donation history will appear here after the first payment is recorded."
                />
              ) : (
                <div className="space-y-3">
                  {campaign.donations.map((donation) => (
                    <div
                      key={donation.id}
                      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">
                            {donation.user?.name ?? "Anonymous donor"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {donation.provider ?? "manual"} · ID {donation.id}
                          </p>
                        </div>
                        <Badge tone={getDonationStatusTone(donation.status)}>
                          {donation.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                        <span className="font-medium">
                          {formatCurrency(donation.amount)}
                        </span>
                        <span className="text-muted-foreground">
                          {donation.paid_at
                            ? new Date(donation.paid_at).toLocaleString("id-ID")
                            : new Date(
                                donation.created_at ?? campaign.created_at,
                              ).toLocaleString("id-ID")}
                        </span>
                      </div>
                      {donation.checkout_url ? (
                        <p className="break-all text-xs text-muted-foreground">
                          Checkout: {donation.checkout_url}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </motion.div>
      ) : null}

      <Modal
        open={showDonationModal}
        onOpenChange={setShowDonationModal}
        title="Make a Donation"
        description="Contribute to this campaign and make a difference."
      >
        <DynamicForm
          fields={donationFields}
          values={donationForm as unknown as Record<string, unknown>}
          onChange={(name, value) =>
            setDonationForm((prev) => ({ ...prev, [name]: value }))
          }
          onSubmit={handleDonationSubmit}
          errors={donateMutation.validationErrors}
          disabled={donateMutation.loading}
          actions={
            <Button
              className="w-full"
              type="submit"
              disabled={donateMutation.loading}
            >
              {donateMutation.loading ? "Processing..." : "Submit Donation"}
            </Button>
          }
        />
      </Modal>
    </div>
  );
}
