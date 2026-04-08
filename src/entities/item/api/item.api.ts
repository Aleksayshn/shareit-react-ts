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

// The public listings feed currently comes from the text-search endpoint,
// so we use a broad fallback term until the backend exposes a dedicated feed.
const PUBLIC_LISTINGS_SEARCH_TERM = "a";

async function getPublicListings({ from = 0, size = 6 } = {}) {
  const items = await apiClient.get<ItemDto[]>("/items/search", {
    query: {
      text: PUBLIC_LISTINGS_SEARCH_TERM,
      from,
      size,
    },
  });

  return items.map(mapItemDtoToItem);
}

export async function getMyItems() {
  const items = await apiClient.get<ItemDto[]>("/items");

  return items.map(mapItemDtoToItem);
}

export async function getFeaturedItems({ from = 0, size = 6 } = {}) {
  return getPublicListings({ from, size });
}

export async function getDiscoveryItems({ from = 0, size = 20 } = {}) {
  return getPublicListings({ from, size });
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
