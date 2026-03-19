"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { itemQueryKeys, searchItems } from "@/src/entities/item";
import { AppError, useDebouncedValue } from "@/src/shared/lib";
import {
  Card,
  EmptyState,
  ErrorState,
  Field,
  Input,
  LoadingState,
} from "@/src/shared/ui";
import { ItemList } from "@/src/widgets";

const SEARCH_DEBOUNCE_MS = 350;
const DISCOVERY_PAGE_SIZE = 20;

export function SearchItemsSection() {
  const [searchTerm, setSearchTerm] = useState("");
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
      : "Unable to search items right now.";

  return (
    <div className="grid gap-5">
      <Card className="grid gap-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
            Discover items
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-foreground">
            Search what other sharers can offer
          </h2>
          <p className="mt-2 text-sm leading-7 text-muted">
            Searches are debounced and only sent once there is real text to look
            up.
          </p>
        </div>

        <Field
          description="Try something like bike, drill, projector, or tent."
          htmlFor="item-search"
          label="Search by keyword"
        >
          <Input
            id="item-search"
            placeholder="Start typing to discover items..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </Field>
      </Card>

      {searchTerm.trim().length === 0 ? (
        <EmptyState
          description="The discovery feed stays quiet until the search box has a real value, so we do not send empty search requests."
          title="Search to discover items"
        />
      ) : null}

      {isWaitingForDebounce ? (
        <LoadingState message="Waiting for you to pause typing..." />
      ) : null}

      {searchQuery.isPending ? (
        <LoadingState message="Searching items..." />
      ) : null}

      {searchQuery.isError ? (
        <ErrorState
          description={errorMessage}
          title="Search error"
        />
      ) : null}

      {searchQuery.isSuccess && normalizedSearchTerm.length > 0 ? (
        <ItemList
          emptyDescription={`No items matched "${normalizedSearchTerm}" yet.`}
          emptyTitle="No matching items"
          items={searchQuery.data}
        />
      ) : null}
    </div>
  );
}
