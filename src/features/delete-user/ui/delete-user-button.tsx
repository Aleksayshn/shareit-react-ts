"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { deleteUser, userQueryKeys } from "@/src/entities/user";
import { AppError } from "@/src/shared/lib/errors";
import { useActiveUserStore } from "@/src/shared/model";
import { Button } from "@/src/shared/ui";

interface DeleteUserButtonProps {
  userId: string;
  redirectTo?: string;
}

export function DeleteUserButton({
  userId,
  redirectTo,
}: DeleteUserButtonProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const selectedUserId = useActiveUserStore((state) => state.selectedUserId);
  const clearSelectedUserId = useActiveUserStore((state) => state.clearSelectedUserId);
  const mutation = useMutation({
    mutationFn: () => deleteUser(userId),
    onSuccess: async () => {
      if (selectedUserId === userId) {
        clearSelectedUserId();
      }

      await queryClient.invalidateQueries({
        queryKey: userQueryKeys.all,
      });

      if (redirectTo) {
        router.push(redirectTo);
      }
    },
  });

  const errorMessage =
    mutation.error instanceof AppError
      ? mutation.error.message
      : "We couldn't delete this profile right now.";

  return (
    <div className="grid gap-2">
      <Button
        disabled={mutation.isPending}
        size="sm"
        type="button"
        variant="danger"
        onClick={() => {
          if (window.confirm("Delete this profile?")) {
            mutation.mutate();
          }
        }}
      >
        {mutation.isPending ? "Deleting..." : "Delete profile"}
      </Button>
      {mutation.isError ? (
        <p className="text-sm text-danger">{errorMessage}</p>
      ) : null}
    </div>
  );
}
