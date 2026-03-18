"use client";

import { useQuery } from "@tanstack/react-query";
import { AddCommentForm, CreateBookingForm } from "@/src/features";
import { getItemDetails, itemQueryKeys } from "@/src/entities/item";
import { AppError } from "@/src/shared/lib/errors";
import { useActiveUserStore } from "@/src/shared/model";
import { Card, LinkButton, PageShell, Spinner } from "@/src/shared/ui";

interface ItemDetailsPageProps {
  itemId: string;
}

function formatBookingMoment(value: string | null) {
  if (!value) {
    return "Not provided";
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
          <dt>Booking ID</dt>
          <dd className="font-medium text-foreground">{booking.id}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Booker</dt>
          <dd className="font-medium text-foreground">{booking.bookerId}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Start</dt>
          <dd className="font-medium text-foreground">
            {formatBookingMoment(booking.startAt)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>End</dt>
          <dd className="font-medium text-foreground">
            {formatBookingMoment(booking.endAt)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Status</dt>
          <dd className="font-medium text-foreground">
            {booking.status ?? "Not provided"}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export function ItemDetailsPage({ itemId }: ItemDetailsPageProps) {
  const selectedUserId = useActiveUserStore((state) => state.selectedUserId);
  const itemQuery = useQuery({
    queryKey: itemQueryKeys.detail(itemId),
    queryFn: () => getItemDetails(itemId),
  });

  const errorMessage =
    itemQuery.error instanceof AppError
      ? itemQuery.error.message
      : "Unable to load this item right now.";

  const item = itemQuery.data;
  const isOwner = selectedUserId !== null && item?.ownerId === selectedUserId;
  const showBookingCta =
    Boolean(item?.isAvailable) && Boolean(selectedUserId) && !isOwner;
  const hasOwnerBookingPreview = Boolean(item?.lastBooking || item?.nextBooking);

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
      description="This screen now combines read-only details with booking and commenting interactions while keeping DTO knowledge inside entity slices."
      eyebrow="Item details"
      title="Inspect an item before you act on it"
    >
      {itemQuery.isPending ? (
        <Card className="flex items-center gap-3">
          <Spinner />
          <p className="text-sm text-muted">Loading item details...</p>
        </Card>
      ) : null}

      {itemQuery.isError ? (
        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-danger">
            Item error
          </p>
          <p className="mt-3 text-sm leading-7 text-muted">{errorMessage}</p>
        </Card>
      ) : null}

      {item ? (
        <div className="grid gap-5 lg:grid-cols-[1.25fr_0.95fr]">
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
                  {item.isAvailable ? "Available" : "Unavailable"}
                </span>
              </div>
              <p className="text-base leading-8 text-muted">{item.description}</p>

              {!selectedUserId ? (
                <p className="text-sm leading-7 text-muted">
                  Select an active user to create bookings or add comments.
                </p>
              ) : null}

              {item.ownerId ? (
                <p className="text-sm leading-7 text-muted">
                  Owner user ID:{" "}
                  <span className="font-medium text-foreground">{item.ownerId}</span>
                </p>
              ) : null}
            </Card>

            <Card className="grid gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
                  Comments
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-foreground">
                  What users said after borrowing
                </h3>
              </div>

              {item.comments.length === 0 ? (
                <p className="text-sm leading-7 text-muted">
                  No comments yet. The form below still lets the backend enforce
                  whether the current user is allowed to add one.
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
                        {comment.authorName} - {comment.createdAt}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <AddCommentForm itemId={item.id} selectedUserId={selectedUserId} />
          </div>

          <div className="grid gap-5">
            {isOwner && hasOwnerBookingPreview ? (
              <Card className="grid gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
                    Booking preview
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-foreground">
                    Owner-only booking snapshot
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    This block only appears for the item owner when preview data
                    is included in the item details response.
                  </p>
                </div>

                <div className="grid gap-3">
                  {item.lastBooking ? (
                    <BookingPreviewCard
                      booking={item.lastBooking}
                      title="Last booking"
                    />
                  ) : null}
                  {item.nextBooking ? (
                    <BookingPreviewCard
                      booking={item.nextBooking}
                      title="Next booking"
                    />
                  ) : null}
                </div>
              </Card>
            ) : null}

            {showBookingCta ? (
              <CreateBookingForm item={item} selectedUserId={selectedUserId} />
            ) : null}

            {!item.isAvailable ? (
              <Card>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-danger">
                  Booking unavailable
                </p>
                <p className="mt-3 text-sm leading-7 text-muted">
                  This item is currently unavailable, so the booking CTA stays
                  hidden.
                </p>
              </Card>
            ) : null}

            {isOwner ? (
              <Card>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
                  Owner mode
                </p>
                <p className="mt-3 text-sm leading-7 text-muted">
                  You own this item, so booking controls are hidden and the page
                  focuses on comments plus booking preview data instead.
                </p>
              </Card>
            ) : null}
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}
