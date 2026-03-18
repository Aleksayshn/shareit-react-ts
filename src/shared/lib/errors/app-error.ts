export type AppErrorCode =
  | "ABORT_ERROR"
  | "NETWORK_ERROR"
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "VALIDATION_ERROR"
  | "SERVER_ERROR"
  | "UNKNOWN_ERROR";

export interface AppFieldError {
  field: string;
  message: string;
}

interface AppErrorOptions {
  code: AppErrorCode;
  message: string;
  status?: number | null;
  details?: unknown;
  fieldErrors?: AppFieldError[];
  cause?: unknown;
  isRetryable?: boolean;
}

export class AppError extends Error {
  readonly name = "AppError";
  readonly code: AppErrorCode;
  readonly status: number | null;
  readonly details: unknown;
  readonly fieldErrors: AppFieldError[];
  readonly isRetryable: boolean;

  constructor({
    code,
    message,
    status = null,
    details,
    fieldErrors = [],
    cause,
    isRetryable = false,
  }: AppErrorOptions) {
    super(message, { cause });
    this.code = code;
    this.status = status;
    this.details = details;
    this.fieldErrors = fieldErrors;
    this.isRetryable = isRetryable;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function mapStatusToErrorCode(status: number): AppErrorCode {
  if (status === 400) {
    return "BAD_REQUEST";
  }

  if (status === 401) {
    return "UNAUTHORIZED";
  }

  if (status === 403) {
    return "FORBIDDEN";
  }

  if (status === 404) {
    return "NOT_FOUND";
  }

  if (status === 409) {
    return "CONFLICT";
  }

  if (status === 422) {
    return "VALIDATION_ERROR";
  }

  if (status >= 500) {
    return "SERVER_ERROR";
  }

  return "UNKNOWN_ERROR";
}

export function getErrorMessage(payload: unknown) {
  if (!isRecord(payload)) {
    return null;
  }

  const candidates = [
    payload.message,
    payload.error,
    payload.reason,
    payload.title,
    payload.detail,
  ];

  return (
    candidates.find((candidate): candidate is string => {
      return typeof candidate === "string" && candidate.trim().length > 0;
    }) ?? null
  );
}

export function getFieldErrors(payload: unknown): AppFieldError[] {
  if (!isRecord(payload) || !Array.isArray(payload.errors)) {
    return [];
  }

  return payload.errors.flatMap((item) => {
    if (!isRecord(item)) {
      return [];
    }

    const field = typeof item.field === "string" ? item.field : null;
    const message = typeof item.message === "string" ? item.message : null;

    if (!field || !message) {
      return [];
    }

    return [{ field, message }];
  });
}
