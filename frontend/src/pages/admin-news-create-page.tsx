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

interface NewsFormState {
  title: string;
  category: string;
  content: string;
  thumbnail: File | null;
}

const emptyForm: NewsFormState = {
  title: "",
  category: "",
  content: "",
  thumbnail: null,
};

export function AdminNewsCreatePage() {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const [form, setForm] = useState<NewsFormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    if (!form.thumbnail) {
      pushToast("Please choose an image.", "info");
      return;
    }

    setSaving(true);
    try {
      await newsService.create({
        title: form.title.trim(),
        category: form.category.trim(),
        content: form.content.trim(),
        thumbnail: form.thumbnail,
      });
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
                    thumbnail: e.target.files?.[0] ?? null,
                  }))
                }
              />
              <div className="space-y-2">
                <p className="font-medium">
                  {form.thumbnail ? form.thumbnail.name : "Choose an image"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Click to upload the news cover image.
                </p>
              </div>
            </label>
          </div>

          {form.thumbnail ? (
            <div className="rounded-2xl border border-border bg-muted/20 p-3 text-xs text-muted-foreground">
              Selected image:{" "}
              <span className="font-medium text-foreground">
                {form.thumbnail.name}
              </span>
            </div>
          ) : null}
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
