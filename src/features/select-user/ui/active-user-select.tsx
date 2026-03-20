"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsers, userQueryKeys } from "@/src/entities/user";
import { useActiveUserStore } from "@/src/shared/model";
import { Select } from "@/src/shared/ui";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function ActiveUserSelect() {
  const selectedUserId = useActiveUserStore((state) => state.selectedUserId);
  const setSelectedUserId = useActiveUserStore((state) => state.setSelectedUserId);
  const usersQuery = useQuery({
    queryKey: userQueryKeys.list(),
    queryFn: getUsers,
  });
  const currentProfile =
    usersQuery.data?.find((user) => user.id === selectedUserId) ?? null;

  return (
    <div className="grid gap-3 lg:min-w-80">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/12 text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          {currentProfile ? getInitials(currentProfile.name) : "?"}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Current profile
          </p>
          <p className="truncate text-base font-semibold text-foreground">
            {currentProfile ? currentProfile.name : "Choose a profile"}
          </p>
          <p className="truncate text-sm text-muted">
            {currentProfile
              ? currentProfile.email
              : "Switch between people who share and borrow."}
          </p>
        </div>
      </div>

      <Select
        aria-label="Current profile"
        className="min-w-56 bg-white/75"
        disabled={usersQuery.isPending || usersQuery.isError}
        value={selectedUserId ?? ""}
        onChange={(event) => setSelectedUserId(event.target.value || null)}
      >
        <option value="">
          {usersQuery.isPending
            ? "Loading profiles..."
            : usersQuery.isError
              ? "Profiles unavailable"
              : usersQuery.data && usersQuery.data.length > 0
                ? "Switch profile"
                : "No profiles yet"}
        </option>
        {(usersQuery.data ?? []).map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} ({user.email})
          </option>
        ))}
      </Select>
      <p className="text-xs text-muted">
        {currentProfile
          ? `${currentProfile.name} is your current profile.`
          : usersQuery.data && usersQuery.data.length > 0
            ? "Pick the identity you want to use across the app right now."
            : "Create a profile to start sharing and borrowing."}
      </p>
    </div>
  );
}
