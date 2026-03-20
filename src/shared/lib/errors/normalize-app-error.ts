import {
  AppError,
  getErrorMessage,
  getFieldErrors,
  mapStatusToErrorCode,
} from "./app-error";

export function createAppErrorFromResponseData(
  status: number,
  payload: unknown,
  fallbackMessage?: string,
) {
  const message =
    getErrorMessage(payload) ||
    fallbackMessage ||
    `Request failed with status ${status}.`;
  const code = mapStatusToErrorCode(status);

  return new AppError({
    code,
    message,
    status,
    details: payload,
    fieldErrors: getFieldErrors(payload),
    isRetryable: status >= 500,
  });
}

export function normalizeAppError(error: unknown) {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof DOMException && error.name === "AbortError") {
    return new AppError({
      code: "ABORT_ERROR",
      message: "The request was cancelled.",
      cause: error,
    });
  }

  if (error instanceof TypeError) {
    return new AppError({
      code: "NETWORK_ERROR",
      message:
        "We couldn't connect right now. Check your connection and try again.",
      cause: error,
      isRetryable: true,
    });
  }

  if (error instanceof Error) {
    return new AppError({
      code: "UNKNOWN_ERROR",
      message: error.message || "An unexpected error occurred.",
      cause: error,
    });
  }

  return new AppError({
    code: "UNKNOWN_ERROR",
    message: "An unexpected error occurred.",
    details: error,
  });
}
