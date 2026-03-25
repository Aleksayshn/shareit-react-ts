import { redirect } from "next/navigation";
import { LoginPage } from "@/src/views";
import { getSessionUser } from "@/src/shared/auth/server";

interface LoginRouteProps {
  searchParams: Promise<{
    next?: string;
  }>;
}

function normalizeNextPath(value?: string) {
  if (!value) {
    return null;
  }

  return value.startsWith("/") ? value : null;
}

export default async function LoginRoute({ searchParams }: LoginRouteProps) {
  const { next } = await searchParams;
  const nextPath = normalizeNextPath(next);
  const user = await getSessionUser();

  if (user) {
    redirect(nextPath || "/");
  }

  return <LoginPage nextPath={nextPath} />;
}
