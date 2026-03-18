import { mapBookingDtoToBookingPreview } from "@/src/entities/booking";
import { mapCommentDtoToComment } from "@/src/entities/comment";
import type { Item, ItemDraft } from "./item";
import type {
  CreateItemRequestDto,
  ItemDto,
  UpdateItemRequestDto,
} from "./item.types";

export function mapItemDtoToItem(dto: ItemDto): Item {
  return {
    id: String(dto.id),
    name: dto.name,
    description: dto.description,
    isAvailable: dto.available,
    ownerId: dto.ownerId ? String(dto.ownerId) : null,
    requestId: dto.requestId ?? null,
    lastBooking: dto.lastBooking
      ? mapBookingDtoToBookingPreview(dto.lastBooking)
      : null,
    nextBooking: dto.nextBooking
      ? mapBookingDtoToBookingPreview(dto.nextBooking)
      : null,
    comments: (dto.comments ?? []).map(mapCommentDtoToComment),
  };
}

export function mapItemDraftToCreateItemRequest(
  draft: ItemDraft,
): CreateItemRequestDto {
  return {
    name: draft.name.trim(),
    description: draft.description.trim(),
    available: draft.available,
  };
}

export function mapItemDraftToUpdateItemRequest(
  draft: ItemDraft,
): UpdateItemRequestDto {
  return {
    name: draft.name.trim(),
    description: draft.description.trim(),
    available: draft.available,
  };
}
