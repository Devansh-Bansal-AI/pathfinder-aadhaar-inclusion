import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl border border-white/40 dark:border-white/10 bg-white/50 dark:bg-black/30 backdrop-blur-xl p-6 shadow-xl shadow-black/5 dark:shadow-black/20 transition-all duration-300", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-base font-semibold text-foreground", className)} {...props} />;
}
