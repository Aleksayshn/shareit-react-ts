"use client";

import type { PropsWithChildren } from "react";
import { AuthProvider, type AuthUser } from "@/src/shared/auth";
import { QueryProvider } from "./query-provider";

interface AppProvidersProps extends PropsWithChildren {
  initialUser: AuthUser | null;
}

export function AppProviders({ children, initialUser }: AppProvidersProps) {
  const authProviderKey = initialUser
    ? `${initialUser.id}:${initialUser.email}:${initialUser.name}`
    : "guest";

  return (
    <AuthProvider key={authProviderKey} initialUser={initialUser}>
      <QueryProvider>{children}</QueryProvider>
    </AuthProvider>
  );
}
