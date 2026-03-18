import type { InputHTMLAttributes } from "react";
import { cn } from "@/src/shared/lib";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-12 rounded-2xl border border-border bg-surface-strong px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent",
        className,
      )}
      {...props}
    />
  );
}
