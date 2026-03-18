import type { BookingPreviewDto } from "@/src/entities/booking";
import type { CommentDto } from "@/src/entities/comment";

export interface ItemDto {
  id: number;
  name: string;
  description: string;
  available: boolean;
  ownerId?: number | null;
  requestId?: number | null;
  lastBooking?: BookingPreviewDto | null;
  nextBooking?: BookingPreviewDto | null;
  comments?: CommentDto[];
}

export interface CreateItemRequestDto {
  name: string;
  description: string;
  available: boolean;
}

export interface UpdateItemRequestDto {
  name?: string;
  description?: string;
  available?: boolean;
}
