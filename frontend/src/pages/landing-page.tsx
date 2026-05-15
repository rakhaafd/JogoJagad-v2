import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { HeroSection } from "../fragments/landing/hero-section";
import { StatsSection } from "../fragments/landing/stats-section";
import { MonitoringMap } from "../fragments/map/monitoring-map";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { EmptyState } from "../components/shared/empty-state";
import { Skeleton } from "../components/ui/skeleton";
import { useApi } from "../composables/useApi";
import { useAuth } from "../hooks/useAuth";
import { newsService } from "../services/newsService";
import { disasterService } from "../services/disasterService";

export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: newsData, loading: newsLoading } = useApi(newsService.list);
  const {
    data: regionsData,
    loading: regionsLoading,
    error: regionsError,
  } = useApi(disasterService.regions);

  const news = Array.isArray(newsData) ? newsData : [];
  const regions = Array.isArray(regionsData) ? regionsData : [];
  const validNews = news.filter(
    (article) =>
      article && article.content && typeof article.content === "string",
  );
  const highlightNews = validNews.slice(0, 3);

  const handleProtectedNavigation = (path: string) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate(path);
  };

  const formatContent = (content: string, maxLength = 110) => {
    if (!content || typeof content !== "string") {
      return "Content not available";
    }
    if (content.length <= maxLength) {
      return content;
    }
    return `${content.slice(0, maxLength)}...`;
  };

  if (newsLoading || regionsLoading) {
    return (
      <div className="space-y-8 pb-8">
        <HeroSection />
        <StatsSection />

        <section className="relative isolate space-y-4">
          {" "}
          {/* ← Tambah relative isolate */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Real-time Monitoring Preview
            </h2>
            <div className="text-sm font-medium text-primary">
              Open Fullscreen Map
            </div>
          </div>
          <div className="relative z-0">
            {" "}
            {/* ← Tambah wrapper z-0 */}
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-[200px] w-full rounded-lg" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Latest Disaster News</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={`loading-skeleton-${index}`} className="space-y-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </Card>
            ))}
          </div>
        </section>

        <footer className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} JogoJagad · Smart disaster management for
          resilient communities.
        </footer>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      <HeroSection />
      <StatsSection />

      {/* Map Section - Fixed z-index issue */}
      <section className="relative isolate space-y-4">
        {" "}
        {/* ← Tambah relative isolate */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            Real-time Monitoring Preview
          </h2>
          <button
            onClick={() => handleProtectedNavigation("/map")}
            className="text-sm font-medium text-primary transition hover:text-primary/80"
          >
            Open Fullscreen Map
          </button>
        </div>
        {/* Wrapper dengan z-index rendah */}
        <div className="relative z-0">
          <MonitoringMap
            compact
            regions={regions}
            loading={regionsLoading}
            error={regionsError}
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-primary/15 to-card relative z-0">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" /> AI Ask & Quiz
          </div>
          <h3 className="mt-2 text-2xl font-semibold">
            Improve preparedness with interactive learning.
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Engage with adaptive AI guidance and gamified quiz modules.
          </p>
          <button
            onClick={() => handleProtectedNavigation("/ai-quiz")}
            className="mt-4 inline-block"
          >
            <Button variant="outline" className="gap-2">
              Start Learning <ArrowRight className="h-4 w-4" />
            </Button>
          </button>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-card relative z-0">
          <Badge tone="safe">Donation & Impact</Badge>
          <h3 className="mt-2 text-2xl font-semibold">
            Fund rapid response campaigns transparently.
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Track campaign progress and direct support to active disaster zones.
          </p>
          <button
            onClick={() => handleProtectedNavigation("/donation")}
            className="mt-4 inline-block"
          >
            <Button>Explore Campaigns</Button>
          </button>
        </Card>
      </section>

      <section className="space-y-4 relative z-0">
        <h2 className="text-2xl font-semibold">Latest Disaster News</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {!isAuthenticated ? (
            <div className="md:col-span-3">
              <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card text-center">
                <h3 className="text-lg font-semibold">
                  Stay Updated with News
                </h3>
                <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                  To view the news, please sign in first
                </p>
                <button
                  onClick={() => handleProtectedNavigation("/news")}
                  className="mt-4"
                >
                  <Button>View News</Button>
                </button>
              </div>
            </div>
          ) : highlightNews.length === 0 ? (
            <div className="md:col-span-3">
              <EmptyState
                title="No news yet"
                message="Disaster updates will appear here once published."
              />
            </div>
          ) : (
            highlightNews.map((article, index) => (
              <motion.div
                key={article.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Card>
                  <Badge>{article.category || "General"}</Badge>
                  <h3 className="mt-3 font-semibold">
                    {article.title || "Untitled"}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {formatContent(article.content)}
                  </p>
                  {article.created_at && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(article.created_at).toLocaleDateString()}
                    </p>
                  )}
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </section>

      <footer className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground relative z-0">
        © {new Date().getFullYear()} JogoJagad · Smart disaster management for
        resilient communities.
      </footer>
    </div>
  );
}
