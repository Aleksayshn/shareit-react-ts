"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsers, userQueryKeys } from "@/src/entities/user";
import { useActiveUserStore } from "@/src/shared/model";
import { Select } from "@/src/shared/ui";

export function ActiveUserSelect() {
  const selectedUserId = useActiveUserStore((state) => state.selectedUserId);
  const setSelectedUserId = useActiveUserStore((state) => state.setSelectedUserId);
  const usersQuery = useQuery({
    queryKey: userQueryKeys.list(),
    queryFn: getUsers,
  });

  return (
    <Select
      aria-label="Active user"
      className="min-w-56"
      disabled={usersQuery.isPending || usersQuery.isError}
      value={selectedUserId ?? ""}
      onChange={(event) => setSelectedUserId(event.target.value || null)}
    >
      <option value="">
        {usersQuery.isPending
          ? "Loading users..."
          : usersQuery.isError
            ? "Users unavailable"
            : usersQuery.data && usersQuery.data.length > 0
              ? "Select active user"
              : "No users yet"}
      </option>
      {(usersQuery.data ?? []).map((user) => (
        <option key={user.id} value={user.id}>
          {user.name} ({user.email})
        </option>
      ))}
    </Select>
  );
}
