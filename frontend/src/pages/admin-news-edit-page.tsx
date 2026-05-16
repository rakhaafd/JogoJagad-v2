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
import { newsService } from "../services/newsService";
import type { NewsUpsertPayload } from "../types";

interface NewsFormState {
  title: string;
  category: string;
  content: string;
  thumbnail: File | null;
  currentThumbnailPath: string | null;
}

export function AdminNewsEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pushToast } = useToast();

  const fetcher = useCallback(() => newsService.detail(Number(id)), [id]);

  const { data, loading, error } = useApi(fetcher, {
    immediate: Boolean(id),
  });

  const [form, setForm] = useState<NewsFormState>({
    title: "",
    category: "",
    content: "",
    thumbnail: null,
    currentThumbnailPath: null,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      Promise.resolve().then(() => {
        setForm({
          title: data.title || "",
          category: data.category || "",
          content: data.content || "",
          thumbnail: null,
          currentThumbnailPath: data.thumbnail_path || null,
        });
      });
    }
  }, [data]);

  const handleSave = useCallback(async () => {
    if (!id) return;
    setSaving(true);
    try {
      const payload: NewsUpsertPayload = {
        title: form.title.trim(),
        category: form.category.trim(),
        content: form.content.trim(),
      };

      if (form.thumbnail) {
        payload.thumbnail = form.thumbnail;
      }

      await newsService.update(Number(id), payload);
      pushToast("News updated.");
      navigate("/admin/news");
    } catch {
      pushToast("Failed to update news.", "info");
    } finally {
      setSaving(false);
    }
  }, [id, form, navigate, pushToast]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="space-y-4">
      <PageHeader title="Edit News" description={`Edit news ${id}`} />
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
                  Click to replace the news cover image.
                </p>
              </div>
            </label>
          </div>

          <div className="space-y-2 text-xs text-muted-foreground">
            {form.thumbnail ? (
              <div className="rounded-2xl border border-border bg-muted/20 p-3">
                Selected image:{" "}
                <span className="font-medium text-foreground">
                  {form.thumbnail.name}
                </span>
              </div>
            ) : form.currentThumbnailPath ? (
              <div className="rounded-2xl border border-border bg-muted/20 p-3">
                Current image:{" "}
                <span className="break-all font-medium text-foreground">
                  {form.currentThumbnailPath}
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

export default AdminNewsEditPage;
