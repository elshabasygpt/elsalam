import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/classnames";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-bold transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] cursor-pointer select-none",
    {
        variants: {
            variant: {
                primary: "bg-green-700 text-white hover:bg-green-800 shadow-md hover:shadow-lg hover:-translate-y-0.5",
                secondary: "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 hover:border-green-400 shadow-sm hover:shadow-md hover:-translate-y-0.5",
                outline: "bg-transparent text-gray-800 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md hover:-translate-y-0.5",
                ghost: "bg-transparent text-green-700 hover:bg-green-50 rounded-lg",
                white: "bg-white text-green-800 hover:bg-gray-50 shadow-md hover:shadow-lg hover:-translate-y-0.5",
            },
            size: {
                default: "h-12 px-6 text-base",
                sm: "h-10 px-5 text-sm",
                lg: "h-14 px-8 text-lg",
                icon: "h-12 w-12 rounded-full",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> { }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
