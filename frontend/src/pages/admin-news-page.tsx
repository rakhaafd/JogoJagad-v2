import { motion } from "framer-motion";
import { Edit2, RefreshCw, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/shared/page-header";
import { EmptyState } from "../components/shared/empty-state";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { useToast } from "../components/ui/toast";
import { useApi } from "../composables/useApi";
import type { NewsItem } from "../types";
import { newsService } from "../services/newsService";

export function AdminNewsPage() {
  const { pushToast } = useToast();
  const { data: newsData, loading, error, refetch } = useApi(newsService.list);
  const news = newsData ?? [];

  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const openEditorPage = useCallback(
    async (item?: NewsItem) => {
      if (item) {
        navigate(`/admin/news/${item.id}/edit`);
      } else {
        navigate("/admin/news/create");
      }
    },
    [navigate],
  );

  const handleDelete = useCallback(
    async (id: number) => {
      const confirmed = window.confirm("Delete this news item?");
      if (!confirmed) return;
      setDeletingId(id);
      try {
        await newsService.remove(id);
        pushToast("News deleted.");
        await refetch();
      } catch {
        pushToast("Failed to delete news.", "info");
      } finally {
        setDeletingId(null);
      }
    },
    [pushToast, refetch],
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="News Management"
        description="Kelola berita: buat, edit, dan hapus konten yang tampil di publik."
        action={
          <Button variant="default" onClick={() => openEditorPage()}>
            Add News
          </Button>
        }
      />

      <Card>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : error ? (
          <EmptyState title="Failed to load news" message={error} />
        ) : news.length === 0 ? (
          <EmptyState title="No news" message="No news found." />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border text-sm">
                <thead className="bg-muted/60 text-left text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Title</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {news.map((item, idx) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="hover:bg-muted/50"
                    >
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">
                            ID #{item.id}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">{item.category}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(item.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => void openEditorPage(item)}
                          >
                            <Edit2 className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => void handleDelete(item.id)}
                            disabled={deletingId === item.id}
                          >
                            {deletingId === item.id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            Delete
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>

      {/* Navigation to create/edit pages handled via buttons above */}
    </div>
  );
}

export default AdminNewsPage;
