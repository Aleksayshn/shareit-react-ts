import { apiClient } from "@/src/shared/api";
import type { ItemDraft, ItemSearchRequest } from "../model/item";
import {
  mapItemDraftToCreateItemRequest,
  mapItemDraftToUpdateItemRequest,
  mapItemDtoToItem,
} from "../model/item.mappers";
import type {
  CreateItemRequestDto,
  ItemDto,
  UpdateItemRequestDto,
} from "../model/item.types";

const FEATURED_SEARCH_TERM = "a";

export async function getMyItems() {
  const items = await apiClient.get<ItemDto[]>("/items");

  return items.map(mapItemDtoToItem);
}

export async function getFeaturedItems({ from = 0, size = 6 } = {}) {
  const items = await apiClient.get<ItemDto[]>("/items/search", {
    query: {
      text: FEATURED_SEARCH_TERM,
      from,
      size,
    },
  });

  return items.map(mapItemDtoToItem);
}

export async function searchItems({
  text,
  from = 0,
  size = 20,
}: ItemSearchRequest) {
  const normalizedText = text.trim();

  if (!normalizedText) {
    return [];
  }

  const items = await apiClient.get<ItemDto[]>("/items/search", {
    query: {
      text: normalizedText,
      from,
      size,
    },
  });

  return items.map(mapItemDtoToItem);
}

export async function getItemDetails(itemId: string) {
  const item = await apiClient.get<ItemDto>(`/items/${itemId}`);

  return mapItemDtoToItem(item);
}

export async function createItem(draft: ItemDraft) {
  const item = await apiClient.post<ItemDto, CreateItemRequestDto>(
    "/items",
    mapItemDraftToCreateItemRequest(draft),
  );

  return mapItemDtoToItem(item);
}

export async function updateItem(itemId: string, draft: ItemDraft) {
  const item = await apiClient.patch<ItemDto, UpdateItemRequestDto>(
    `/items/${itemId}`,
    mapItemDraftToUpdateItemRequest(draft),
  );

  return mapItemDtoToItem(item);
}
