import type { PropsWithChildren } from "react";
import { cn } from "@/src/shared/lib";

interface FieldProps extends PropsWithChildren {
  label: string;
  htmlFor?: string;
  description?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

export function Field({
  children,
  label,
  htmlFor,
  description,
  error,
  required = false,
  className,
}: FieldProps) {
  return (
    <label className={cn("grid gap-2", className)} htmlFor={htmlFor}>
      <span className="text-sm font-medium text-foreground">
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </span>
      {description ? (
        <span className="text-sm leading-6 text-muted">{description}</span>
      ) : null}
      {children}
      {error ? <span className="text-sm text-danger">{error}</span> : null}
    </label>
  );
}
