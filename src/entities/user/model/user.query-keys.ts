const userRootKey = ["users"] as const;

export const userQueryKeys = {
  all: userRootKey,
  list: () => [...userRootKey, "list"] as const,
  detail: (userId: string) => [...userRootKey, "detail", userId] as const,
};
