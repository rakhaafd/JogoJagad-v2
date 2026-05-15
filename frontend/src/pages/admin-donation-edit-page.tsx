import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../components/shared/page-header";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { useApi } from "../composables/useApi";
import { useToast } from "../components/ui/toast";
import { donationService } from "../services/donationService";
import type { DonationCampaignUpsertPayload } from "../types";

interface DonationCampaignFormState {
  title: string;
  description: string;
  target_amount: string;
  image: File | null;
  currentImagePath: string | null;
}

export function AdminDonationEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pushToast } = useToast();

  const fetcher = useCallback(
    () =>
      id
        ? donationService.campaignDetail(Number(id), true)
        : Promise.reject(new Error("Missing id")),
    [id],
  );

  const { data, loading, error } = useApi(fetcher, {
    immediate: Boolean(id),
  });

  const [form, setForm] = useState<DonationCampaignFormState>({
    title: "",
    description: "",
    target_amount: "",
    image: null,
    currentImagePath: null,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      Promise.resolve().then(() => {
        setForm({
          title: data.title || "",
          description: data.description || "",
          target_amount: String(data.target_amount ?? ""),
          image: null,
          currentImagePath: data.image_path ?? null,
        });
      });
    }
  }, [data]);

  const handleSave = useCallback(async () => {
    if (!id) return;

    const targetAmount = Number(form.target_amount);
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !Number.isFinite(targetAmount) ||
      targetAmount <= 0
    ) {
      pushToast("Please fill all fields correctly.", "info");
      return;
    }

    setSaving(true);
    try {
      const payload: DonationCampaignUpsertPayload = {
        title: form.title.trim(),
        description: form.description.trim(),
        target_amount: targetAmount,
      };

      if (form.image) {
        payload.image = form.image;
      }

      await donationService.updateCampaign(Number(id), payload);
      pushToast("Donation campaign updated.");
      navigate("/admin/donations");
    } catch {
      pushToast("Failed to update donation campaign.", "info");
    } finally {
      setSaving(false);
    }
  }, [form, id, navigate, pushToast]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Edit Donation Campaign"
        description={`Edit donation campaign ${id}`}
      />

      <Card>
        <div className="space-y-4">
          <label className="space-y-2 text-sm font-medium">
            <span>Title</span>
            <Input
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="Campaign title"
            />
          </label>

          <label className="space-y-2 text-sm font-medium">
            <span>Description</span>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Campaign description"
              rows={5}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium">
              <span>Target Amount</span>
              <Input
                type="number"
                min="0"
                value={form.target_amount}
                onChange={(e) =>
                  setForm((p) => ({ ...p, target_amount: e.target.value }))
                }
                placeholder="20000000"
              />
            </label>

            <div className="space-y-2 text-sm font-medium">
              <span>Image</span>
              <label className="block cursor-pointer rounded-2xl border border-dashed border-border bg-muted/20 p-4 transition hover:border-primary/50 hover:bg-muted/40">
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      image: e.target.files?.[0] ?? null,
                    }))
                  }
                />
                <div className="space-y-2">
                  <p className="font-medium">
                    {form.image ? form.image.name : "Choose an image"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Click to replace the campaign cover image.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-2 text-xs text-muted-foreground">
            {form.image ? (
              <div className="rounded-2xl border border-border bg-muted/20 p-3">
                Selected image:{" "}
                <span className="font-medium text-foreground">
                  {form.image.name}
                </span>
              </div>
            ) : form.currentImagePath ? (
              <div className="rounded-2xl border border-border bg-muted/20 p-3">
                Current image:{" "}
                <span className="break-all font-medium text-foreground">
                  {form.currentImagePath}
                </span>
              </div>
            ) : null}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button onClick={() => void handleSave()} disabled={saving}>
              {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Save"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default AdminDonationEditPage;
