import { useState } from "react";
import { PageHeader } from "../components/shared/page-header";
import { Button } from "../components/ui/button";
import { FormField } from "../components/ui/form-field";
import { Input } from "../components/ui/input";
import { Modal } from "../components/ui/modal";
import { useToast } from "../components/ui/toast";
import { CampaignGrid } from "../fragments/donation/campaign-grid";
import { campaigns } from "../services/mock-data";
import type { DonationCampaign } from "../types";

export function DonationPage() {
  const [selectedCampaign, setSelectedCampaign] = useState<DonationCampaign | null>(null);
  const { pushToast } = useToast();

  return (
    <div className="space-y-4">
      <PageHeader
        title="Donation Campaigns"
        description="Transparent progress tracking and targeted emergency funding."
      />
      <CampaignGrid campaigns={campaigns} onDonate={setSelectedCampaign} />

      <Modal
        open={Boolean(selectedCampaign)}
        onOpenChange={(open) => {
          if (!open) setSelectedCampaign(null);
        }}
        title={`Donate to ${selectedCampaign?.title ?? "Campaign"}`}
        description="Payment flow placeholder for Xendit integration."
      >
        <div className="space-y-3">
          <FormField label="Donation Amount (IDR)">
            <Input type="number" placeholder="Donation amount (IDR)" />
          </FormField>
          <Button
            className="w-full"
            onClick={() => {
              setSelectedCampaign(null);
              pushToast("Donation intent submitted successfully.");
            }}
          >
            Proceed to Payment
          </Button>
        </div>
      </Modal>
    </div>
  );
}
