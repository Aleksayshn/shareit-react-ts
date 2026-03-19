import { PageShell } from "@/src/shared/ui";
import { UsersContent } from "./users-content";

export function UsersPage() {
  return (
    <PageShell
      description="Users are loaded from the real backend and can be created, viewed, updated, deleted, and selected as the active sharer."
      eyebrow="Users"
      title="Manage real API users"
    >
      <UsersContent />
    </PageShell>
  );
}
