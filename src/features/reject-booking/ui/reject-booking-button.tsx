"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingQueryKeys, rejectBooking } from "@/src/entities/booking";
import { itemQueryKeys } from "@/src/entities/item";
import { AppError } from "@/src/shared/lib/errors";
import { Button } from "@/src/shared/ui";

interface RejectBookingButtonProps {
  bookingId: string;
  disabled?: boolean;
  onPendingChange?: (isPending: boolean) => void;
}

export function RejectBookingButton({
  bookingId,
  disabled = false,
  onPendingChange,
}: RejectBookingButtonProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => rejectBooking(bookingId),
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
        variant="danger"
        onClick={() => mutation.mutate()}
      >
        {mutation.isPending ? "Declining..." : "Decline request"}
      </Button>
      {errorMessage ? <p className="text-sm text-danger">{errorMessage}</p> : null}
    </div>
  );
}
