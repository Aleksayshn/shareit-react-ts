import type { BookingFilterState } from "./booking";

export const bookingFilterOptions: Array<{
  value: BookingFilterState;
  label: string;
}> = [
  { value: "ALL", label: "All activity" },
  { value: "WAITING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Declined" },
  { value: "CURRENT", label: "Happening now" },
  { value: "FUTURE", label: "Upcoming" },
  { value: "PAST", label: "Past" },
];

export const bookingPageSizeOptions = [5, 10, 20] as const;
