export interface BookingPreviewDto {
  id: number;
  bookerId: number;
  start?: string | null;
  end?: string | null;
  status?: string | null;
}

export interface CreateBookingRequestDto {
  itemId: number;
  start: string;
  end: string;
}
