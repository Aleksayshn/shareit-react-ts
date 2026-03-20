"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  bookingFormSchema,
  bookingQueryKeys,
  createBooking,
  type BookingFormValues,
} from "@/src/entities/booking";
import { itemQueryKeys, type Item } from "@/src/entities/item";
import {
  AppErrorPanel,
  Button,
  Card,
  Field,
  Input,
  LinkButton,
} from "@/src/shared/ui";

interface CreateBookingFormProps {
  item: Item;
  selectedUserId: string | null;
  id?: string;
  tone?: "default" | "accent";
}

export function CreateBookingForm({
  item,
  selectedUserId,
  id,
  tone = "default",
}: CreateBookingFormProps) {
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const form = useForm<BookingFormValues>({
    defaultValues: {
      startAt: "",
      endAt: "",
    },
    resolver: zodResolver(bookingFormSchema),
  });

  const mutation = useMutation({
    onMutate: () => {
      setSuccessMessage(null);
    },
    mutationFn: (values: BookingFormValues) =>
      createBooking({
        itemId: item.id,
        startAt: values.startAt,
        endAt: values.endAt,
      }),
    onSuccess: async () => {
      form.reset();
      setSuccessMessage(
        "Your request has been sent. You can follow updates in Borrowing.",
      );
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: itemQueryKeys.detail(item.id),
        }),
        queryClient.invalidateQueries({
          queryKey: bookingQueryKeys.all,
        }),
      ]);
    },
  });

  return (
    <Card className="grid gap-4" id={id} tone={tone}>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
          Borrow this item
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-foreground">
          Send a borrow request
        </h3>
        <p className="mt-2 text-sm leading-7 text-muted">
          {selectedUserId
            ? "Choose the dates you'd like to borrow it."
            : "Choose a profile first to send a request."}
        </p>
      </div>

      {successMessage ? (
        <div className="grid gap-3 rounded-3xl border border-accent/20 bg-accent/8 px-4 py-4">
          <p className="text-sm font-semibold text-foreground">Request sent</p>
          <p className="text-sm leading-7 text-muted">{successMessage}</p>
          <div>
            <LinkButton href="/bookings" size="sm">
              Open Borrowing
            </LinkButton>
          </div>
        </div>
      ) : null}

      <form
        className="grid gap-4"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        <Field
          error={form.formState.errors.startAt?.message}
          htmlFor={`booking-start-${item.id}`}
          label="From"
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
          label="Until"
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
            fallbackMessage="We couldn't send your request right now."
          />
        ) : null}

        <Button disabled={!selectedUserId || mutation.isPending} type="submit">
          {mutation.isPending ? "Sending..." : "Send request"}
        </Button>
      </form>
    </Card>
  );
}
