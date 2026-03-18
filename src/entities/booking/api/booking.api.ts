import { apiClient } from "@/src/shared/api";
import {
  mapBookingDraftToCreateBookingRequest,
  mapBookingDtoToBookingPreview,
  type BookingDraft,
  type BookingPreviewDto,
  type CreateBookingRequestDto,
} from "../model";

export async function createBooking(draft: BookingDraft) {
  const booking = await apiClient.post<BookingPreviewDto, CreateBookingRequestDto>(
    "/bookings",
    mapBookingDraftToCreateBookingRequest(draft),
  );

  return mapBookingDtoToBookingPreview(booking);
}
