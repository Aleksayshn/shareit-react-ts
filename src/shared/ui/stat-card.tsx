import type { ReactNode } from "react";
import { cn } from "@/src/shared/lib";
import { Card } from "./card";

interface StatCardProps {
  label: string;
  value: ReactNode;
  description?: string;
  tone?: "default" | "accent";
  className?: string;
}

export function StatCard({
  label,
  value,
  description,
  tone = "default",
  className,
}: StatCardProps) {
  return (
    <Card className={cn("grid gap-2", className)} tone={tone}>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
        {label}
      </p>
      <p className="text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      {description ? (
        <p className="text-sm leading-7 text-muted">{description}</p>
      ) : null}
    </Card>
  );
}
