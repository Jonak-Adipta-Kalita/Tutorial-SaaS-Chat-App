import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  isAdmin: boolean;
}

function Badge({ className, variant, isAdmin, ...props }: BadgeProps) {
  const hoverEffect =
    isAdmin && variant !== "outline"
      ? ` hover:bg-${variant}/80 cursor-pointer`
      : "";

  return (
    <div
      className={cn(badgeVariants({ variant }) + hoverEffect, className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
