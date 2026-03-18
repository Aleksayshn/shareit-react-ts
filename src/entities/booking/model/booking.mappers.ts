import type { BookingDraft, BookingPreview } from "./booking";
import type { BookingPreviewDto, CreateBookingRequestDto } from "./booking.types";

export function mapBookingDtoToBookingPreview(
  dto: BookingPreviewDto,
): BookingPreview {
  return {
    id: String(dto.id),
    bookerId: String(dto.bookerId),
    startAt: dto.start ?? null,
    endAt: dto.end ?? null,
    status: dto.status ?? null,
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
