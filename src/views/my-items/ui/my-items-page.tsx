import { PageShell } from "@/src/shared/ui";
import { MyItemsContent } from "./my-items-content";

export function MyItemsPage() {
  return (
    <PageShell
      description="Manage the items you make available for others to borrow."
      eyebrow="My listings"
      title="My listings"
    >
      <MyItemsContent />
    </PageShell>
  );
}
