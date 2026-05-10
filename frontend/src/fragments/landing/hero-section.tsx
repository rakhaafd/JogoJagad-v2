import { motion } from "framer-motion";
import { ArrowRight, Bell, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";

export function HeroSection() {
  return (
    <section className="grid gap-6 pb-6 pt-4 lg:grid-cols-[1.1fr_0.9fr]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-border/70 bg-hero-grid p-6 shadow-soft sm:p-9"
      >
        <p className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          Smart Disaster Management Platform
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
          Protecting communities with real-time intelligence and coordinated action.
        </h1>
        <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
          JogoJagad unifies disaster monitoring, automatic notifications, donation operations,
          AI-assisted education, and preventive community programs in one premium control center.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/dashboard">
            <Button className="gap-2">
              Open Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/map">
            <Button variant="outline">View Live Map</Button>
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-4"
      >
        <Card glass>
          <div className="flex items-start gap-3">
            <span className="rounded-xl bg-warning/20 p-2 text-warning">
              <Bell className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-semibold">Automatic Domicile Alerts</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Personalized warnings with critical severity context and evacuation guidance.
              </p>
            </div>
          </div>
        </Card>
        <Card glass>
          <div className="flex items-start gap-3">
            <span className="rounded-xl bg-safe/20 p-2 text-safe">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-semibold">Trusted by Response Teams</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Designed for public agencies, volunteers, and local communities.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </section>
  );
}
