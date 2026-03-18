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
            Discovery
          </LinkButton>
          <LinkButton href="/items" size="sm" variant="secondary">
            My items
          </LinkButton>
        </div>
      }
      description="This screen combines read-only details with booking and commenting interactions while keeping DTO knowledge inside entity slices."
      eyebrow="Item details"
      title="Inspect an item before you act on it"
    >
      <ItemDetailsContent itemId={itemId} />
    </PageShell>
  );
}
