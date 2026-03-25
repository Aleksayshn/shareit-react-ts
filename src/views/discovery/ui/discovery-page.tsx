import { SearchItemsSection } from "@/src/features";
import { SectionHeader } from "@/src/shared/ui";
import { AuthCtaSection } from "./auth-cta-section";
import { FeaturedListingsSection } from "./featured-listings-section";
import { MarketplaceHero } from "./marketplace-hero";
import { ValuePropsSection } from "./value-props-section";

export function DiscoveryPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-4 py-6 md:px-6 md:py-8">
      <MarketplaceHero />
      <FeaturedListingsSection />
      <ValuePropsSection />

      <section className="grid gap-4" id="search">
        <SectionHeader
          description="Search by name or description to find what you need fast."
          eyebrow="Discover"
          title="Search available listings"
        />
        <SearchItemsSection />
      </section>

      <AuthCtaSection />
    </main>
  );
}
