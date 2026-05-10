import { motion } from "framer-motion";
import type { PropsWithChildren, ReactNode } from "react";

interface PageHeaderProps extends PropsWithChildren {
  title: string;
  description: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action, children }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </motion.div>
  );
}
