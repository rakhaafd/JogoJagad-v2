import type { FormEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import { PageHeader } from "../components/shared/page-header";
import { Button } from "../components/ui/button";
import { Modal } from "../components/ui/modal";
import { useToast } from "../components/ui/toast";
import { CampaignGrid } from "../fragments/donation/campaign-grid";
import { EmptyState } from "../components/shared/empty-state";
import { Skeleton } from "../components/ui/skeleton";
import { DynamicForm } from "../components/shared/dynamic-form";
import { useApi } from "../composables/useApi";
import { useMutation } from "../composables/useMutation";
import { donationService } from "../services/donationService";
import { buildFormFields } from "../utils/form";
import type {
  DonationCampaign,
  DonationCreatePayload,
  FormFieldConfig,
} from "../types";

export function DonationPage() {
  const [selectedCampaign, setSelectedCampaign] =
    useState<DonationCampaign | null>(null);
  const [donationForm, setDonationForm] = useState<DonationCreatePayload>({
    amount: 0,
  });
  const { pushToast } = useToast();
  const campaignsFetcher = useCallback(
    () => donationService.listCampaigns(false),
    [],
  );
  const { data: campaigns = [], loading, error } = useApi(campaignsFetcher);
  const donateMutation = useMutation(async (payload: DonationCreatePayload) => {
    if (!selectedCampaign) throw new Error("Campaign not selected");
    return donationService.donate(selectedCampaign.id, payload);
  });

  const donationFields = useMemo<FormFieldConfig[]>(() => {
    return buildFormFields(
      { amount: donationForm.amount },
      {
        amount: {
          label: "Donation Amount (IDR)",
          type: "number",
          placeholder: "Donation amount (IDR)",
        },
      },
    );
  }, [donationForm.amount]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const result = await donateMutation.mutate(donationForm);
      pushToast("Donation intent submitted successfully.");
      setSelectedCampaign(null);
      if (result.checkout_url) {
        window.open(result.checkout_url, "_blank");
      }
    } catch {
      pushToast("Please review donation details.", "info");
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Donation Campaigns"
        description="Transparent progress tracking and targeted emergency funding."
      />
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={`campaign-${index}`} className="h-64 w-full" />
          ))}
        </div>
      ) : error ? (
        <EmptyState title="Failed to load campaigns" message={error} />
      ) : campaigns.length === 0 ? (
        <EmptyState
          title="No campaigns"
          message="Donation campaigns will appear once published by admins."
        />
      ) : (
        <CampaignGrid campaigns={campaigns} onDonate={setSelectedCampaign} />
      )}

      <Modal
        open={Boolean(selectedCampaign)}
        onOpenChange={(open) => {
          if (!open) setSelectedCampaign(null);
        }}
        title={`Donate to ${selectedCampaign?.title ?? "Campaign"}`}
        description="Payment flow placeholder for Xendit integration."
      >
        <DynamicForm
          fields={donationFields}
          values={donationForm}
          onChange={(name, value) =>
            setDonationForm((prev) => ({ ...prev, [name]: value }))
          }
          onSubmit={handleSubmit}
          errors={donateMutation.validationErrors}
          disabled={donateMutation.loading}
          actions={
            <Button
              className="w-full"
              type="submit"
              disabled={donateMutation.loading}
            >
              {donateMutation.loading ? "Processing..." : "Proceed to Payment"}
            </Button>
          }
        />
      </Modal>
    </div>
  );
}
