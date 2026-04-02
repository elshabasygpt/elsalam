import React from "react";
import { cn } from "@/utils/classnames";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    as?: React.ElementType;
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
    ({ className, as: Component = "div", children, ...props }, ref) => {
        return (
            <Component
                ref={ref}
                className={cn("container mx-auto px-4 sm:px-6 lg:px-8", className)}
                {...props}
            >
                {children}
            </Component>
        );
    }
);

Container.displayName = "Container";
