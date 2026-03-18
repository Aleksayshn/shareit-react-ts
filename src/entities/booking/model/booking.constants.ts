import type { BookingFilterState } from "./booking";

export const bookingFilterOptions: Array<{
  value: BookingFilterState;
  label: string;
}> = [
  { value: "ALL", label: "All states" },
  { value: "WAITING", label: "Waiting" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "CURRENT", label: "Current" },
  { value: "FUTURE", label: "Future" },
  { value: "PAST", label: "Past" },
];

export const bookingPageSizeOptions = [5, 10, 20] as const;
