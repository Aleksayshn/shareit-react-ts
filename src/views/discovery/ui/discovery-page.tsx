import { SearchItemsSection } from "@/src/features";
import { PageShell } from "@/src/shared/ui";

export function DiscoveryPage() {
  return (
    <PageShell
      eyebrow="Explore"
      title="Explore shared items"
      description="Browse items shared by other people and request to borrow what you need."
    >
      <SearchItemsSection />
    </PageShell>
  );
}
