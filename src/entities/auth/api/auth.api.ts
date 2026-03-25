import {
  createAppErrorFromResponseData,
  normalizeAppError,
} from "@/src/shared/lib";
import type { AuthUser } from "@/src/shared/auth";
import type { LoginInput, RegisterInput } from "../model";

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

async function requestAuth<TResponse, TBody>(
  path: string,
  body: TBody,
): Promise<TResponse> {
  try {
    const response = await fetch(path, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const payload = await parseErrorPayload(response);
      throw createAppErrorFromResponseData(
        response.status,
        payload,
        "Authentication failed.",
      );
    }

    return (await response.json()) as TResponse;
  } catch (error) {
    throw normalizeAppError(error);
  }
}

export function login(input: LoginInput): Promise<AuthUser> {
  return requestAuth<AuthUser, LoginInput>("/api/auth/login", {
    email: input.email.trim(),
    password: input.password,
  });
}

export function register(input: RegisterInput): Promise<AuthUser> {
  return requestAuth<AuthUser, RegisterInput>("/api/auth/register", {
    name: input.name.trim(),
    email: input.email.trim(),
    password: input.password,
  });
}

export async function logout() {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const payload = await parseErrorPayload(response);
      throw createAppErrorFromResponseData(
        response.status,
        payload,
        "Logout failed.",
      );
    }
  } catch (error) {
    throw normalizeAppError(error);
  }
}
