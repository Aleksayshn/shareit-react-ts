"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyItems, itemQueryKeys } from "@/src/entities/item";
import { CreateItemForm, UpdateItemForm } from "@/src/features";
import { AppError } from "@/src/shared/lib/errors";
import { useActiveUserStore } from "@/src/shared/model";
import {
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/src/shared/ui";
import { ItemList } from "@/src/widgets";

export function MyItemsContent() {
  const selectedUserId = useActiveUserStore((state) => state.selectedUserId);
  const hasHydrated = useActiveUserStore((state) => state.hasHydrated);

  const itemsQuery = useQuery({
    queryKey: itemQueryKeys.mine(selectedUserId),
    queryFn: getMyItems,
    enabled: Boolean(selectedUserId),
  });

  const errorMessage =
    itemsQuery.error instanceof AppError
      ? itemsQuery.error.message
      : "Unable to load your items right now.";

  return (
    <>
      {!hasHydrated ? (
        <LoadingState message="Restoring the active sharer..." />
      ) : null}

      {hasHydrated && !selectedUserId ? (
        <EmptyState
          description="The `/items` owner view depends on the active user store. Use the header control to set the active sharer and the API client will attach `X-Sharer-User-Id` automatically."
          title="No active sharer selected"
        />
      ) : null}

      {selectedUserId ? (
        <Card className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
              Active sharer
            </p>
            <p className="mt-2 text-lg font-semibold text-foreground">
              User ID: {selectedUserId}
            </p>
          </div>
          <p className="max-w-xl text-sm leading-7 text-muted">
            Owner controls stay on this page only. Discovery cards reuse the
            same widget without exposing edit actions.
          </p>
        </Card>
      ) : null}

      {selectedUserId ? <CreateItemForm selectedUserId={selectedUserId} /> : null}

      {itemsQuery.isPending ? (
        <LoadingState message="Loading your items..." />
      ) : null}

      {itemsQuery.isError ? (
        <ErrorState
          description={errorMessage}
          title="Items error"
        />
      ) : null}

      {itemsQuery.isSuccess && selectedUserId ? (
        <ItemList
          emptyDescription="Create the first item for this user to start building the owner inventory."
          emptyTitle="No items yet"
          items={itemsQuery.data}
          renderActions={(item) => <UpdateItemForm item={item} />}
        />
      ) : null}
    </>
  );
}
