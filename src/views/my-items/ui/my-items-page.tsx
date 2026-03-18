"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyItems, itemQueryKeys } from "@/src/entities/item";
import { CreateItemForm, UpdateItemForm } from "@/src/features";
import { AppError } from "@/src/shared/lib/errors";
import { useActiveUserStore } from "@/src/shared/model";
import { Card, EmptyState, PageShell, Spinner } from "@/src/shared/ui";
import { ItemList } from "@/src/widgets";

export function MyItemsPage() {
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
    <PageShell
      description="This page is owner-only. It loads the active user's items from `GET /items` and exposes create and update controls there only."
      eyebrow="My items"
      title="Manage what you share"
    >
      {!hasHydrated ? (
        <Card className="flex items-center gap-3">
          <Spinner />
          <p className="text-sm text-muted">Restoring the active sharer...</p>
        </Card>
      ) : null}

      {hasHydrated && !selectedUserId ? (
        <EmptyState
          description="The `/items` owner view depends on the active user store. Once a user is selected, the API client will attach `X-Sharer-User-Id` automatically."
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
        <Card className="flex items-center gap-3">
          <Spinner />
          <p className="text-sm text-muted">Loading your items...</p>
        </Card>
      ) : null}

      {itemsQuery.isError ? (
        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-danger">
            Items error
          </p>
          <p className="mt-3 text-sm leading-7 text-muted">{errorMessage}</p>
        </Card>
      ) : null}

      {itemsQuery.isSuccess && selectedUserId ? (
        <ItemList
          emptyDescription="Create the first item for this user to start building the owner inventory."
          emptyTitle="No items yet"
          items={itemsQuery.data}
          renderActions={(item) => <UpdateItemForm item={item} />}
        />
      ) : null}
    </PageShell>
  );
}
