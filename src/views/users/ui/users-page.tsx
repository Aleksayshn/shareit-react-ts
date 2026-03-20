import { PageShell } from "@/src/shared/ui";
import { UsersContent } from "./users-content";

export function UsersPage() {
  return (
    <PageShell
      description="Create and manage profiles used to share items and request to borrow them."
      eyebrow="Profiles"
      title="Profiles"
    >
      <UsersContent />
    </PageShell>
  );
}
