"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsers, userQueryKeys } from "@/src/entities/user";
import { getMyItems, itemQueryKeys } from "@/src/entities/item";
import { CreateItemForm, UpdateItemForm } from "@/src/features";
import { AppError } from "@/src/shared/lib/errors";
import { useActiveUserStore } from "@/src/shared/model";
import {
  Card,
  EmptyState,
  ExpandableCard,
  ErrorState,
  LoadingState,
  SectionHeader,
  StatCard,
} from "@/src/shared/ui";
import { ItemList } from "@/src/widgets";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function MyItemsContent() {
  const selectedUserId = useActiveUserStore((state) => state.selectedUserId);
  const hasHydrated = useActiveUserStore((state) => state.hasHydrated);
  const profilesQuery = useQuery({
    queryKey: userQueryKeys.list(),
    queryFn: getUsers,
    enabled: Boolean(selectedUserId),
  });

  const itemsQuery = useQuery({
    queryKey: itemQueryKeys.mine(selectedUserId),
    queryFn: getMyItems,
    enabled: Boolean(selectedUserId),
  });

  const errorMessage =
    itemsQuery.error instanceof AppError
      ? itemsQuery.error.message
      : "We couldn't load your listings right now.";
  const items = itemsQuery.data ?? [];
  const currentProfile =
    profilesQuery.data?.find((profile) => profile.id === selectedUserId) ?? null;
  const availableCount = items.filter((item) => item.isAvailable).length;
  const noteCount = items.reduce((total, item) => total + item.comments.length, 0);

  return (
    <>
      {!hasHydrated ? (
        <LoadingState message="Loading your profile..." />
      ) : null}

      {hasHydrated && !selectedUserId ? (
        <EmptyState
          description="Choose a current profile in the header to manage that person's listings."
          title="Choose a profile"
        />
      ) : null}

      {selectedUserId ? (
        <div className="grid gap-6">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
            <Card className="grid gap-5" tone="accent">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-accent/12 text-lg font-semibold uppercase tracking-[0.16em] text-accent">
                  {currentProfile ? getInitials(currentProfile.name) : "?"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                    Sharing as
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                    {currentProfile ? currentProfile.name : "Current profile"}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    {currentProfile?.email ??
                      "Manage the listings for the profile selected in the header."}
                  </p>
                </div>
              </div>
              <p className="text-sm leading-7 text-muted">
                Keep this space up to date so other people can see what this
                profile is sharing right now.
              </p>
            </Card>

            <StatCard
              description="Everything this profile is currently sharing."
              label="Listings"
              value={itemsQuery.isSuccess ? items.length : "--"}
            />
            <StatCard
              description="Listings that are open to new borrow requests."
              label="Available now"
              value={itemsQuery.isSuccess ? availableCount : "--"}
            />
            <StatCard
              description="Borrower notes across the listings shown here."
              label="Notes"
              value={itemsQuery.isSuccess ? noteCount : "--"}
            />
          </div>

          <ExpandableCard
            closeLabel="Hide form"
            defaultOpen={itemsQuery.isSuccess && items.length === 0}
            description="Post something useful that other people can borrow for a while."
            eyebrow="Create"
            openLabel="Add listing"
            title="Add a new listing"
            tone="accent"
          >
            <CreateItemForm framed={false} selectedUserId={selectedUserId} />
          </ExpandableCard>

          <div className="grid gap-4">
            <SectionHeader
              description="Update availability, refine descriptions, and keep your shared items ready for requests."
              eyebrow="Listings"
              title="Your shared items"
            />

            {itemsQuery.isPending ? (
              <LoadingState message="Loading your listings..." />
            ) : null}

            {itemsQuery.isError ? (
              <ErrorState
                description={errorMessage}
                title="Listings unavailable"
              />
            ) : null}

            {itemsQuery.isSuccess ? (
              <ItemList
                emptyDescription="Add your first listing to start sharing with other people."
                emptyTitle="No listings yet"
                items={items}
                renderActions={(item) => <UpdateItemForm item={item} />}
              />
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
