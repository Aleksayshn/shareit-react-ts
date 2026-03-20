"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { itemQueryKeys, searchItems, type Item } from "@/src/entities/item";
import { AppError, useDebouncedValue } from "@/src/shared/lib";
import { useActiveUserStore } from "@/src/shared/model";
import {
  Button,
  Card,
  EmptyState,
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
  selectedUserId: string | null;
  hasHydrated: boolean;
}

function ExploreItemActions({
  item,
  selectedUserId,
  hasHydrated,
}: ExploreItemActionsProps) {
  const isOwner = Boolean(selectedUserId && item.ownerId === selectedUserId);

  if (!hasHydrated) {
    return null;
  }

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

  if (!selectedUserId) {
    return (
      <LinkButton href="/users" size="sm">
        Choose profile
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
  const selectedUserId = useActiveUserStore((state) => state.selectedUserId);
  const hasHydrated = useActiveUserStore((state) => state.hasHydrated);
  const debouncedSearchTerm = useDebouncedValue(searchTerm, SEARCH_DEBOUNCE_MS);
  const normalizedSearchTerm = debouncedSearchTerm.trim();
  const isWaitingForDebounce =
    searchTerm.trim().length > 0 && searchTerm !== debouncedSearchTerm;
  const searchRequest = {
    text: normalizedSearchTerm,
    from: 0,
    size: DISCOVERY_PAGE_SIZE,
  };

  const searchQuery = useQuery({
    queryKey: itemQueryKeys.search(searchRequest),
    queryFn: () => searchItems(searchRequest),
    enabled: normalizedSearchTerm.length > 0,
  });

  const errorMessage =
    searchQuery.error instanceof AppError
      ? searchQuery.error.message
      : "We couldn't search listings right now.";
  const resultCount = searchQuery.data?.length ?? 0;

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
          <div className="rounded-[24px] border border-border/70 bg-white/65 p-5">
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

          <div className="rounded-[24px] border border-border/70 bg-white/65 p-5">
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

      {searchTerm.trim().length === 0 ? (
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <EmptyState
            description="Start with a quick search to discover tools, gear, household items, and other useful things people are sharing."
            title="Search to explore listings"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              description="Borrow tools, equipment, and useful things without buying them."
              label="Borrow for one-off needs"
              tone="accent"
              value="Practical"
            />
            <StatCard
              description="Share what you already own and help other people nearby."
              label="Share what you have"
              value="Community"
            />
          </div>
        </div>
      ) : null}

      {isWaitingForDebounce ? (
        <LoadingState message="Searching as you type..." />
      ) : null}

      {searchQuery.isPending ? (
        <LoadingState message="Looking for listings..." />
      ) : null}

      {searchQuery.isError ? (
        <ErrorState
          description={errorMessage}
          title="Search unavailable"
        />
      ) : null}

      {searchQuery.isSuccess && normalizedSearchTerm.length > 0 ? (
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

      {searchQuery.isSuccess && normalizedSearchTerm.length > 0 ? (
        <ItemList
          emptyDescription="Try a broader term or search for a different kind of item."
          emptyTitle="Nothing matches yet"
          items={searchQuery.data}
          renderActions={(item) => (
            <ExploreItemActions
              hasHydrated={hasHydrated}
              item={item}
              selectedUserId={selectedUserId}
            />
          )}
        />
      ) : null}
    </div>
  );
}
