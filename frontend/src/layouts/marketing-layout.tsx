import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { publicNavigation } from "../constants/navigation";
import { Button } from "../components/ui/button";
import { ThemeToggle } from "../components/shared/theme-toggle";
import { cn } from "../utils/cn";

export function MarketingLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur"> {/* ← Ubah z-40 ke z-50 */}
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            Jogo<span className="text-primary">Jagad</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {publicNavigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground",
                    isActive && "bg-muted text-foreground",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/login" className="hidden sm:block">
              <Button size="sm">Sign In</Button>
            </Link>
            <Button variant="outline" size="sm" className="md:hidden" onClick={() => setOpen(true)}>
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 md:hidden" // ← Ubah z-50 ke z-[60]
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              className="ml-auto h-full w-72 bg-card p-5"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="space-y-2">
                {publicNavigation.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className="block rounded-xl px-3 py-2 text-sm hover:bg-muted"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
                <NavLink
                  to="/login"
                  className="mt-3 block rounded-xl bg-primary px-3 py-2 text-center text-sm text-white"
                  onClick={() => setOpen(false)}
                >
                  Sign In
                </NavLink>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}