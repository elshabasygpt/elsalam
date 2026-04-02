import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/classnames";

const badgeVariants = cva(
    "inline-flex items-center px-3 py-1 rounded-sm text-sm font-medium",
    {
        variants: {
            intent: {
                neutral: "bg-surface-light text-text-dark",
                success: "bg-accent-green/20 text-primary-dark",
                warning: "bg-accent-gold/20 text-yellow-800",
                primary: "bg-primary-green text-white",
            },
        },
        defaultVariants: {
            intent: "neutral",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, intent, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ intent }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
