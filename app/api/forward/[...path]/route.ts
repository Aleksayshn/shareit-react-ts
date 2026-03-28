import { NextResponse } from "next/server";
import { env } from "@/src/shared/config";
import { clearSessionCookie, getSessionToken } from "@/src/shared/auth/server";

type RouteContext = {
  params: Promise<{
    path?: string[];
  }>;
};

const API_BASE_URL = process.env.API_BASE_URL?.trim() || env.apiBaseUrl;

const DROP_REQUEST_HEADERS = new Set([
  "accept-encoding",
  "connection",
  "content-length",
  "cookie",
  "host",
  "transfer-encoding",
]);

const DROP_RESPONSE_HEADERS = new Set([
  "connection",
  "content-encoding",
  "content-length",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "set-cookie",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

function buildTargetUrl(path: string, search: string) {
  const normalizedPath = path.replace(/^\//, "");
  const base = API_BASE_URL.replace(/\/$/, "");

  return `${base}/${normalizedPath}${search}`;
}

function buildUpstreamHeaders(request: Request, token: string | null) {
  const headers = new Headers();

  request.headers.forEach((value, key) => {
    if (!value || DROP_REQUEST_HEADERS.has(key.toLowerCase())) {
      return;
    }

    headers.set(key, value);
  });

  headers.set("accept-encoding", "identity");

  if (token) {
    headers.set("authorization", `Bearer ${token}`);
  }

  return headers;
}

function buildResponseHeaders(upstreamHeaders: Headers) {
  const headers = new Headers();

  upstreamHeaders.forEach((value, key) => {
    if (DROP_RESPONSE_HEADERS.has(key.toLowerCase())) {
      return;
    }

    headers.set(key, value);
  });

  return headers;
}

async function forwardRequest(request: Request, context: RouteContext) {
  const { path = [] } = await context.params;
  const token = await getSessionToken();
  const targetUrl = buildTargetUrl(path.join("/"), new URL(request.url).search);
  const headers = buildUpstreamHeaders(request, token);
  const isBodyless = request.method === "GET" || request.method === "HEAD";
  const body = isBodyless ? undefined : await request.arrayBuffer();

  const apiResponse = await fetch(targetUrl, {
    method: request.method,
    headers,
    body,
    redirect: "manual",
  });

  const responseBody =
    apiResponse.status === 204 ? null : Buffer.from(await apiResponse.arrayBuffer());

  const response = new NextResponse(responseBody, {
    status: apiResponse.status,
    headers: buildResponseHeaders(apiResponse.headers),
  });

  if (apiResponse.status === 401) {
    clearSessionCookie(response.cookies);
  }

  return response;
}

export function GET(request: Request, context: RouteContext) {
  return forwardRequest(request, context);
}

export function POST(request: Request, context: RouteContext) {
  return forwardRequest(request, context);
}

export function PATCH(request: Request, context: RouteContext) {
  return forwardRequest(request, context);
}

export function DELETE(request: Request, context: RouteContext) {
  return forwardRequest(request, context);
}
