"use client";

import { useQuery } from "@tanstack/react-query";
import { AddCommentForm, CreateBookingForm } from "@/src/features";
import { getItemDetails, itemQueryKeys, type Item } from "@/src/entities/item";
import { cn } from "@/src/shared/lib";
import { AppError } from "@/src/shared/lib/errors";
import { useActiveUserStore } from "@/src/shared/model";
import {
  Card,
  ErrorState,
  LinkButton,
  LoadingState,
} from "@/src/shared/ui";

interface ItemDetailsContentProps {
  itemId: string;
}

function formatBookingMoment(value: string | null) {
  if (!value) {
    return "Not set";
  }

  const formatted = new Date(value);

  if (Number.isNaN(formatted.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(formatted);
}

function formatBookingStatus(value: string | null) {
  switch (value) {
    case "WAITING":
      return "Pending";
    case "APPROVED":
      return "Approved";
    case "REJECTED":
      return "Declined";
    case "CANCELED":
      return "Canceled";
    default:
      return "Not set";
  }
}

function BookingPreviewCard({
  title,
  booking,
}: {
  title: string;
  booking: {
    id: string;
    bookerId: string;
    startAt: string | null;
    endAt: string | null;
    status: string | null;
  };
}) {
  return (
    <div className="rounded-3xl border border-border/70 bg-surface px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        {title}
      </p>
      <dl className="mt-3 grid gap-2 text-sm text-muted">
        <div className="flex justify-between gap-4">
          <dt>Requested by</dt>
          <dd className="font-medium text-foreground">Profile #{booking.bookerId}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>From</dt>
          <dd className="font-medium text-foreground">
            {formatBookingMoment(booking.startAt)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Until</dt>
          <dd className="font-medium text-foreground">
            {formatBookingMoment(booking.endAt)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Status</dt>
          <dd className="font-medium text-foreground">
            {formatBookingStatus(booking.status)}
          </dd>
        </div>
      </dl>
    </div>
  );
}

function BorrowActionPanel({
  item,
  isOwner,
  selectedUserId,
}: {
  item: Item;
  isOwner: boolean;
  selectedUserId: string | null;
}) {
  if (!selectedUserId) {
    return (
      <Card className="grid gap-4" id="borrow" tone="accent">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
            Borrow this item
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-foreground">
            Choose a profile to continue
          </h3>
          <p className="mt-2 text-sm leading-7 text-muted">
            Borrow requests are sent from your current profile, so choose one
            before picking dates.
          </p>
        </div>
        <div>
          <LinkButton href="/users" size="sm">
            Choose profile
          </LinkButton>
        </div>
      </Card>
    );
  }

  if (isOwner) {
    return (
      <Card className="grid gap-4" id="borrow">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
            Your listing
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-foreground">
            You cannot borrow your own item
          </h3>
          <p className="mt-2 text-sm leading-7 text-muted">
            This listing belongs to your current profile, so the borrow form is
            hidden here.
          </p>
        </div>
        <div>
          <LinkButton href="/items" size="sm" variant="secondary">
            Manage my listings
          </LinkButton>
        </div>
      </Card>
    );
  }

  if (!item.isAvailable) {
    return (
      <Card className="grid gap-4" id="borrow">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-danger">
            Unavailable
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-foreground">
            This item is not open for requests
          </h3>
          <p className="mt-2 text-sm leading-7 text-muted">
            The lender has marked it as unavailable, so new borrow requests are
            turned off for now.
          </p>
        </div>
        <div>
          <LinkButton href="/" size="sm" variant="secondary">
            Explore other items
          </LinkButton>
        </div>
      </Card>
    );
  }

  return (
    <CreateBookingForm
      id="borrow"
      item={item}
      selectedUserId={selectedUserId}
      tone="accent"
    />
  );
}

export function ItemDetailsContent({ itemId }: ItemDetailsContentProps) {
  const selectedUserId = useActiveUserStore((state) => state.selectedUserId);
  const itemQuery = useQuery({
    queryKey: itemQueryKeys.detail(itemId),
    queryFn: () => getItemDetails(itemId),
  });

  const errorMessage =
    itemQuery.error instanceof AppError
      ? itemQuery.error.message
      : "We couldn't load this listing right now.";

  const item = itemQuery.data;
  const isOwner = selectedUserId !== null && item?.ownerId === selectedUserId;
  const hasOwnerBookingPreview = Boolean(item?.lastBooking || item?.nextBooking);
  const hasSecondaryColumn = Boolean(isOwner && hasOwnerBookingPreview);

  return (
    <>
      {itemQuery.isPending ? (
        <LoadingState message="Loading listing..." />
      ) : null}

      {itemQuery.isError ? (
        <ErrorState
          description={errorMessage}
          title="Listing unavailable"
        />
      ) : null}

      {item ? (
        <div
          className={cn(
            "grid gap-5",
            hasSecondaryColumn ? "lg:grid-cols-[1.25fr_0.95fr]" : undefined,
          )}
        >
          <div className="grid gap-5">
            <Card className="grid gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-3xl font-semibold text-foreground">
                  {item.name}
                </h2>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                    item.isAvailable
                      ? "bg-accent/12 text-accent"
                      : "bg-danger/12 text-danger"
                  }`}
                >
                  {item.isAvailable ? "Available now" : "Not available"}
                </span>
              </div>
              <p className="text-base leading-8 text-muted">{item.description}</p>

              {item.ownerId ? (
                <p className="text-sm leading-7 text-muted">
                  {isOwner ? (
                    "This listing belongs to your current profile."
                  ) : (
                    <>
                      Shared by{" "}
                      <span className="font-medium text-foreground">
                        profile #{item.ownerId}
                      </span>
                      .
                    </>
                  )}
                </p>
              ) : null}
            </Card>

            <BorrowActionPanel
              isOwner={isOwner}
              item={item}
              selectedUserId={selectedUserId}
            />

            <Card className="grid gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
                  Borrower notes
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-foreground">
                  What users said after borrowing
                </h3>
              </div>

              {item.comments.length === 0 ? (
                <p className="text-sm leading-7 text-muted">
                  No notes yet. Borrowers can leave feedback after an eligible
                  completed request.
                </p>
              ) : (
                <div className="grid gap-3">
                  {item.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="rounded-3xl border border-border/70 bg-surface px-4 py-4"
                    >
                      <p className="text-sm leading-7 text-foreground">
                        {comment.text}
                      </p>
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted">
                        {comment.authorName} - {formatBookingMoment(comment.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <AddCommentForm itemId={item.id} selectedUserId={selectedUserId} />
          </div>

          {hasSecondaryColumn ? (
            <div className="grid gap-5">
              {isOwner && hasOwnerBookingPreview ? (
                <Card className="grid gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
                      Request preview
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold text-foreground">
                      Recent and upcoming requests
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-muted">
                      When request timing is available, you&apos;ll see the most recent
                      and next request for this listing here.
                    </p>
                  </div>

                  <div className="grid gap-3">
                    {item.lastBooking ? (
                      <BookingPreviewCard
                        booking={item.lastBooking}
                        title="Most recent request"
                      />
                    ) : null}
                    {item.nextBooking ? (
                      <BookingPreviewCard
                        booking={item.nextBooking}
                        title="Next upcoming request"
                      />
                    ) : null}
                  </div>
                </Card>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
