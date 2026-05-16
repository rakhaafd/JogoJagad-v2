import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/shared/page-header";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
// CommentThread removed — community discussion disabled
import { FeaturedArticle } from "../fragments/news/featured-article";
import { EmptyState } from "../components/shared/empty-state";
import { Skeleton } from "../components/ui/skeleton";
import { useApi } from "../composables/useApi";
import { newsService } from "../services/newsService";
import { getStorageUrl } from "../utils/storage";

export function NewsPage() {
  const { data: news = [], loading, error } = useApi(newsService.list);
  const featured = news[0] ?? null;
  const nonFeatured = news.slice(1);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Disaster News"
        description="Curated updates, regional insights, and community-driven discussions."
      />
      {loading ? (
        <Card className="space-y-3">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3" />
        </Card>
      ) : error ? (
        <EmptyState title="Failed to load news" message={error} />
      ) : (
        <FeaturedArticle article={featured} />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Card key={`news-card-${index}`} className="space-y-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </Card>
            ))
          : nonFeatured.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Link to={`/news/${article.id}`} className="block">
                  <Card>
                    {article.thumbnail_path ? (
                      <div className="h-40 w-full overflow-hidden rounded-md">
                        <img
                          src={getStorageUrl(article.thumbnail_path)}
                          alt={article.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : null}
                    <div className="mt-3">
                      <Badge>{article.category}</Badge>
                      <h3 className="mt-2 font-semibold">{article.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {article.content.slice(0, 120)}...
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {new Date(article.created_at).toLocaleDateString(
                          "id-ID",
                        )}
                      </p>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
      </div>
    </div>
  );
}
