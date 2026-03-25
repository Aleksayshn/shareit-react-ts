import { env } from "@/src/shared/config";
import {
  createAppErrorFromResponseData,
  normalizeAppError,
} from "@/src/shared/lib";

type QueryPrimitive = string | number | boolean | Date | null | undefined;

export type QueryParamValue = QueryPrimitive | QueryPrimitive[];
export type QueryParams = Record<string, QueryParamValue>;

export interface ApiRequestOptions<TBody = never> {
  body?: TBody;
  headers?: HeadersInit;
  query?: QueryParams;
  signal?: AbortSignal;
  cache?: RequestCache;
}

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

function resolveUrl(path: string, query?: QueryParams) {
  const baseUrl =
    typeof window === "undefined"
      ? env.apiBaseUrl
      : `${window.location.origin}/api/forward`;
  const url = path.startsWith("http")
    ? new URL(path)
    : new URL(path.replace(/^\//, ""), `${baseUrl.replace(/\/$/, "")}/`);

  if (!query) {
    return url.toString();
  }

  for (const [key, rawValue] of Object.entries(query)) {
    appendQueryParam(url.searchParams, key, rawValue);
  }

  return url.toString();
}

function appendQueryParam(
  searchParams: URLSearchParams,
  key: string,
  rawValue: QueryParamValue,
) {
  if (Array.isArray(rawValue)) {
    for (const value of rawValue) {
      appendQueryParam(searchParams, key, value);
    }

    return;
  }

  if (rawValue === null || rawValue === undefined) {
    return;
  }

  const value =
    rawValue instanceof Date ? rawValue.toISOString() : String(rawValue);

  searchParams.append(key, value);
}

function createHeaders(body: unknown, headers?: HeadersInit) {
  const requestHeaders = new Headers(headers);

  requestHeaders.set("Accept", "application/json");

  if (
    body !== undefined &&
    body !== null &&
    !(body instanceof FormData) &&
    !(body instanceof URLSearchParams) &&
    !requestHeaders.has("Content-Type")
  ) {
    requestHeaders.set("Content-Type", "application/json");
  }

  return requestHeaders;
}

function serializeBody(body: unknown): BodyInit | undefined {
  if (body === undefined || body === null) {
    return undefined;
  }

  if (
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    typeof body === "string" ||
    body instanceof Blob ||
    body instanceof ArrayBuffer ||
    ArrayBuffer.isView(body)
  ) {
    return body as BodyInit;
  }

  return JSON.stringify(body);
}

async function parseResponseBody<TResponse>(response: Response) {
  if (response.status === 204) {
    return undefined as TResponse;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return (await response.json()) as TResponse;
  }

  return (await response.text()) as TResponse;
}

async function parseErrorPayload(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function request<TResponse, TBody = never>(
  method: HttpMethod,
  path: string,
  options: ApiRequestOptions<TBody> = {},
) {
  const { body, headers, query, signal, cache = "no-store" } = options;

  try {
    const response = await fetch(resolveUrl(path, query), {
      method,
      headers: createHeaders(body, headers),
      body: serializeBody(body),
      signal,
      cache,
    });

    if (!response.ok) {
      const payload = await parseErrorPayload(response);
      throw createAppErrorFromResponseData(response.status, payload);
    }

    return parseResponseBody<TResponse>(response);
  } catch (error) {
    throw normalizeAppError(error);
  }
}

export const apiClient = {
  get<TResponse>(path: string, options?: Omit<ApiRequestOptions, "body">) {
    return request<TResponse>("GET", path, options);
  },
  post<TResponse, TBody = never>(
    path: string,
    body?: TBody,
    options?: Omit<ApiRequestOptions<TBody>, "body">,
  ) {
    return request<TResponse, TBody>("POST", path, { ...options, body });
  },
  patch<TResponse, TBody = never>(
    path: string,
    body?: TBody,
    options?: Omit<ApiRequestOptions<TBody>, "body">,
  ) {
    return request<TResponse, TBody>("PATCH", path, { ...options, body });
  },
  delete<TResponse, TBody = never>(
    path: string,
    options?: ApiRequestOptions<TBody>,
  ) {
    return request<TResponse, TBody>("DELETE", path, options);
  },
};
