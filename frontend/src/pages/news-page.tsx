import { motion } from "framer-motion";
import { PageHeader } from "../components/shared/page-header";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { CommentThread } from "../fragments/news/comment-thread";
import { FeaturedArticle } from "../fragments/news/featured-article";
import { newsList } from "../services/mock-data";

export function NewsPage() {
  const nonFeatured = newsList.filter((item) => !item.featured);
  return (
    <div className="space-y-4">
      <PageHeader
        title="Disaster News"
        description="Curated updates, regional insights, and community-driven discussions."
      />
      <FeaturedArticle />
      <div className="grid gap-4 md:grid-cols-2">
        {nonFeatured.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <Card>
              <Badge>{article.category}</Badge>
              <h3 className="mt-2 font-semibold">{article.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{article.excerpt}</p>
              <p className="mt-2 text-xs text-muted-foreground">{article.publishedAt}</p>
            </Card>
          </motion.div>
        ))}
      </div>
      <CommentThread />
    </div>
  );
}
