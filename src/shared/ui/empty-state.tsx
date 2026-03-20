import { Card } from "./card";

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Card className="flex min-h-52 flex-col justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
          Nothing here yet
        </p>
        <h2 className="mt-4 text-2xl font-semibold text-foreground">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
      </div>
    </Card>
  );
}
