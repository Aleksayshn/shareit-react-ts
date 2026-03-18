import { Card } from "./card";

interface ErrorStateProps {
  title: string;
  description: string;
}

export function ErrorState({ title, description }: ErrorStateProps) {
  return (
    <Card>
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-danger">
        {title}
      </p>
      <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
    </Card>
  );
}
