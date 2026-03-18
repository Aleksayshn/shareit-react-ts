import type { BookingFilterState } from "./booking";

const bookingRootKey = ["bookings"] as const;

export const bookingQueryKeys = {
  all: bookingRootKey,
  mine: (
    selectedUserId: string | null,
    state: BookingFilterState,
    from: number,
    size: number,
  ) => [...bookingRootKey, "mine", selectedUserId ?? "anonymous", state, from, size] as const,
  owner: (
    selectedUserId: string | null,
    state: BookingFilterState,
    from: number,
    size: number,
  ) => [...bookingRootKey, "owner", selectedUserId ?? "anonymous", state, from, size] as const,
};
