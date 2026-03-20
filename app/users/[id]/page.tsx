import { UserDetailsPage } from "@/src/views";

interface UserDetailsRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserDetailsRoute({
  params,
}: UserDetailsRouteProps) {
  const { id } = await params;

  return <UserDetailsPage userId={id} />;
}
