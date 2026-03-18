import { Card } from "./card";
import { Spinner } from "./spinner";

interface LoadingStateProps {
  message: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <Card className="flex items-center gap-3">
      <Spinner />
      <p className="text-sm text-muted">{message}</p>
    </Card>
  );
}
