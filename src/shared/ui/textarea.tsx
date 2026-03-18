import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/src/shared/lib";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "min-h-28 rounded-2xl border border-border bg-surface-strong px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent",
        className,
      )}
      {...props}
    />
  );
}
