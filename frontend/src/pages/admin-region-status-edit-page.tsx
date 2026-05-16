import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../components/shared/page-header";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Select } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { useApi } from "../composables/useApi";
import { useLocationData } from "../hooks/useLocationData";
import { useToast } from "../components/ui/toast";
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

function getOptionValueByLabel(options: FieldOption[], label?: string | null) {
  if (!label) return "";
  return (
    options.find((option) => option.label === label)?.value?.toString() ?? ""
  );
}

function getOptionLabelByValue(options: FieldOption[], value: string) {
  return (
    options.find((option) => String(option.value) === value)?.label ?? value
  );
}

export function AdminRegionStatusEditPage() {
  const { id } = useParams();
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

  const fetcher = useCallback(() => regionService.detail(Number(id)), [id]);

  const { data, loading, error } = useApi(fetcher, {
    immediate: Boolean(id),
  });

  const [form, setForm] = useState<RegionFormValues>({
    provinsi: "",
    kota: "",
    kecamatan: "",
    kelurahan: "",
    status: "aman",
    description: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!data || provinces.length === 0) return;

    let cancelled = false;

    const hydrateForm = async () => {
      const provinsiCode = getOptionValueByLabel(provinces, data.provinsi);
      const regencyOptions = provinsiCode
        ? await fetchRegencies(provinsiCode)
        : [];
      const kotaCode = getOptionValueByLabel(regencyOptions, data.kota);
      const districtOptions = kotaCode ? await fetchDistricts(kotaCode) : [];
      const kecamatanCode = getOptionValueByLabel(
        districtOptions,
        data.kecamatan,
      );
      const villageOptions = kecamatanCode
        ? await fetchVillages(kecamatanCode)
        : [];
      const kelurahanCode = getOptionValueByLabel(
        villageOptions,
        data.kelurahan,
      );

      if (cancelled) return;

      setForm({
        provinsi: provinsiCode,
        kota: kotaCode,
        kecamatan: kecamatanCode,
        kelurahan: kelurahanCode,
        status: data.status || "aman",
        description: data.description || "",
      });
    };

    void hydrateForm();

    return () => {
      cancelled = true;
    };
  }, [data, provinces, fetchRegencies, fetchDistricts, fetchVillages]);

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
    if (!id) return;
    setSaving(true);
    try {
      await regionService.update(Number(id), {
        provinsi: getOptionLabelByValue(provinces, form.provinsi),
        kota: getOptionLabelByValue(regencies, form.kota),
        kecamatan: getOptionLabelByValue(districts, form.kecamatan),
        kelurahan: getOptionLabelByValue(villages, form.kelurahan),
        status: form.status,
        description: form.description,
      });
      pushToast("Region updated.");
      navigate("/admin/regions");
    } catch {
      pushToast("Failed to update region.", "info");
    } finally {
      setSaving(false);
    }
  }, [id, form, navigate, pushToast]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Edit Region Status"
        description={`Edit region ${id}`}
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

export default AdminRegionStatusEditPage;
