import { ShieldAlert } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Left Section - Visual & Brand */}
      <section className="relative hidden overflow-hidden md:flex md:flex-col md:items-center md:justify-center p-12 bg-[url('/indonesia.png')] bg-cover bg-center">
        {/* Refined glass overlay */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-8 rounded-3xl border border-white/10 backdrop-blur-sm" />

        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Brand Section */}
          <div className="space-y-3">
            <p className="text-3xl font-bold tracking-tight">
              Jogo<span className="text-primary">Jagad</span>
            </p>
            <p className="text-sm leading-relaxed text-white/70 max-w-xs">
              Disaster management platform built for resilient communities.
            </p>
          </div>

          {/* Feature Card */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <ShieldAlert className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">
                  Enterprise Security
                </p>
                <p className="text-xs text-white/60 leading-relaxed">
                  Government-grade reliability with modern infrastructure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Section - Auth Form */}
      <section className="flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="mb-8 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Authentication
            </p>
            <h1 className="text-2xl font-bold">Sign In</h1>
          </div>

          {/* Form Outlet */}
          <Outlet />

          {/* Footer Link */}
          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <span>←</span>
            <span>Back to home</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
