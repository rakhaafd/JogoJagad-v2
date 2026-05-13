import { Heart, MessageCircle } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import type { NewsItem } from "../../types";
import { EmptyState } from "../../components/shared/empty-state";

interface FeaturedArticleProps {
  article?: NewsItem | null;
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  if (!article) {
    return (
      <EmptyState
        title="No featured article"
        message="Featured news will appear once published by admins."
      />
    );
  }

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-card">
      <Badge>{article.category}</Badge>
      <h2 className="mt-3 text-2xl font-semibold">{article.title}</h2>
      <p className="mt-3 max-w-3xl text-muted-foreground">{article.content}</p>
      <div className="mt-5 flex items-center gap-4 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Heart className="h-4 w-4" /> 0
        </span>
        <span className="inline-flex items-center gap-1">
          <MessageCircle className="h-4 w-4" /> 0
        </span>
        <span>{new Date(article.created_at).toLocaleDateString("id-ID")}</span>
      </div>
    </Card>
  );
}
