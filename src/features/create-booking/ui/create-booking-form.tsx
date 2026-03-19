"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  bookingFormSchema,
  createBooking,
  type BookingFormValues,
} from "@/src/entities/booking";
import { itemQueryKeys, type Item } from "@/src/entities/item";
import { AppErrorPanel, Button, Card, Field, Input } from "@/src/shared/ui";

interface CreateBookingFormProps {
  item: Item;
  selectedUserId: string | null;
}

export function CreateBookingForm({
  item,
  selectedUserId,
}: CreateBookingFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<BookingFormValues>({
    defaultValues: {
      startAt: "",
      endAt: "",
    },
    resolver: zodResolver(bookingFormSchema),
  });

  const mutation = useMutation({
    mutationFn: (values: BookingFormValues) =>
      createBooking({
        itemId: item.id,
        startAt: values.startAt,
        endAt: values.endAt,
      }),
    onSuccess: async () => {
      form.reset();
      await queryClient.invalidateQueries({
        queryKey: itemQueryKeys.detail(item.id),
      });
    },
  });

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
          This call uses the selected backend user as the requester.
        </p>
      </div>

      <form
        className="grid gap-4"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        <Field
          error={form.formState.errors.startAt?.message}
          htmlFor={`booking-start-${item.id}`}
          label="Start"
        >
          <Input
            disabled={mutation.isPending || !selectedUserId}
            id={`booking-start-${item.id}`}
            type="datetime-local"
            {...form.register("startAt")}
          />
        </Field>

        <Field
          error={form.formState.errors.endAt?.message}
          htmlFor={`booking-end-${item.id}`}
          label="End"
        >
          <Input
            disabled={mutation.isPending || !selectedUserId}
            id={`booking-end-${item.id}`}
            type="datetime-local"
            {...form.register("endAt")}
          />
        </Field>

        {mutation.isError ? (
          <AppErrorPanel
            error={mutation.error}
            fallbackMessage="Unable to create the booking right now."
          />
        ) : null}

        <Button disabled={!selectedUserId || mutation.isPending} type="submit">
          {mutation.isPending ? "Requesting..." : "Create booking"}
        </Button>
      </form>
    </Card>
  );
}
