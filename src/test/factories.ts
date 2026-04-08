import { AppError } from "@/src/shared/lib/errors";
import type { AuthUser } from "@/src/shared/auth";
import type { Booking, BookingPreview, BookingStatus } from "@/src/entities/booking";
import type { Comment } from "@/src/entities/comment";
import type { Item } from "@/src/entities/item";

export function createAuthUser(overrides: Partial<AuthUser> = {}): AuthUser {
  return {
    id: "user-1",
    name: "Alex Johnson",
    email: "alex@example.com",
    ...overrides,
  };
}

export function createComment(overrides: Partial<Comment> = {}): Comment {
  return {
    id: "comment-1",
    text: "Worked perfectly.",
    authorName: "Taylor Borrower",
    createdAt: "2026-04-01T10:00:00.000Z",
    ...overrides,
  };
}

export function createBookingPreview(
  overrides: Partial<BookingPreview> = {},
): BookingPreview {
  return {
    id: "booking-preview-1",
    bookerId: "booker-1",
    startAt: "2026-04-02T09:00:00.000Z",
    endAt: "2026-04-03T09:00:00.000Z",
    status: "WAITING",
    ...overrides,
  };
}

export function createItem(overrides: Partial<Item> = {}): Item {
  return {
    id: "item-1",
    name: "Camping Stove",
    description: "Compact stove for weekend trips.",
    isAvailable: true,
    ownerId: "owner-1",
    requestId: null,
    lastBooking: null,
    nextBooking: null,
    comments: [],
    ...overrides,
  };
}

export function createBooking(
  overrides: Partial<Booking> = {},
  status: BookingStatus = "WAITING",
): Booking {
  return {
    id: "booking-1",
    startAt: "2026-04-10T09:00:00.000Z",
    endAt: "2026-04-11T09:00:00.000Z",
    status,
    item: {
      id: "item-1",
      name: "Camping Stove",
    },
    booker: {
      id: "booker-1",
      name: "Taylor Borrower",
    },
    ...overrides,
  };
}

export function createAppError(
  message = "Something went wrong.",
  overrides: Partial<ConstructorParameters<typeof AppError>[0]> = {},
) {
  return new AppError({
    code: "UNKNOWN_ERROR",
    message,
    ...overrides,
  });
}
