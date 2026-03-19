import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/src/shared/lib";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-28 rounded-2xl border border-border bg-surface-strong px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
