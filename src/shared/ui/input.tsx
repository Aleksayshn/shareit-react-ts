import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/src/shared/lib";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-12 rounded-2xl border border-border bg-surface-strong px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
