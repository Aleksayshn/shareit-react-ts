export interface BookingPartyDto {
  id: number;
  name: string;
}

export interface BookingItemSummaryDto {
  id: number;
  name: string;
}

export interface BookingPreviewDto {
  id: number;
  bookerId: number;
  start?: string | null;
  end?: string | null;
  status?: string | null;
}

export interface BookingDto {
  id: number;
  start: string;
  end: string;
  status: string;
  booker: BookingPartyDto;
  item: BookingItemSummaryDto;
}

export interface CreateBookingRequestDto {
  itemId: number;
  start: string;
  end: string;
}
