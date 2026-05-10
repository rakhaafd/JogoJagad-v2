import { ShieldAlert } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-hero-grid p-10 md:block">
        <div className="glass absolute inset-6 rounded-3xl border border-white/20" />
        <div className="relative z-10 flex h-full flex-col justify-between">
          <div>
            <p className="text-2xl font-semibold">
              Jogo<span className="text-primary">Jagad</span>
            </p>
            <p className="mt-3 max-w-md text-muted-foreground">
              Smart disaster management platform for early warning, coordinated response, and
              resilient communities.
            </p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/80 p-5">
            <ShieldAlert className="h-8 w-8 text-primary" />
            <p className="mt-3 text-sm font-medium">
              Government-grade reliability with startup-level speed.
            </p>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 inline-block text-sm text-muted-foreground hover:text-foreground">
            ← Back to home
          </Link>
          <Outlet />
        </div>
      </section>
    </div>
  );
}
