import React from "react";
import { cn } from "@/utils/classnames";
import { Typography } from "@/components/atoms/Typography";

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    hint?: string;
    containerClassName?: string;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
    ({ label, error, hint, className, containerClassName, id, required, ...props }, ref) => {
        const inputId = id ?? `field-${Math.random().toString(36).slice(2, 9)}`;
        const errorId = `${inputId}-error`;

        return (
            <div className={cn("mb-4 flex flex-col", containerClassName)}>
                {label && (
                    <label htmlFor={inputId} className="mb-2 text-sm font-medium text-text-dark">
                        {label} {required && <span className="text-red-500">*</span>}
                    </label>
                )}
                <input
                    id={inputId}
                    ref={ref}
                    className={cn(
                        "w-full h-12 px-4 rounded-sm border bg-white text-base text-text-dark placeholder:text-text-dark/40 transition-shadow focus:outline-none focus:ring-1",
                        error
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-surface-light focus:border-accent-green focus:ring-accent-green",
                        className
                    )}
                    aria-invalid={!!error}
                    aria-describedby={error ? errorId : undefined}
                    {...props}
                />
                {error && (
                    <span id={errorId} className="text-red-500 text-sm mt-1" role="alert">
                        {error}
                    </span>
                )}
                {!error && hint && (
                    <span className="text-text-dark/60 text-sm mt-1">{hint}</span>
                )}
            </div>
        );
    }
);

FormField.displayName = "FormField";
