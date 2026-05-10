import { Heart, MessageCircle } from "lucide-react";
import { newsList } from "../../services/mock-data";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";

const featured = newsList.find((item) => item.featured) ?? newsList[0];

export function FeaturedArticle() {
  return (
    <Card className="bg-gradient-to-br from-primary/10 to-card">
      <Badge>{featured.category}</Badge>
      <h2 className="mt-3 text-2xl font-semibold">{featured.title}</h2>
      <p className="mt-3 max-w-3xl text-muted-foreground">{featured.excerpt}</p>
      <div className="mt-5 flex items-center gap-4 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Heart className="h-4 w-4" /> {featured.likes}
        </span>
        <span className="inline-flex items-center gap-1">
          <MessageCircle className="h-4 w-4" /> {featured.comments}
        </span>
        <span>{featured.publishedAt}</span>
      </div>
    </Card>
  );
}
