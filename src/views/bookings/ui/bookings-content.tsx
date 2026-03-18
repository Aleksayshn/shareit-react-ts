"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  bookingPageSizeOptions,
  bookingQueryKeys,
  getMyBookings,
  getOwnerBookings,
  normalizeBookingFilterState,
  type Booking,
} from "@/src/entities/booking";
import {
  ApproveBookingButton,
  FilterBookingsByState,
  RejectBookingButton,
} from "@/src/features";
import { AppError } from "@/src/shared/lib/errors";
import { useActiveUserStore } from "@/src/shared/model";
import {
  Card,
  EmptyState,
  ErrorState,
  Field,
  LoadingState,
  Select,
} from "@/src/shared/ui";
import { BookingList } from "@/src/widgets";

type BookingViewMode = "mine" | "owner";

interface BookingsContentProps {
  mode: BookingViewMode;
}

function parsePositiveInt(value: string | null, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return fallback;
  }

  return Math.floor(parsed);
}

function useBookingListUrlState() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const state = normalizeBookingFilterState(searchParams.get("state"));
  const from = parsePositiveInt(searchParams.get("from"), 0);
  const requestedSize = parsePositiveInt(searchParams.get("size"), 10);
  const size = bookingPageSizeOptions.includes(
    requestedSize as (typeof bookingPageSizeOptions)[number],
  )
    ? requestedSize
    : 10;

  function buildHref(next: { state?: string; from?: number; size?: number }) {
    const params = new URLSearchParams(searchParams.toString());

    if (next.state !== undefined) {
      params.set("state", next.state);
    }

    if (next.from !== undefined) {
      params.set("from", String(next.from));
    }

    if (next.size !== undefined) {
      params.set("size", String(next.size));
    }

    return `${pathname}?${params.toString()}`;
  }

  return {
    state,
    from,
    size,
    buildHref,
  };
}

function OwnerBookingActions({ booking }: { booking: Booking }) {
  const [isBusy, setIsBusy] = useState(false);

  if (booking.status !== "WAITING") {
    return null;
  }

  return (
    <>
      <ApproveBookingButton
        bookingId={booking.id}
        disabled={isBusy}
        onPendingChange={setIsBusy}
      />
      <RejectBookingButton
        bookingId={booking.id}
        disabled={isBusy}
        onPendingChange={setIsBusy}
      />
    </>
  );
}

export function BookingsContent({ mode }: BookingsContentProps) {
  const router = useRouter();
  const selectedUserId = useActiveUserStore((state) => state.selectedUserId);
  const hasHydrated = useActiveUserStore((state) => state.hasHydrated);
  const { state, from, size, buildHref } = useBookingListUrlState();

  const bookingsQuery = useQuery({
    queryKey:
      mode === "mine"
        ? bookingQueryKeys.mine(selectedUserId, state, from, size)
        : bookingQueryKeys.owner(selectedUserId, state, from, size),
    queryFn: () =>
      mode === "mine"
        ? getMyBookings({ state, from, size })
        : getOwnerBookings({ state, from, size }),
    enabled: Boolean(selectedUserId),
  });

  const errorMessage =
    bookingsQuery.error instanceof AppError
      ? bookingsQuery.error.message
      : "Unable to load bookings right now.";

  const pagination = useMemo(() => {
    const count = bookingsQuery.data?.length ?? 0;

    return {
      from,
      size,
      hasPrevious: from > 0,
      hasNext: count === size,
      previousHref: buildHref({
        from: Math.max(0, from - size),
      }),
      nextHref: buildHref({
        from: from + size,
      }),
    };
  }, [bookingsQuery.data?.length, buildHref, from, size]);

  const emptyTitle =
    mode === "mine" ? "No bookings found" : "No booking requests found";
  const emptyDescription =
    mode === "mine"
      ? "Try another state filter or move through pages to find older bookings."
      : "Your items do not have matching requests for this filter yet.";

  return (
    <>
      {!hasHydrated ? (
        <LoadingState message="Restoring the active sharer..." />
      ) : null}

      {hasHydrated && !selectedUserId ? (
        <EmptyState
          description="Booking pages depend on the active user store because the API client injects `X-Sharer-User-Id` from the selected sharer. Use the header control to set it."
          title="No active sharer selected"
        />
      ) : null}

      {selectedUserId ? (
        <Card className="grid gap-4 lg:grid-cols-[1fr_220px]">
          <FilterBookingsByState value={state} />
          <Field htmlFor="booking-page-size" label="Page size">
            <Select
              id="booking-page-size"
              value={String(size)}
              onChange={(event) => {
                router.push(
                  buildHref({
                    size: Number(event.target.value),
                    from: 0,
                  }),
                );
              }}
            >
              {bookingPageSizeOptions.map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize} per page
                </option>
              ))}
            </Select>
          </Field>
        </Card>
      ) : null}

      {bookingsQuery.isPending ? (
        <LoadingState message="Loading bookings..." />
      ) : null}

      {bookingsQuery.isError ? (
        <ErrorState
          description={errorMessage}
          title="Bookings error"
        />
      ) : null}

      {bookingsQuery.isSuccess && selectedUserId ? (
        <BookingList
          bookings={bookingsQuery.data}
          emptyDescription={emptyDescription}
          emptyTitle={emptyTitle}
          pagination={pagination}
          renderActions={
            mode === "owner"
              ? (booking) => <OwnerBookingActions booking={booking} />
              : undefined
          }
        />
      ) : null}
    </>
  );
}
