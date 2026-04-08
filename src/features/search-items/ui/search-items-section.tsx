"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  getDiscoveryItems,
  itemQueryKeys,
  searchItems,
  type Item,
} from "@/src/entities/item";
import { useAuth } from "@/src/shared/auth";
import { AppError, useDebouncedValue } from "@/src/shared/lib";
import {
  Button,
  Card,
  ErrorState,
  Field,
  Input,
  LinkButton,
  LoadingState,
  SectionHeader,
  StatCard,
} from "@/src/shared/ui";
import { ItemList } from "@/src/widgets";

const SEARCH_DEBOUNCE_MS = 350;
const DISCOVERY_PAGE_SIZE = 20;
const popularSearches = ["Bike", "Drill", "Projector", "Tent", "Camera", "Speaker"];

interface ExploreItemActionsProps {
  item: Item;
  userId: string | null;
  isAuthenticated: boolean;
}

function ExploreItemActions({
  item,
  userId,
  isAuthenticated,
}: ExploreItemActionsProps) {
  const isOwner = Boolean(userId && item.ownerId === userId);

  if (isOwner) {
    return (
      <Button disabled size="sm" variant="secondary">
        Your listing
      </Button>
    );
  }

  if (!item.isAvailable) {
    return (
      <Button disabled size="sm" variant="secondary">
        Unavailable
      </Button>
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

export function SearchItemsSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id ?? null;
  const debouncedSearchTerm = useDebouncedValue(searchTerm, SEARCH_DEBOUNCE_MS);
  const normalizedSearchTerm = debouncedSearchTerm.trim();
  const hasSearchTerm = normalizedSearchTerm.length > 0;
  const isWaitingForDebounce =
    searchTerm.trim().length > 0 && searchTerm !== debouncedSearchTerm;
  const searchRequest = {
    text: normalizedSearchTerm,
    from: 0,
    size: DISCOVERY_PAGE_SIZE,
  };
  const discoveryQuery = useQuery({
    queryKey: itemQueryKeys.discovery(0, DISCOVERY_PAGE_SIZE),
    queryFn: () => getDiscoveryItems({ from: 0, size: DISCOVERY_PAGE_SIZE }),
  });

  const searchQuery = useQuery({
    queryKey: itemQueryKeys.search(searchRequest),
    queryFn: () => searchItems(searchRequest),
    enabled: hasSearchTerm,
  });

  const activeQuery = hasSearchTerm ? searchQuery : discoveryQuery;
  const errorMessage =
    activeQuery.error instanceof AppError
      ? activeQuery.error.message
      : hasSearchTerm
        ? "We couldn't search listings right now."
        : "We couldn't load listings right now.";
  const resultCount = searchQuery.data?.length ?? 0;
  const discoveryCount = discoveryQuery.data?.length ?? 0;

  return (
    <div className="grid gap-5">
      <Card className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]" tone="accent">
        <div className="grid gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
              Find something nearby
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
              Search listings people are happy to share
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted">
              Explore practical, everyday items and send a request when you find
              something useful.
            </p>
          </div>

          <Field
            description="Search by name or description to find something useful."
            htmlFor="item-search"
            label="Search listings"
          >
            <Input
              id="item-search"
              placeholder="What are you looking for?"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </Field>
        </div>

        <div className="grid gap-4">
          <div className="rounded-3xl border border-border/70 bg-white/65 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Popular searches
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <Button
                  key={term}
                  size="sm"
                  variant="secondary"
                  onClick={() => setSearchTerm(term)}
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border/70 bg-white/65 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Good to know
            </p>
            <p className="mt-3 text-sm leading-7 text-muted">
              Search updates as you type, and only meaningful searches trigger
              results.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <StatCard
          description="Borrow tools, equipment, and useful things without buying them."
          label="Borrow for one-off needs"
          tone="accent"
          value={hasSearchTerm ? `${resultCount}` : `${discoveryCount}`}
        />
        <StatCard
          description="Share what you already own and help other people nearby."
          label="Share what you have"
          value={hasSearchTerm ? "Search" : "Browse"}
        />
      </div>

      {isWaitingForDebounce ? (
        <LoadingState message="Searching as you type..." />
      ) : null}

      {!hasSearchTerm && discoveryQuery.isLoading ? (
        <LoadingState message="Loading listings..." />
      ) : null}

      {hasSearchTerm && searchQuery.isLoading ? (
        <LoadingState message="Looking for listings..." />
      ) : null}

      {activeQuery.isError ? (
        <ErrorState
          description={errorMessage}
          title={hasSearchTerm ? "Search unavailable" : "Listings unavailable"}
        />
      ) : null}

      {!hasSearchTerm && discoveryQuery.isSuccess ? (
        <SectionHeader
          description={
            discoveryCount > 0
              ? "Browse a live snapshot of listings people are sharing right now."
              : "New listings will appear here as soon as people start sharing."
          }
          eyebrow="Browse"
          title={discoveryCount > 0 ? "Listings available now" : "No listings yet"}
        />
      ) : null}

      {hasSearchTerm && searchQuery.isSuccess ? (
        <SectionHeader
          description={
            resultCount > 0
              ? `${resultCount} listing${resultCount === 1 ? "" : "s"} matched "${normalizedSearchTerm}".`
              : `No listings matched "${normalizedSearchTerm}" yet.`
          }
          eyebrow="Results"
          title={
            resultCount > 0
              ? `Search results for "${normalizedSearchTerm}"`
              : "No matching listings"
          }
        />
      ) : null}

      {!hasSearchTerm && discoveryQuery.isSuccess ? (
        <ItemList
          emptyDescription="New listings will appear here once people start sharing."
          emptyTitle="No listings yet"
          items={discoveryQuery.data}
          renderActions={(item) => (
            <ExploreItemActions
              item={item}
              isAuthenticated={isAuthenticated}
              userId={userId}
            />
          )}
        />
      ) : null}

      {hasSearchTerm && searchQuery.isSuccess ? (
        <ItemList
          emptyDescription="Try a broader term or search for a different kind of item."
          emptyTitle="Nothing matches yet"
          items={searchQuery.data}
          renderActions={(item) => (
            <ExploreItemActions
              item={item}
              isAuthenticated={isAuthenticated}
              userId={userId}
            />
          )}
        />
      ) : null}
    </div>
  );
}
