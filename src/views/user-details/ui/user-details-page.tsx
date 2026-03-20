import { LinkButton, PageShell } from "@/src/shared/ui";
import { UserDetailsContent } from "./user-details-content";

interface UserDetailsPageProps {
  userId: string;
}

export function UserDetailsPage({ userId }: UserDetailsPageProps) {
  return (
    <PageShell
      actions={
        <LinkButton href="/users" size="sm" variant="ghost">
          Back to profiles
        </LinkButton>
      }
      description="Update this profile or make it your current profile while you browse and share."
      eyebrow="Profiles"
      title="Profile details"
    >
      <UserDetailsContent userId={userId} />
    </PageShell>
  );
}
