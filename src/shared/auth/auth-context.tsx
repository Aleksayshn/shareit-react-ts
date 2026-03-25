"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import type { AuthUser } from "./auth.types";

interface AuthContextValue {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps extends PropsWithChildren {
  initialUser: AuthUser | null;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);

  const value = useMemo(
    () => ({
      user,
      setUser,
      isAuthenticated: Boolean(user),
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
