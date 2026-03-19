import { AppError } from "@/src/shared/lib/errors";

interface AppErrorPanelProps {
  error: unknown;
  fallbackMessage: string;
}

export function AppErrorPanel({
  error,
  fallbackMessage,
}: AppErrorPanelProps) {
  const appError = error instanceof AppError ? error : null;
  const message = appError?.message || fallbackMessage;

  return (
    <div className="grid gap-2">
      <p className="text-sm font-medium text-danger">{message}</p>
      {appError && appError.fieldErrors.length > 0 ? (
        <ul className="grid gap-1 text-sm text-danger">
          {appError.fieldErrors.map((fieldError) => (
            <li key={`${fieldError.field}-${fieldError.message}`}>
              {fieldError.field}: {fieldError.message}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
