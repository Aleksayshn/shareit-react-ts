import { NextResponse } from "next/server";
import { env } from "@/src/shared/config";
import { mapAuthResponseToSession, mapAuthResponseToUser } from "@/src/entities/auth";
import { setSessionCookie } from "@/src/shared/auth/server";

async function parseJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const apiResponse = await fetch(`${env.apiBaseUrl}/auth/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = await parseJson(apiResponse);

  if (!apiResponse.ok) {
    return NextResponse.json(payload ?? { message: "Login failed." }, {
      status: apiResponse.status,
    });
  }

  if (!payload || typeof payload !== "object" || !("token" in payload)) {
    return NextResponse.json(
      { message: "Unexpected login response." },
      { status: 502 },
    );
  }

  const session = mapAuthResponseToSession(payload);
  const response = NextResponse.json(mapAuthResponseToUser(payload));

  setSessionCookie(response.cookies, session);

  return response;
}
