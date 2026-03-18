import type { ReactNode } from "react";
import { ItemCard, type Item } from "@/src/entities/item";
import { EmptyState } from "@/src/shared/ui";

interface ItemListProps {
  items: Item[];
  emptyTitle: string;
  emptyDescription: string;
  renderActions?: (item: Item) => ReactNode;
}

export function ItemList({
  items,
  emptyTitle,
  emptyDescription,
  renderActions,
}: ItemListProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        description={emptyDescription}
        title={emptyTitle}
      />
    );
  }

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          actions={renderActions?.(item)}
          item={item}
        />
      ))}
    </section>
  );
}
