import { RefreshCw } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/shared/page-header";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../components/ui/toast";
import { newsService } from "../services/newsService";
import type { NewsUpsertPayload } from "../types";

const emptyForm: NewsUpsertPayload = {
  title: "",
  category: "",
  content: "",
};

export function AdminNewsCreatePage() {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const [form, setForm] = useState<NewsUpsertPayload>(emptyForm);
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await newsService.create(form);
      pushToast("News created.");
      navigate("/admin/news");
    } catch {
      pushToast("Failed to create news.", "info");
    } finally {
      setSaving(false);
    }
  }, [form, navigate, pushToast]);

  return (
    <div className="space-y-4">
      <PageHeader title="Add News" description="Create a new news item." />
      <Card>
        <div className="space-y-4">
          <label className="space-y-2 text-sm font-medium">
            <span>Title</span>
            <Input
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="Title"
            />
          </label>
          <label className="space-y-2 text-sm font-medium">
            <span>Category</span>
            <Input
              value={form.category}
              onChange={(e) =>
                setForm((p) => ({ ...p, category: e.target.value }))
              }
              placeholder="Category"
            />
          </label>
          <label className="space-y-2 text-sm font-medium">
            <span>Content</span>
            <Textarea
              value={form.content}
              onChange={(e) =>
                setForm((p) => ({ ...p, content: e.target.value }))
              }
              placeholder="Content"
              rows={5}
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

export default AdminNewsCreatePage;
