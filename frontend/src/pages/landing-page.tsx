import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { HeroSection } from "../fragments/landing/hero-section";
import { StatsSection } from "../fragments/landing/stats-section";
import { MonitoringMap } from "../fragments/map/monitoring-map";
import { newsList } from "../services/mock-data";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

export function LandingPage() {
  return (
    <div className="space-y-8 pb-8">
      <HeroSection />
      <StatsSection />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Real-time Monitoring Preview</h2>
          <Link to="/map" className="text-sm font-medium text-primary">
            Open Fullscreen Map
          </Link>
        </div>
        <MonitoringMap compact />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-primary/15 to-card">
          <p className="inline-flex items-center gap-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" /> AI Ask & Quiz
          </p>
          <h3 className="mt-2 text-2xl font-semibold">Improve preparedness with interactive learning.</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Engage with adaptive AI guidance and gamified quiz modules.
          </p>
          <Link to="/ai-quiz" className="mt-4 inline-block">
            <Button variant="outline" className="gap-2">
              Start Learning <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-card">
          <Badge tone="safe">Donation & Impact</Badge>
          <h3 className="mt-2 text-2xl font-semibold">Fund rapid response campaigns transparently.</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Track campaign progress and direct support to active disaster zones.
          </p>
          <Link to="/donation" className="mt-4 inline-block">
            <Button>Explore Campaigns</Button>
          </Link>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Latest Disaster News</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {newsList.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <Card>
                <Badge>{article.category}</Badge>
                <h3 className="mt-3 font-semibold">{article.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{article.excerpt}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
        © {new Date().getFullYear()} JogoJagad · Smart disaster management for resilient communities.
      </footer>
    </div>
  );
}
