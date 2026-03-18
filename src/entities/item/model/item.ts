import type { BookingPreview } from "@/src/entities/booking";
import type { Comment } from "@/src/entities/comment";

export interface Item {
  id: string;
  name: string;
  description: string;
  isAvailable: boolean;
  ownerId: string | null;
  requestId: number | null;
  lastBooking: BookingPreview | null;
  nextBooking: BookingPreview | null;
  comments: Comment[];
}

export interface ItemDraft {
  name: string;
  description: string;
  available: boolean;
}

export const emptyItemDraft: ItemDraft = {
  name: "",
  description: "",
  available: true,
};
