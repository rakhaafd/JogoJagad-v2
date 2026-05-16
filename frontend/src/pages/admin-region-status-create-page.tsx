import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/shared/page-header";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Select } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../components/ui/toast";
import { useLocationData } from "../hooks/useLocationData";
import { regionService } from "../services/regionService";
import type { FieldOption } from "../types";
import type { RegionPayload } from "../types";

type RegionFormValues = {
  provinsi: string;
  kota: string;
  kecamatan: string;
  kelurahan: string;
  status: RegionPayload["status"];
  description: string;
};

const emptyForm: RegionFormValues = {
  provinsi: "",
  kota: "",
  kecamatan: "",
  kelurahan: "",
  status: "aman",
  description: "",
};

function getOptionLabelByValue(options: FieldOption[], value: string) {
  return (
    options.find((option) => String(option.value) === value)?.label ?? value
  );
}

export function AdminRegionStatusCreatePage() {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const {
    provinces,
    regencies,
    districts,
    villages,
    fetchRegencies,
    fetchDistricts,
    fetchVillages,
  } = useLocationData();
  const [form, setForm] = useState<RegionFormValues>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void fetchRegencies(form.provinsi);
  }, [form.provinsi, fetchRegencies]);

  useEffect(() => {
    void fetchDistricts(form.kota);
  }, [form.kota, fetchDistricts]);

  useEffect(() => {
    void fetchVillages(form.kecamatan);
  }, [form.kecamatan, fetchVillages]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const payload: RegionPayload = {
        provinsi: getOptionLabelByValue(provinces, form.provinsi),
        kota: getOptionLabelByValue(regencies, form.kota),
        kecamatan: getOptionLabelByValue(districts, form.kecamatan),
        kelurahan: getOptionLabelByValue(villages, form.kelurahan),
        status: form.status,
        description: form.description,
      };

      await regionService.create(payload);
      pushToast("Region created.");
      navigate("/admin/regions");
    } catch {
      pushToast("Failed to create region.", "info");
    } finally {
      setSaving(false);
    }
  }, [form, navigate, pushToast]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Add Region Status"
        description="Create a new region status entry."
      />
      <Card>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium">
              <span>Provinsi</span>
              <Select
                value={form.provinsi}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    provinsi: e.target.value,
                    kota: "",
                    kecamatan: "",
                    kelurahan: "",
                  }))
                }
              >
                <option value="">Select Province</option>
                {provinces.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </label>
            <label className="space-y-2 text-sm font-medium">
              <span>Kota</span>
              <Select
                value={form.kota}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    kota: e.target.value,
                    kecamatan: "",
                    kelurahan: "",
                  }))
                }
                disabled={!form.provinsi}
              >
                <option value="">Select Kabupaten/Kota</option>
                {regencies.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </label>
            <label className="space-y-2 text-sm font-medium">
              <span>Kecamatan</span>
              <Select
                value={form.kecamatan}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    kecamatan: e.target.value,
                    kelurahan: "",
                  }))
                }
                disabled={!form.kota}
              >
                <option value="">Select Kecamatan</option>
                {districts.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </label>
            <label className="space-y-2 text-sm font-medium">
              <span>Kelurahan</span>
              <Select
                value={form.kelurahan}
                onChange={(e) =>
                  setForm((p) => ({ ...p, kelurahan: e.target.value }))
                }
                disabled={!form.kecamatan}
              >
                <option value="">Select Kelurahan</option>
                {villages.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium">
              <span>Status</span>
              <Select
                value={form.status}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    status: e.target.value as RegionPayload["status"],
                  }))
                }
              >
                <option value="aman">Aman</option>
                <option value="waspada">Waspada</option>
                <option value="bahaya">Bahaya</option>
              </Select>
            </label>
          </div>

          <label className="space-y-2 text-sm font-medium">
            <span>Description</span>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Description"
              rows={4}
            />
          </label>

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

export default AdminRegionStatusCreatePage;
