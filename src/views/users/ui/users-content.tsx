"use client";

import { useQuery } from "@tanstack/react-query";
import { CreateUserForm, SelectUserButton } from "@/src/features";
import { getUsers, userQueryKeys } from "@/src/entities/user";
import { AppError } from "@/src/shared/lib/errors";
import { useActiveUserStore } from "@/src/shared/model";
import {
  Card,
  ExpandableCard,
  ErrorState,
  LoadingState,
  SectionHeader,
  StatCard,
} from "@/src/shared/ui";
import { UserList } from "@/src/widgets";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function UsersContent() {
  const selectedUserId = useActiveUserStore((state) => state.selectedUserId);
  const usersQuery = useQuery({
    queryKey: userQueryKeys.list(),
    queryFn: getUsers,
  });

  const errorMessage =
    usersQuery.error instanceof AppError
      ? usersQuery.error.message
      : "We couldn't load profiles right now.";
  const profiles = usersQuery.data ?? [];
  const currentProfile =
    profiles.find((profile) => profile.id === selectedUserId) ?? null;

  return (
    <>
      {usersQuery.isPending ? (
        <LoadingState message="Loading profiles..." />
      ) : null}

      {usersQuery.isError ? (
        <ErrorState
          description={errorMessage}
          title="Profiles unavailable"
        />
      ) : null}

      {usersQuery.isSuccess ? (
        <div className="grid gap-6">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="grid gap-5" tone={currentProfile ? "accent" : "default"}>
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-accent/12 text-lg font-semibold uppercase tracking-[0.16em] text-accent">
                  {currentProfile ? getInitials(currentProfile.name) : "?"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                    Current profile
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                    {currentProfile ? currentProfile.name : "No profile selected"}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    {currentProfile
                      ? currentProfile.email
                      : "Pick a profile to explore listings, send requests, and manage shared items."}
                  </p>
                </div>
              </div>
              <p className="text-sm leading-7 text-muted">
                {currentProfile
                  ? "This is the identity currently used across borrowing, lending, and listing management."
                  : "You can switch profiles any time to manage a different person's activity."}
              </p>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <StatCard
                description="Every profile can share items, request to borrow, and manage activity."
                label="Profiles available"
                value={profiles.length}
              />
              <StatCard
                description={
                  currentProfile
                    ? `You are currently using ${currentProfile.name}.`
                    : "Pick one of the profiles below to get started."
                }
                label="Ready to use"
                tone={currentProfile ? "accent" : "default"}
                value={currentProfile ? "Yes" : "Choose one"}
              />
            </div>
          </div>

          <ExpandableCard
            closeLabel="Hide form"
            defaultOpen={profiles.length === 0}
            description="Add another person who can share items and request to borrow them."
            eyebrow="Create"
            openLabel="Add profile"
            title="Create a new profile"
          >
            <CreateUserForm framed={false} />
          </ExpandableCard>

          <div className="grid gap-4">
            <SectionHeader
              description="Choose the profile you want to act as, or open one to update its details."
              eyebrow="People"
              title="Available profiles"
            />

            <UserList
              activeUserId={selectedUserId}
              emptyDescription="Create your first profile to start sharing items and requesting to borrow them."
              emptyTitle="No profiles yet"
              renderActions={(user) => <SelectUserButton userId={user.id} />}
              users={profiles}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
