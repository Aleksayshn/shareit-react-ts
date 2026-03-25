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
import { useAuth } from "@/src/shared/auth";
import { AppError } from "@/src/shared/lib/errors";
import {
  Card,
  ExpandableCard,
  ErrorState,
  Field,
  LoadingState,
  SectionHeader,
  Select,
  StatCard,
  LinkButton,
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
  const { user, isAuthenticated } = useAuth();
  const { state, from, size, buildHref } = useBookingListUrlState();

  const bookingsQuery = useQuery({
    queryKey:
      mode === "mine"
        ? bookingQueryKeys.mine(user?.id ?? null, state, from, size)
        : bookingQueryKeys.owner(user?.id ?? null, state, from, size),
    queryFn: () =>
      mode === "mine"
        ? getMyBookings({ state, from, size })
        : getOwnerBookings({ state, from, size }),
    enabled: Boolean(user),
  });

  const errorMessage =
    bookingsQuery.error instanceof AppError
      ? bookingsQuery.error.message
      : mode === "mine"
        ? "We couldn't load your borrowing activity right now."
        : "We couldn't load your lending requests right now.";
  const bookings = bookingsQuery.data ?? [];

  const pagination = useMemo(() => {
    const count = bookings.length;

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
  }, [bookings.length, buildHref, from, size]);

  const emptyTitle =
    mode === "mine" ? "No borrowing activity yet" : "No lending requests yet";
  const emptyDescription =
    mode === "mine"
      ? "When you request to borrow something, it will appear here."
      : "Requests for your listings will appear here when other people want to borrow them.";
  const pendingCount = bookings.filter((booking) => booking.status === "WAITING").length;
  const approvedCount = bookings.filter((booking) => booking.status === "APPROVED").length;
  const declinedCount = bookings.filter((booking) => booking.status === "REJECTED").length;

  return (
    <>
      {!isAuthenticated ? (
        <Card className="grid gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Sign in required
          </p>
          <h2 className="text-2xl font-semibold text-foreground">
            Sign in to view requests
          </h2>
          <p className="text-sm leading-7 text-muted">
            {mode === "mine"
              ? "Sign in to review the requests you've sent and track upcoming borrow dates."
              : "Sign in to manage the requests people have sent for your listings."}
          </p>
          <div>
            <LinkButton
              href={`/login?next=${encodeURIComponent(
                mode === "mine" ? "/bookings" : "/bookings/owner",
              )}`}
              size="sm"
            >
              Sign in to continue
            </LinkButton>
          </div>
        </Card>
      ) : null}

      {isAuthenticated && user ? (
        <div className="grid gap-6">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
            <Card
              className="grid gap-4"
              tone={mode === "owner" && pendingCount > 0 ? "accent" : "default"}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                  {mode === "mine" ? "Requests you sent" : "Requests from others"}
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                  {mode === "mine"
                    ? "Keep track of what you want to borrow"
                    : "Manage incoming requests with confidence"}
                </h2>
              </div>
              <p className="text-sm leading-7 text-muted">
                {mode === "mine"
                  ? "Check the latest status of your requests, revisit listing details, and keep an eye on upcoming dates."
                  : "See who wants to borrow your items and respond quickly to anything still waiting for a decision."}
              </p>
            </Card>

            <StatCard
              description="Requests shown on this page right now."
              label="On this page"
              value={bookingsQuery.isSuccess ? bookings.length : "--"}
            />
            <StatCard
              description={
                mode === "mine"
                  ? "Requests waiting for the lender to reply."
                  : "Requests still waiting for your response."
              }
              label={mode === "mine" ? "Pending" : "Needs review"}
              tone={pendingCount > 0 ? "accent" : "default"}
              value={bookingsQuery.isSuccess ? pendingCount : "--"}
            />
            <StatCard
              description={
                mode === "mine"
                  ? "Requests approved for borrowing."
                  : "Requests you have already approved."
              }
              label="Approved"
              value={bookingsQuery.isSuccess ? approvedCount : "--"}
            />
          </div>

          <Card className="grid gap-4 lg:grid-cols-[1fr_220px]">
            <div className="grid gap-4">
              <SectionHeader
                description={
                  mode === "mine"
                    ? "Filter the requests you sent so it is easy to spot what is pending, approved, upcoming, or past."
                    : "Filter incoming requests so you can focus on what needs attention first."
                }
                title={mode === "mine" ? "Filter your borrowing activity" : "Filter incoming requests"}
              />
              <FilterBookingsByState value={state} />
            </div>
            <Field htmlFor="booking-page-size" label="Results per page">
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

          {mode === "owner" && pendingCount > 0 ? (
            <ExpandableCard
              closeLabel="Hide reminder"
              defaultOpen
              description={`You have ${pendingCount} pending request${pendingCount === 1 ? "" : "s"} waiting for a decision on this page.`}
              eyebrow="Needs attention"
              openLabel="Show reminder"
              title="Respond to pending requests"
              tone="accent"
            >
              <p className="text-sm leading-7 text-muted">
                Approve requests you can accommodate and decline anything that
                does not work for your availability.
              </p>
            </ExpandableCard>
          ) : null}

          {mode === "mine" && bookingsQuery.isSuccess ? (
            <Card className="grid gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                Status overview
              </p>
              <p className="text-sm leading-7 text-muted">
                {pendingCount > 0
                  ? `${pendingCount} request${pendingCount === 1 ? "" : "s"} are still waiting for a reply.`
                  : approvedCount > 0
                    ? `${approvedCount} request${approvedCount === 1 ? "" : "s"} are already approved.`
                    : declinedCount > 0
                      ? `${declinedCount} request${declinedCount === 1 ? "" : "s"} were declined.`
                      : "Once you request to borrow something, its status will appear here."}
              </p>
            </Card>
          ) : null}

          <div className="grid gap-4">
            <SectionHeader
              description={
                mode === "mine"
                  ? "These are the requests you've sent."
                  : "These are the requests other people have made for your listings."
              }
              eyebrow={mode === "mine" ? "Borrowing" : "Lending"}
              title={mode === "mine" ? "Requests you sent" : "Requests from others"}
            />

            {bookingsQuery.isPending ? (
              <LoadingState
                message={
                  mode === "mine"
                    ? "Loading your borrowing activity..."
                    : "Loading lending requests..."
                }
              />
            ) : null}

            {bookingsQuery.isError ? (
              <ErrorState
                description={errorMessage}
                title={mode === "mine" ? "Borrowing unavailable" : "Lending unavailable"}
              />
            ) : null}

            {bookingsQuery.isSuccess ? (
              <BookingList
                mode={mode}
                bookings={bookings}
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
          </div>
        </div>
      ) : null}
    </>
  );
}
