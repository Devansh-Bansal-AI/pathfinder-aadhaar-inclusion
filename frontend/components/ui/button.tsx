import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 text-sm font-semibold transition-all duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-b from-primary/90 to-primary text-primary-foreground shadow-sm hover:shadow-md hover:shadow-primary/20 hover:from-primary hover:to-primary/90 hover:-translate-y-0.5",
        secondary: "bg-white/80 dark:bg-white/10 backdrop-blur-md text-foreground shadow-sm border border-white/20 hover:shadow-md hover:-translate-y-0.5 hover:bg-white/95 dark:hover:bg-white/20",
        outline: "border border-border bg-white/40 dark:bg-black/40 backdrop-blur-md shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:bg-white/60 dark:hover:bg-black/60",
        ghost: "hover:bg-black/5 dark:hover:bg-white/10"
      },
      size: {
        default: "h-10 px-4",
        icon: "h-10 w-10 px-0",
        sm: "h-9 px-3"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";
