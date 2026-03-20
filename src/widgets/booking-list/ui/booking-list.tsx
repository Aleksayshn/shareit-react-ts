import type { ReactNode } from "react";
import { BookingStatusBadge, type Booking } from "@/src/entities/booking";
import { cn } from "@/src/shared/lib";
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
  mode: "mine" | "owner";
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

function getStatusHint(mode: "mine" | "owner", booking: Booking) {
  if (mode === "owner") {
    switch (booking.status) {
      case "WAITING":
        return "Awaiting your response.";
      case "APPROVED":
        return "You've approved this request.";
      case "REJECTED":
        return "This request was declined.";
      case "CANCELED":
        return "This request was canceled.";
      default:
        return "Review the request details below.";
    }
  }

  switch (booking.status) {
    case "WAITING":
      return "Waiting for the lender to respond.";
    case "APPROVED":
      return "Your request is approved for these dates.";
    case "REJECTED":
      return "This request was declined.";
    case "CANCELED":
      return "This request was canceled.";
    default:
      return "Track the latest status of your request here.";
  }
}

export function BookingList({
  mode,
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
            <Card
              key={booking.id}
              className={cn(
                "grid gap-5",
                mode === "owner" && booking.status === "WAITING"
                  ? "border-accent/35 shadow-[0_20px_48px_-34px_rgba(15,118,110,0.55)]"
                  : undefined,
              )}
              tone={mode === "owner" && booking.status === "WAITING" ? "accent" : "default"}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="grid gap-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-semibold text-foreground">
                      {booking.item.name}
                    </h2>
                    <BookingStatusBadge status={booking.status} />
                  </div>
                  <p className="text-sm leading-7 text-muted">
                    {mode === "owner" ? (
                      <>
                        Requested by{" "}
                        <span className="font-medium text-foreground">
                          {booking.booker.name}
                        </span>
                      </>
                    ) : (
                      "Your request to borrow this item."
                    )}
                  </p>
                  <p className="text-sm font-medium text-foreground/85">
                    {getStatusHint(mode, booking)}
                  </p>
                </div>

                <LinkButton href={`/items/${booking.item.id}`} size="sm" variant="secondary">
                  View listing
                </LinkButton>
              </div>

              <dl className="grid gap-2 text-sm text-muted md:grid-cols-2">
                <div className="flex justify-between gap-4 rounded-2xl bg-surface px-4 py-3">
                  <dt>From</dt>
                  <dd className="font-medium text-foreground">
                    {formatBookingMoment(booking.startAt)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 rounded-2xl bg-surface px-4 py-3">
                  <dt>Until</dt>
                  <dd className="font-medium text-foreground">
                    {formatBookingMoment(booking.endAt)}
                  </dd>
                </div>
              </dl>

              {renderActions ? (
                <div className="grid gap-3 border-t border-border/70 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                    Actions
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {renderActions(booking)}
                  </div>
                </div>
              ) : null}
            </Card>
          ))}
        </section>
      )}

      <Card className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted">
          Showing <span className="font-medium text-foreground">{bookings.length}</span>{" "}
          request{bookings.length === 1 ? "" : "s"} on this page.
        </p>
        <div className="flex flex-wrap gap-3">
          <LinkButton
            aria-disabled={!pagination.hasPrevious}
            className={!pagination.hasPrevious ? "pointer-events-none opacity-50" : undefined}
            href={pagination.previousHref}
            size="sm"
            variant="ghost"
          >
            Previous page
          </LinkButton>
          <LinkButton
            aria-disabled={!pagination.hasNext}
            className={!pagination.hasNext ? "pointer-events-none opacity-50" : undefined}
            href={pagination.nextHref}
            size="sm"
          >
            Next page
          </LinkButton>
        </div>
      </Card>
    </div>
  );
}
