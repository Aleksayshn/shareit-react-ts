const itemRootKey = ["items"] as const;

export const itemQueryKeys = {
  all: itemRootKey,
  lists: () => [...itemRootKey, "list"] as const,
  mine: (selectedUserId: string | null) =>
    [...itemRootKey, "list", "mine", selectedUserId ?? "anonymous"] as const,
  search: (text: string) =>
    [...itemRootKey, "search", text.trim().toLowerCase()] as const,
  detail: (itemId: string) => [...itemRootKey, "detail", itemId] as const,
};
