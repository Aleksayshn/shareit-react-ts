import type { ItemSearchRequest } from "./item";

const itemRootKey = ["items"] as const;

export const itemQueryKeys = {
  all: itemRootKey,
  lists: () => [...itemRootKey, "list"] as const,
  mine: (selectedUserId: string | null) =>
    [...itemRootKey, "list", "mine", selectedUserId ?? "anonymous"] as const,
  search: ({ text, from = 0, size = 20 }: ItemSearchRequest) =>
    [...itemRootKey, "search", text.trim().toLowerCase(), from, size] as const,
  detail: (itemId: string) => [...itemRootKey, "detail", itemId] as const,
};
