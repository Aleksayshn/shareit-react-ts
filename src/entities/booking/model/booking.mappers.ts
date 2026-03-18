import type {
  Booking,
  BookingDraft,
  BookingFilterState,
  BookingParty,
  BookingPreview,
  BookingStatus,
} from "./booking";
import type { BookingDto, BookingPreviewDto, CreateBookingRequestDto } from "./booking.types";

const knownStatuses = new Set(["WAITING", "APPROVED", "REJECTED", "CANCELED"]);
const knownFilterStates = new Set([
  "ALL",
  "CURRENT",
  "PAST",
  "FUTURE",
  "WAITING",
  "REJECTED",
  "APPROVED",
]);

export function normalizeBookingStatus(value: string | null | undefined): BookingStatus {
  if (!value) {
    return "UNKNOWN";
  }

  return knownStatuses.has(value) ? (value as BookingStatus) : "UNKNOWN";
}

export function normalizeBookingFilterState(value: string | null | undefined): BookingFilterState {
  if (!value) {
    return "ALL";
  }

  return knownFilterStates.has(value) ? (value as BookingFilterState) : "ALL";
}

export function mapBookingPartyDto(dto: { id: number; name: string }): BookingParty {
  return {
    id: String(dto.id),
    name: dto.name,
  };
}

export function mapBookingDtoToBooking(dto: BookingDto): Booking {
  return {
    id: String(dto.id),
    startAt: dto.start,
    endAt: dto.end,
    status: normalizeBookingStatus(dto.status),
    item: {
      id: String(dto.item.id),
      name: dto.item.name,
    },
    booker: mapBookingPartyDto(dto.booker),
  };
}

export function mapBookingDtoToBookingPreview(
  dto: BookingPreviewDto,
): BookingPreview {
  return {
    id: String(dto.id),
    bookerId: String(dto.bookerId),
    startAt: dto.start ?? null,
    endAt: dto.end ?? null,
    status: dto.status ? normalizeBookingStatus(dto.status) : null,
  };
}

export function mapBookingDraftToCreateBookingRequest(
  draft: BookingDraft,
): CreateBookingRequestDto {
  return {
    itemId: Number(draft.itemId),
    start: new Date(draft.startAt).toISOString(),
    end: new Date(draft.endAt).toISOString(),
  };
}
