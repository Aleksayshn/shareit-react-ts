"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { createBooking } from "@/src/entities/booking";
import { itemQueryKeys, type Item } from "@/src/entities/item";
import { AppError } from "@/src/shared/lib/errors";
import { Button, Card, Field, Input } from "@/src/shared/ui";

interface CreateBookingFormProps {
  item: Item;
  selectedUserId: string | null;
}

function renderErrorDetails(error: AppError) {
  if (error.fieldErrors.length === 0) {
    return null;
  }

  return (
    <ul className="grid gap-1 text-sm text-danger">
      {error.fieldErrors.map((fieldError) => (
        <li key={`${fieldError.field}-${fieldError.message}`}>
          {fieldError.field}: {fieldError.message}
        </li>
      ))}
    </ul>
  );
}

export function CreateBookingForm({
  item,
  selectedUserId,
}: CreateBookingFormProps) {
  const queryClient = useQueryClient();
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const mutation = useMutation({
    mutationFn: () =>
      createBooking({
        itemId: item.id,
        startAt,
        endAt,
      }),
    onSuccess: async () => {
      setStartAt("");
      setEndAt("");
      await queryClient.invalidateQueries({
        queryKey: itemQueryKeys.detail(item.id),
      });
    },
  });

  const appError =
    mutation.error instanceof AppError ? mutation.error : null;

  const validationMessage = useMemo(() => {
    if (!startAt || !endAt) {
      return "Choose both a start and end time.";
    }

    if (new Date(startAt).getTime() >= new Date(endAt).getTime()) {
      return "The end time must be after the start time.";
    }

    return null;
  }, [endAt, startAt]);

  return (
    <Card className="grid gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
          Booking
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-foreground">
          Request this item
        </h3>
        <p className="mt-2 text-sm leading-7 text-muted">
          This call uses the selected user as the requester. Backend business
          errors like duplicate or invalid booking windows are shown clearly.
        </p>
      </div>

      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();

          if (validationMessage) {
            return;
          }

          mutation.mutate();
        }}
      >
        <Field htmlFor={`booking-start-${item.id}`} label="Start">
          <Input
            disabled={mutation.isPending || !selectedUserId}
            id={`booking-start-${item.id}`}
            type="datetime-local"
            value={startAt}
            onChange={(event) => setStartAt(event.target.value)}
          />
        </Field>

        <Field htmlFor={`booking-end-${item.id}`} label="End">
          <Input
            disabled={mutation.isPending || !selectedUserId}
            id={`booking-end-${item.id}`}
            type="datetime-local"
            value={endAt}
            onChange={(event) => setEndAt(event.target.value)}
          />
        </Field>

        {validationMessage ? (
          <p className="text-sm text-danger">{validationMessage}</p>
        ) : null}

        {appError ? (
          <div className="grid gap-2">
            <p className="text-sm font-medium text-danger">{appError.message}</p>
            {renderErrorDetails(appError)}
          </div>
        ) : null}

        <Button
          disabled={!selectedUserId || mutation.isPending || Boolean(validationMessage)}
          type="submit"
        >
          {mutation.isPending ? "Requesting..." : "Create booking"}
        </Button>
      </form>
    </Card>
  );
}
