/* eslint-disable react-refresh/only-export-components */

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { cn } from "../../utils/cn";

interface ToastItem {
  id: string;
  message: string;
  tone: "success" | "info";
}

interface ToastContextValue {
  pushToast: (message: string, tone?: ToastItem["tone"]) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const pushToast = (message: string, tone: ToastItem["tone"] = "success") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 2600);
  };

  const value = useMemo(() => ({ pushToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-6 right-6 z-[60] flex w-full max-w-xs flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={cn(
                "flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-soft",
                toast.tone === "success" && "border-safe/30",
              )}
            >
              <CheckCircle2 className="h-4 w-4 text-safe" />
              <p className="flex-1">{toast.message}</p>
              <button
                className="rounded p-1 text-muted-foreground hover:bg-muted"
                aria-label="Dismiss notification"
                onClick={() =>
                  setToasts((prev) =>
                    prev.filter((item) => item.id !== toast.id),
                  )
                }
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}
