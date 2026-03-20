import { LinkButton, PageShell } from "@/src/shared/ui";
import { ItemDetailsContent } from "./item-details-content";

interface ItemDetailsPageProps {
  itemId: string;
}

export function ItemDetailsPage({ itemId }: ItemDetailsPageProps) {
  return (
    <PageShell
      actions={
        <div className="flex flex-wrap gap-3">
          <LinkButton href="/" size="sm" variant="ghost">
            Explore
          </LinkButton>
          <LinkButton href="/items" size="sm" variant="secondary">
            My listings
          </LinkButton>
        </div>
      }
      description="See availability, borrower notes, and request information for this listing."
      eyebrow="Listing"
      title="Item details"
    >
      <ItemDetailsContent itemId={itemId} />
    </PageShell>
  );
}
