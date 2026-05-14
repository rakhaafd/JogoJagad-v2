import { motion } from "framer-motion";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "../components/shared/page-header";
import { Card } from "../components/ui/card";
import { EmptyState } from "../components/shared/empty-state";
import { Skeleton } from "../components/ui/skeleton";
import { useApi } from "../composables/useApi";
import { newsService } from "../services/newsService";

export function NewsDetailPage() {
  const { id } = useParams();

  const fetcher = useCallback(() => {
    if (!id) return Promise.reject(new Error("Missing id"));
    return newsService.detail(Number(id));
  }, [id]);

  const { data: news, loading, error } = useApi(fetcher);

  return (
    <div className="space-y-4">
      <PageHeader
        title={news?.title ?? "News Detail"}
        description="Detailed news article"
      />

      {loading ? (
        <Card className="space-y-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-full" />
        </Card>
      ) : error ? (
        <EmptyState title="Failed to load article" message={String(error)} />
      ) : news ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold">{news.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  By {news.author?.name ?? "Unknown"} ·{" "}
                  {new Date(news.created_at).toLocaleString("id-ID")}
                </p>
              </div>
            </div>
            <div className="mt-4 prose max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap">{news.content}</div>
            </div>
          </Card>

          {/* Community discussion removed */}
        </motion.div>
      ) : null}
    </div>
  );
}
