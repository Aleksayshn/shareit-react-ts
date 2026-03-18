import type { ReactNode } from "react";
import { BookingStatusBadge, type Booking } from "@/src/entities/booking";
import { Card, EmptyState, LinkButton } from "@/src/shared/ui";

function formatBookingMoment(value: string) {
  const formatted = new Date(value);

  if (Number.isNaN(formatted.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(formatted);
}

interface BookingListProps {
  bookings: Booking[];
  emptyTitle: string;
  emptyDescription: string;
  pagination: {
    from: number;
    size: number;
    hasPrevious: boolean;
    hasNext: boolean;
    previousHref: string;
    nextHref: string;
  };
  renderActions?: (booking: Booking) => ReactNode;
}

export function BookingList({
  bookings,
  emptyTitle,
  emptyDescription,
  pagination,
  renderActions,
}: BookingListProps) {
  return (
    <div className="grid gap-5">
      {bookings.length === 0 ? (
        <EmptyState
          description={emptyDescription}
          title={emptyTitle}
        />
      ) : (
        <section className="grid gap-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="grid gap-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="grid gap-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-semibold text-foreground">
                      {booking.item.name}
                    </h2>
                    <BookingStatusBadge status={booking.status} />
                  </div>
                  <p className="text-sm leading-7 text-muted">
                    Booker:{" "}
                    <span className="font-medium text-foreground">
                      {booking.booker.name}
                    </span>
                  </p>
                </div>

                <LinkButton href={`/items/${booking.item.id}`} size="sm" variant="secondary">
                  Open item
                </LinkButton>
              </div>

              <dl className="grid gap-2 text-sm text-muted md:grid-cols-2">
                <div className="flex justify-between gap-4 rounded-2xl bg-surface px-4 py-3">
                  <dt>Booking ID</dt>
                  <dd className="font-medium text-foreground">{booking.id}</dd>
                </div>
                <div className="flex justify-between gap-4 rounded-2xl bg-surface px-4 py-3">
                  <dt>Booker ID</dt>
                  <dd className="font-medium text-foreground">{booking.booker.id}</dd>
                </div>
                <div className="flex justify-between gap-4 rounded-2xl bg-surface px-4 py-3">
                  <dt>Start</dt>
                  <dd className="font-medium text-foreground">
                    {formatBookingMoment(booking.startAt)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 rounded-2xl bg-surface px-4 py-3">
                  <dt>End</dt>
                  <dd className="font-medium text-foreground">
                    {formatBookingMoment(booking.endAt)}
                  </dd>
                </div>
              </dl>

              {renderActions ? (
                <div className="flex flex-wrap gap-3 border-t border-border/70 pt-4">
                  {renderActions(booking)}
                </div>
              ) : null}
            </Card>
          ))}
        </section>
      )}

      <Card className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted">
          Viewing bookings from <span className="font-medium text-foreground">{pagination.from}</span>{" "}
          with page size <span className="font-medium text-foreground">{pagination.size}</span>.
        </p>
        <div className="flex flex-wrap gap-3">
          <LinkButton
            aria-disabled={!pagination.hasPrevious}
            className={!pagination.hasPrevious ? "pointer-events-none opacity-50" : undefined}
            href={pagination.previousHref}
            size="sm"
            variant="ghost"
          >
            Previous
          </LinkButton>
          <LinkButton
            aria-disabled={!pagination.hasNext}
            className={!pagination.hasNext ? "pointer-events-none opacity-50" : undefined}
            href={pagination.nextHref}
            size="sm"
          >
            Next
          </LinkButton>
        </div>
      </Card>
    </div>
  );
}
