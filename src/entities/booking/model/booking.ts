export type BookingStatus =
  | "WAITING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELED"
  | "UNKNOWN";

export type BookingFilterState =
  | "ALL"
  | "CURRENT"
  | "PAST"
  | "FUTURE"
  | "WAITING"
  | "REJECTED"
  | "APPROVED";

export interface BookingPreview {
  id: string;
  bookerId: string;
  startAt: string | null;
  endAt: string | null;
  status: BookingStatus | null;
}

export interface BookingParty {
  id: string;
  name: string;
}

export interface BookingItemSummary {
  id: string;
  name: string;
}

export interface Booking {
  id: string;
  startAt: string;
  endAt: string;
  status: BookingStatus;
  item: BookingItemSummary;
  booker: BookingParty;
}

export interface BookingDraft {
  itemId: string;
  startAt: string;
  endAt: string;
}
