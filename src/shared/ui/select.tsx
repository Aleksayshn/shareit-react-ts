import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/src/shared/lib";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "h-12 rounded-2xl border border-border bg-surface-strong px-4 text-sm text-foreground outline-none transition-colors focus:border-accent",
          className,
        )}
        {...props}
      >
        {children}
      </select>
    );
  },
);

Select.displayName = "Select";
