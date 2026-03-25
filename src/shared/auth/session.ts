import "server-only";

import { cookies } from "next/headers";
import type { AuthSession } from "./auth.types";

const SESSION_COOKIE_NAME = "shareit_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

type CookieOptions = {
  httpOnly?: boolean;
  sameSite?: "lax" | "strict" | "none";
  secure?: boolean;
  path?: string;
  maxAge?: number;
};

type CookieSetter = {
  set: (name: string, value: string, options: CookieOptions) => void;
};

function getCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}

function encodeSession(session: AuthSession) {
  return Buffer.from(JSON.stringify(session), "utf-8").toString("base64");
}

function decodeSession(value: string): AuthSession | null {
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64").toString("utf-8"));

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    return parsed as AuthSession;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!cookieValue) {
    return null;
  }

  return decodeSession(cookieValue);
}

export async function getSessionUser() {
  const session = await getSession();

  return session?.user ?? null;
}

export async function getSessionToken() {
  const session = await getSession();

  return session?.token ?? null;
}

export function setSessionCookie(store: CookieSetter, session: AuthSession) {
  store.set(SESSION_COOKIE_NAME, encodeSession(session), getCookieOptions());
}

export function clearSessionCookie(store: CookieSetter) {
  store.set(SESSION_COOKIE_NAME, "", {
    ...getCookieOptions(),
    maxAge: 0,
  });
}

export async function setSession(session: AuthSession) {
  const cookieStore = await cookies();
  setSessionCookie(cookieStore, session);
}

export async function clearSession() {
  const cookieStore = await cookies();
  clearSessionCookie(cookieStore);
}
