import type { ItemSearchRequest } from "./item";

const itemRootKey = ["items"] as const;

export const itemQueryKeys = {
  all: itemRootKey,
  lists: () => [...itemRootKey, "list"] as const,
  mine: (userId: string | null) =>
    [...itemRootKey, "list", "mine", userId ?? "guest"] as const,
  featured: (from = 0, size = 6) =>
    [...itemRootKey, "featured", from, size] as const,
  search: ({ text, from = 0, size = 20 }: ItemSearchRequest) =>
    [...itemRootKey, "search", text.trim().toLowerCase(), from, size] as const,
  detail: (itemId: string) => [...itemRootKey, "detail", itemId] as const,
};
