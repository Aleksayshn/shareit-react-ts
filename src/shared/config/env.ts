const DEFAULT_API_BASE_URL = "http://localhost:8080";

function normalizeUrl(value: string) {
  try {
    const normalizedUrl = new URL(value);
    return normalizedUrl.toString().replace(/\/$/, "");
  } catch {
    throw new Error(
      `Invalid NEXT_PUBLIC_API_BASE_URL value: "${value}". Expected a valid absolute URL.`,
    );
  }
}

export const env = Object.freeze({
  appName: process.env.NEXT_PUBLIC_APP_NAME?.trim() || "ShareIt",
  apiBaseUrl: normalizeUrl(
    process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL,
  ),
});

export type Env = typeof env;
