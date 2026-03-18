export interface BookingPreview {
  id: string;
  bookerId: string;
  startAt: string | null;
  endAt: string | null;
  status: string | null;
}

export interface BookingDraft {
  itemId: string;
  startAt: string;
  endAt: string;
}
