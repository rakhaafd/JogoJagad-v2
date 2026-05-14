import { useState, type FormEvent } from "react";
import { PageHeader } from "../components/shared/page-header";
import { FormField } from "../components/ui/form-field";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useMutation } from "../composables/useMutation";
import { actionService } from "../services/actionService";
import { useToast } from "../components/ui/toast";
import type { ActionReport } from "../types";

interface HazardReportFormValues {
  title: string;
  action_type: string;
  description: string;
  photo: File | null;
}

const initialFormValues: HazardReportFormValues = {
  title: "",
  action_type: "",
  description: "",
  photo: null,
};

export function HazardReportPage() {
  const [formValues, setFormValues] =
    useState<HazardReportFormValues>(initialFormValues);
  const [submittedAction, setSubmittedAction] = useState<ActionReport | null>(
    null,
  );
  const { pushToast } = useToast();
  const mutation = useMutation(actionService.submit);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formValues.photo) {
      pushToast("Photo wajib diisi sebelum submit.", "info");
      return;
    }

    try {
      const action = await mutation.mutate({
        title: formValues.title,
        action_type: formValues.action_type,
        description: formValues.description,
        photo: formValues.photo,
      });

      setSubmittedAction(action);
      setFormValues(initialFormValues);
      pushToast("Hazard report berhasil dikirim.");
    } catch {
      pushToast(
        "Gagal mengirim hazard report. Cek input lalu coba lagi.",
        "info",
      );
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Report Hazard"
        description="Submit field situation update via endpoint POST /actions (multipart: title, action_type, description, photo)."
      />

      <Card className="space-y-4">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <FormField
            label="Title"
            hint={mutation.validationErrors?.title?.join(" ")}
            htmlFor="hazard-title"
          >
            <Input
              id="hazard-title"
              name="title"
              value={formValues.title}
              onChange={(event) =>
                setFormValues((prev) => ({
                  ...prev,
                  title: event.target.value,
                }))
              }
              placeholder="melakukan penanaman lahan gundul"
              disabled={mutation.loading}
            />
          </FormField>

          <FormField
            label="Action Type"
            hint={mutation.validationErrors?.action_type?.join(" ")}
            htmlFor="hazard-action-type"
          >
            <Input
              id="hazard-action-type"
              name="action_type"
              value={formValues.action_type}
              onChange={(event) =>
                setFormValues((prev) => ({
                  ...prev,
                  action_type: event.target.value,
                }))
              }
              placeholder="reboisasi"
              disabled={mutation.loading}
            />
          </FormField>

          <FormField
            label="Description"
            hint={mutation.validationErrors?.description?.join(" ")}
            htmlFor="hazard-description"
          >
            <Textarea
              id="hazard-description"
              name="description"
              value={formValues.description}
              onChange={(event) =>
                setFormValues((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              placeholder="Jelaskan kondisi lapangan dan aksi yang dilakukan."
              disabled={mutation.loading}
            />
          </FormField>

          <FormField
            label="Photo"
            hint={
              mutation.validationErrors?.photo?.join(" ") ??
              "Maksimal 5MB (jpg, jpeg, png, webp)."
            }
            htmlFor="hazard-photo"
          >
            <input
              id="hazard-photo"
              name="photo"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) =>
                setFormValues((prev) => ({
                  ...prev,
                  photo: event.target.files?.[0] ?? null,
                }))
              }
              disabled={mutation.loading}
            />
            <div className="rounded-xl border border-border bg-card p-3">
              <div className="flex flex-wrap items-center gap-2">
                <label
                  htmlFor="hazard-photo"
                  className="inline-flex h-9 cursor-pointer items-center rounded-lg border border-border bg-muted/20 px-3 text-sm font-medium transition hover:bg-muted"
                >
                  {formValues.photo ? "Ganti Foto" : "Pilih Foto"}
                </label>
                {formValues.photo ? (
                  <button
                    type="button"
                    className="inline-flex h-9 items-center rounded-lg border border-border px-3 text-sm text-muted-foreground transition hover:bg-muted"
                    onClick={() =>
                      setFormValues((prev) => ({ ...prev, photo: null }))
                    }
                    disabled={mutation.loading}
                  >
                    Hapus
                  </button>
                ) : null}
              </div>
              <p className="mt-2 truncate text-sm text-muted-foreground">
                {formValues.photo
                  ? `${formValues.photo.name} (${(
                      formValues.photo.size /
                      1024 /
                      1024
                    ).toFixed(2)} MB)`
                  : "Belum ada file dipilih"}
              </p>
            </div>
          </FormField>

          <Button type="submit" className="w-full" disabled={mutation.loading}>
            {mutation.loading ? "Submitting..." : "Submit Hazard Report"}
          </Button>
        </form>
        {mutation.error ? (
          <p className="text-sm text-danger">{mutation.error}</p>
        ) : null}
      </Card>
    </div>
  );
}
