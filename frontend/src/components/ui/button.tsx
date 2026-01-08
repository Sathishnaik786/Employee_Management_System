import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.96] select-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/95 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 shadow-md",
        premium: "bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 bg-[length:200%_auto] text-white hover:bg-[position:right_center] hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/25 shadow-lg border-none",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/95 hover:scale-[1.02] hover:shadow-lg hover:shadow-destructive/20 shadow-sm",
        outline: "border border-border bg-background hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] hover:shadow-md",
        outlinePremium: "border-2 border-primary/20 bg-background text-primary hover:bg-primary/5 hover:border-primary/40 hover:scale-[1.02] hover:shadow-md transition-all",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:scale-[1.02] hover:shadow-md",
        glass: "glass-panel hover:bg-white/40 dark:hover:bg-black/60 hover:scale-[1.02] hover:shadow-xl shadow-lg border-white/30 dark:border-white/20",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:scale-[1.02]",
        link: "text-primary underline-offset-4 hover:underline decoration-primary/30",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
