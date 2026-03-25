import { redirect } from "next/navigation";
import { RegisterPage } from "@/src/views";
import { getSessionUser } from "@/src/shared/auth/server";

interface RegisterRouteProps {
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

export default async function RegisterRoute({ searchParams }: RegisterRouteProps) {
  const { next } = await searchParams;
  const nextPath = normalizeNextPath(next);
  const user = await getSessionUser();

  if (user) {
    redirect(nextPath || "/");
  }

  return <RegisterPage nextPath={nextPath} />;
}
