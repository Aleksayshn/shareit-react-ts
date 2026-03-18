import { PageShell } from "@/src/shared/ui";
import { MyItemsContent } from "./my-items-content";

export function MyItemsPage() {
  return (
    <PageShell
      description="This page is owner-only. It loads the active user's items from `GET /items` and exposes create and update controls there only."
      eyebrow="My items"
      title="Manage what you share"
    >
      <MyItemsContent />
    </PageShell>
  );
}
