import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/classnames";

const typographyVariants = cva("text-text-dark", {
    variants: {
        variant: {
            h1: "text-h1",
            h2: "text-h2",
            h3: "text-h3",
            h4: "text-h4",
            "body-lg": "text-body-lg",
            body: "text-body",
            small: "text-small",
        },
        align: {
            left: "text-left",
            center: "text-center",
            right: "text-right",
            start: "text-start",
            end: "text-end",
        },
        weight: {
            regular: "font-normal",
            medium: "font-medium",
            semibold: "font-semibold",
            bold: "font-bold",
        },
    },
    defaultVariants: {
        variant: "body",
        align: "start",
    },
});

export interface TypographyProps
    extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
}

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
    ({ className, variant, align, weight, as, children, ...props }, ref) => {
        const Component = as || (variant?.startsWith("h") ? (variant as React.ElementType) : "p");

        return React.createElement(
            Component,
            {
                className: cn(typographyVariants({ variant, align, weight, className })),
                ref,
                ...props,
            },
            children
        );
    }
);

Typography.displayName = "Typography";
