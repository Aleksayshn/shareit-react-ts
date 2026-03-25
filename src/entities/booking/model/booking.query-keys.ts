import type { BookingFilterState } from "./booking";

const bookingRootKey = ["bookings"] as const;

export const bookingQueryKeys = {
  all: bookingRootKey,
  detail: (bookingId: string) => [...bookingRootKey, "detail", bookingId] as const,
  mine: (
    userId: string | null,
    state: BookingFilterState,
    from: number,
    size: number,
  ) => [...bookingRootKey, "mine", userId ?? "guest", state, from, size] as const,
  owner: (
    userId: string | null,
    state: BookingFilterState,
    from: number,
    size: number,
  ) => [...bookingRootKey, "owner", userId ?? "guest", state, from, size] as const,
};
