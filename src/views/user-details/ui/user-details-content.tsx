"use client";

import { useQuery } from "@tanstack/react-query";
import { DeleteUserButton, SelectUserButton, UpdateUserForm } from "@/src/features";
import { getUser, userQueryKeys } from "@/src/entities/user";
import { AppError } from "@/src/shared/lib/errors";
import { ErrorState, LoadingState } from "@/src/shared/ui";
import { UserCard } from "@/src/entities/user";

interface UserDetailsContentProps {
  userId: string;
}

export function UserDetailsContent({ userId }: UserDetailsContentProps) {
  const userQuery = useQuery({
    queryKey: userQueryKeys.detail(userId),
    queryFn: () => getUser(userId),
  });

  const errorMessage =
    userQuery.error instanceof AppError
      ? userQuery.error.message
      : "Unable to load this user right now.";

  return (
    <>
      {userQuery.isPending ? (
        <LoadingState message="Loading user details..." />
      ) : null}

      {userQuery.isError ? (
        <ErrorState
          description={errorMessage}
          title="User error"
        />
      ) : null}

      {userQuery.isSuccess ? (
        <div className="grid gap-5">
          <UserCard
            actions={
              <>
                <SelectUserButton userId={userQuery.data.id} />
                <DeleteUserButton redirectTo="/users" userId={userQuery.data.id} />
              </>
            }
            user={userQuery.data}
          />
          <UpdateUserForm user={userQuery.data} />
        </div>
      ) : null}
    </>
  );
}
