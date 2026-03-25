"use client";

import { useQuery } from "@tanstack/react-query";
import { getFeaturedItems, itemQueryKeys, type Item } from "@/src/entities/item";
import { useAuth } from "@/src/shared/auth";
import { AppError } from "@/src/shared/lib";
import {
  Card,
  ErrorState,
  LinkButton,
  LoadingState,
  SectionHeader,
} from "@/src/shared/ui";
import { ItemList } from "@/src/widgets";

const FEATURED_PAGE_SIZE = 6;

function FeaturedItemActions({ item }: { item: Item }) {
  const { user, isAuthenticated } = useAuth();
  const isOwner = Boolean(user && item.ownerId === user.id);

  if (isOwner) {
    return (
      <LinkButton href="/items" size="sm" variant="secondary">
        Your listing
      </LinkButton>
    );
  }

  if (!item.isAvailable) {
    return (
      <LinkButton href={`/items/${item.id}`} size="sm" variant="secondary">
        View details
      </LinkButton>
    );
  }

  if (!isAuthenticated) {
    return (
      <LinkButton
        href={`/login?next=${encodeURIComponent(`/items/${item.id}#borrow`)}`}
        size="sm"
      >
        Sign in to request
      </LinkButton>
    );
  }

  return (
    <LinkButton href={`/items/${item.id}#borrow`} size="sm">
      Request to borrow
    </LinkButton>
  );
}

export function FeaturedListingsSection() {
  const listingsQuery = useQuery({
    queryKey: itemQueryKeys.featured(0, FEATURED_PAGE_SIZE),
    queryFn: () => getFeaturedItems({ from: 0, size: FEATURED_PAGE_SIZE }),
  });

  const errorMessage =
    listingsQuery.error instanceof AppError
      ? listingsQuery.error.message
      : "We couldn't load listings right now.";

  return (
    <section className="grid gap-4" id="featured">
      <SectionHeader
        description="A quick look at what people are sharing right now."
        eyebrow="Featured"
        title="Available listings"
      />

      {listingsQuery.isPending ? (
        <LoadingState message="Loading available listings..." />
      ) : null}

      {listingsQuery.isError ? (
        <ErrorState
          description={errorMessage}
          title="Listings unavailable"
        />
      ) : null}

      {listingsQuery.isSuccess ? (
        <ItemList
          emptyDescription="New listings will appear here once people start sharing."
          emptyTitle="No listings yet"
          items={listingsQuery.data}
          renderActions={(item) => <FeaturedItemActions item={item} />}
        />
      ) : null}

      <Card className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          Want to see more? Search for something specific or browse available categories.
        </p>
        <LinkButton href="#search" size="sm" variant="secondary">
          Search listings
        </LinkButton>
      </Card>
    </section>
  );
}
