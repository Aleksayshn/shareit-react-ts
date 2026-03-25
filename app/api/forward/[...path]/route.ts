import { NextResponse } from "next/server";
import { env } from "@/src/shared/config";
import { clearSessionCookie, getSessionToken } from "@/src/shared/auth/server";

type RouteContext = {
  params: Promise<{
    path?: string[];
  }>;
};

function buildTargetUrl(path: string, search: string) {
  const normalizedPath = path.replace(/^\//, "");
  const base = env.apiBaseUrl.replace(/\/$/, "");

  return `${base}/${normalizedPath}${search}`;
}

async function forwardRequest(request: Request, context: RouteContext) {
  const { path = [] } = await context.params;
  const targetUrl = buildTargetUrl(path.join("/"), new URL(request.url).search);
  const token = await getSessionToken();

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  const accept = request.headers.get("accept");

  if (contentType) {
    headers.set("content-type", contentType);
  }

  if (accept) {
    headers.set("accept", accept);
  }

  if (token) {
    headers.set("authorization", `Bearer ${token}`);
  }

  const isBodyless = request.method === "GET" || request.method === "HEAD";
  const body = isBodyless ? undefined : await request.arrayBuffer();

  const apiResponse = await fetch(targetUrl, {
    method: request.method,
    headers,
    body,
  });

  const responseHeaders = new Headers(apiResponse.headers);
  responseHeaders.delete("set-cookie");

  const responseBody =
    apiResponse.status === 204 ? null : await apiResponse.arrayBuffer();

  const response = new NextResponse(responseBody, {
    status: apiResponse.status,
    headers: responseHeaders,
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
