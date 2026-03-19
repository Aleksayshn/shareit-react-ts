"use client";

import { useQuery } from "@tanstack/react-query";
import { CreateUserForm, SelectUserButton } from "@/src/features";
import { getUsers, userQueryKeys } from "@/src/entities/user";
import { AppError } from "@/src/shared/lib/errors";
import { useActiveUserStore } from "@/src/shared/model";
import {
  ErrorState,
  LoadingState,
} from "@/src/shared/ui";
import { UserList } from "@/src/widgets";

export function UsersContent() {
  const selectedUserId = useActiveUserStore((state) => state.selectedUserId);
  const usersQuery = useQuery({
    queryKey: userQueryKeys.list(),
    queryFn: getUsers,
  });

  const errorMessage =
    usersQuery.error instanceof AppError
      ? usersQuery.error.message
      : "Unable to load users right now.";

  return (
    <>
      <CreateUserForm />

      {usersQuery.isPending ? (
        <LoadingState message="Loading users..." />
      ) : null}

      {usersQuery.isError ? (
        <ErrorState
          description={errorMessage}
          title="Users error"
        />
      ) : null}

      {usersQuery.isSuccess ? (
        <UserList
          activeUserId={selectedUserId}
          emptyDescription="Create the first user in the database to activate the rest of the app."
          emptyTitle="No users yet"
          renderActions={(user) => <SelectUserButton userId={user.id} />}
          users={usersQuery.data}
        />
      ) : null}
    </>
  );
}
