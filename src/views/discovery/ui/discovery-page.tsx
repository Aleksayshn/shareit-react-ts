import { SearchItemsSection } from "@/src/features";
import { PageShell } from "@/src/shared/ui";

export function DiscoveryPage() {
  return (
    <PageShell
      eyebrow="Discovery"
      title="Find the right thing to borrow"
      description="The home page is focused on discovery through the `/items/search` API. Search requests are debounced, and empty input never triggers a network call."
    >
      <SearchItemsSection />
    </PageShell>
  );
}
