import { RefreshCw } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/shared/page-header";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../components/ui/toast";
import { regionService } from "../services/regionService";
import type { RegionPayload } from "../types";

const emptyForm: RegionPayload = {
  provinsi: "",
  kota: "",
  kecamatan: "",
  kelurahan: "",
  status: "aman",
  description: "",
};

export function AdminRegionStatusCreatePage() {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const [form, setForm] = useState<RegionPayload>(emptyForm);
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await regionService.create(form);
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
              <Input
                value={form.provinsi}
                onChange={(e) =>
                  setForm((p) => ({ ...p, provinsi: e.target.value }))
                }
                placeholder="Provinsi"
              />
            </label>
            <label className="space-y-2 text-sm font-medium">
              <span>Kota</span>
              <Input
                value={form.kota}
                onChange={(e) =>
                  setForm((p) => ({ ...p, kota: e.target.value }))
                }
                placeholder="Kota"
              />
            </label>
            <label className="space-y-2 text-sm font-medium">
              <span>Kecamatan</span>
              <Input
                value={form.kecamatan}
                onChange={(e) =>
                  setForm((p) => ({ ...p, kecamatan: e.target.value }))
                }
                placeholder="Kecamatan"
              />
            </label>
            <label className="space-y-2 text-sm font-medium">
              <span>Kelurahan</span>
              <Input
                value={form.kelurahan}
                onChange={(e) =>
                  setForm((p) => ({ ...p, kelurahan: e.target.value }))
                }
                placeholder="Kelurahan"
              />
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
