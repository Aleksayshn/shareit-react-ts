import { apiClient } from "@/src/shared/api";
import {
  mapBookingDraftToCreateBookingRequest,
  mapBookingDtoToBooking,
  mapBookingDtoToBookingPreview,
  type BookingDraft,
  type BookingDto,
  type BookingFilterState,
  type BookingPreviewDto,
  type CreateBookingRequestDto,
} from "../model";

interface BookingListRequest {
  state: BookingFilterState;
  from: number;
  size: number;
}

function createBookingListQuery({ state, from, size }: BookingListRequest) {
  return {
    state,
    from,
    size,
  };
}

export async function createBooking(draft: BookingDraft) {
  const booking = await apiClient.post<BookingPreviewDto, CreateBookingRequestDto>(
    "/bookings",
    mapBookingDraftToCreateBookingRequest(draft),
  );

  return mapBookingDtoToBookingPreview(booking);
}

export async function getMyBookings(request: BookingListRequest) {
  const bookings = await apiClient.get<BookingDto[]>("/bookings", {
    query: createBookingListQuery(request),
  });

  return bookings.map(mapBookingDtoToBooking);
}

export async function getBooking(bookingId: string) {
  const booking = await apiClient.get<BookingDto>(`/bookings/${bookingId}`);

  return mapBookingDtoToBooking(booking);
}

export async function getOwnerBookings(request: BookingListRequest) {
  const bookings = await apiClient.get<BookingDto[]>("/bookings/owner", {
    query: createBookingListQuery(request),
  });

  return bookings.map(mapBookingDtoToBooking);
}

export async function approveBooking(bookingId: string) {
  const booking = await apiClient.patch<BookingDto>(
    `/bookings/${bookingId}`,
    undefined,
    {
      query: {
        approved: true,
      },
    },
  );

  return mapBookingDtoToBooking(booking);
}

export async function rejectBooking(bookingId: string) {
  const booking = await apiClient.patch<BookingDto>(
    `/bookings/${bookingId}`,
    undefined,
    {
      query: {
        approved: false,
      },
    },
  );

  return mapBookingDtoToBooking(booking);
}
