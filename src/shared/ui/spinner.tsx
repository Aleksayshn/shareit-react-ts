import { cn } from "@/src/shared/lib";

interface SpinnerProps {
  className?: string;
}

export function Spinner({ className }: SpinnerProps) {
  return (
    <span
      aria-label="Loading"
      className={cn(
        "inline-flex h-5 w-5 animate-spin rounded-full border-2 border-accent/20 border-t-accent",
        className,
      )}
      role="status"
    />
  );
}
