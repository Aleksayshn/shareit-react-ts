"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveBooking, bookingQueryKeys } from "@/src/entities/booking";
import { itemQueryKeys } from "@/src/entities/item";
import { AppError } from "@/src/shared/lib/errors";
import { Button } from "@/src/shared/ui";

interface ApproveBookingButtonProps {
  bookingId: string;
  disabled?: boolean;
  onPendingChange?: (isPending: boolean) => void;
}

export function ApproveBookingButton({
  bookingId,
  disabled = false,
  onPendingChange,
}: ApproveBookingButtonProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => approveBooking(bookingId),
    onMutate: () => {
      onPendingChange?.(true);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: bookingQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: itemQueryKeys.all }),
      ]);
    },
    onSettled: () => {
      onPendingChange?.(false);
    },
  });

  const errorMessage =
    mutation.error instanceof AppError ? mutation.error.message : null;

  return (
    <div className="grid gap-2">
      <Button
        disabled={disabled || mutation.isPending}
        size="sm"
        title={errorMessage ?? undefined}
        onClick={() => mutation.mutate()}
      >
        {mutation.isPending ? "Approving..." : "Approve request"}
      </Button>
      {errorMessage ? <p className="text-sm text-danger">{errorMessage}</p> : null}
    </div>
  );
}
