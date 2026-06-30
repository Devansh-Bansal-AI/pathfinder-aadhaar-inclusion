import * as React from "react";
import { cn } from "@/lib/utils";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn("flex h-11 w-full rounded-xl border border-white/40 dark:border-white/10 bg-white/50 dark:bg-black/30 px-4 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:bg-white/80 dark:focus-visible:bg-black/50 disabled:cursor-not-allowed disabled:opacity-50", className)}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";
