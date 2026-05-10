import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { navIconMap } from "../components/shared/nav-icons";
import { ThemeToggle } from "../components/shared/theme-toggle";
import { appNavigation } from "../constants/navigation";
import { Button } from "../components/ui/button";
import { cn } from "../utils/cn";

function AppNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="space-y-1">
      {appNavigation.map((item) => {
        const Icon = navIconMap[item.icon];
        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground",
                isActive && "bg-primary/10 text-primary",
              )
            }
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}

export function AppShellLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-[1600px] gap-4 p-4">
        <aside className="glass hidden w-72 rounded-2xl border border-border/60 p-4 shadow-soft lg:block">
          <p className="mb-4 text-lg font-semibold">
            Jogo<span className="text-primary">Jagad</span>
          </p>
          <AppNav />
        </aside>

        <section className="min-w-0 flex-1">
          <header className="mb-4 flex items-center justify-between rounded-2xl border border-border/70 bg-card/75 p-3 backdrop-blur">
            <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setOpen(true)}>
              <Menu className="h-4 w-4" />
            </Button>
            <p className="hidden text-sm text-muted-foreground sm:block">
              Real-time disaster intelligence & response cockpit
            </p>
            <ThemeToggle />
          </header>
          <Outlet />
        </section>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 lg:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="h-full w-72 bg-card p-4 shadow-soft"
              onClick={(event) => event.stopPropagation()}
            >
              <p className="mb-4 text-lg font-semibold">
                Jogo<span className="text-primary">Jagad</span>
              </p>
              <AppNav onNavigate={() => setOpen(false)} />
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
