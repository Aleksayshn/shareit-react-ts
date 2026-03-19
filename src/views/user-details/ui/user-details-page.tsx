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
          Back to users
        </LinkButton>
      }
      description="This page stays connected to the real backend record for one user."
      eyebrow="User details"
      title="Inspect and maintain a user"
    >
      <UserDetailsContent userId={userId} />
    </PageShell>
  );
}
