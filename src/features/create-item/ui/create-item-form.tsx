"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createItem,
  emptyItemDraft,
  itemFormSchema,
  itemQueryKeys,
  type ItemFormValues,
} from "@/src/entities/item";
import { AppErrorPanel, Button, Card, Field, Input, Select, Textarea } from "@/src/shared/ui";

interface CreateItemFormProps {
  selectedUserId: string | null;
}

export function CreateItemForm({ selectedUserId }: CreateItemFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<ItemFormValues>({
    defaultValues: emptyItemDraft,
    resolver: zodResolver(itemFormSchema),
  });

  const mutation = useMutation({
    mutationFn: (values: ItemFormValues) => createItem(values),
    onSuccess: async () => {
      form.reset(emptyItemDraft);
      await queryClient.invalidateQueries({
        queryKey: itemQueryKeys.all,
      });
    },
  });

  return (
    <Card className="grid gap-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
          Create item
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-foreground">
          Add something new to share
        </h2>
        <p className="mt-2 text-sm leading-7 text-muted">
          New items are created for the selected backend user.
        </p>
      </div>

      <form
        className="grid gap-5"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        <Field
          error={form.formState.errors.name?.message}
          htmlFor="create-item-name"
          label="Name"
          required
        >
          <Input
            disabled={mutation.isPending || !selectedUserId}
            id="create-item-name"
            maxLength={120}
            placeholder="Mountain bike"
            {...form.register("name")}
          />
        </Field>

        <Field
          error={form.formState.errors.description?.message}
          htmlFor="create-item-description"
          label="Description"
          required
        >
          <Textarea
            disabled={mutation.isPending || !selectedUserId}
            id="create-item-description"
            placeholder="Describe what makes this item useful to other sharers."
            rows={4}
            {...form.register("description")}
          />
        </Field>

        <Field htmlFor="create-item-available" label="Availability" required>
          <Controller
            control={form.control}
            name="available"
            render={({ field }) => (
              <Select
                disabled={mutation.isPending || !selectedUserId}
                id="create-item-available"
                value={field.value ? "true" : "false"}
                onChange={(event) => field.onChange(event.target.value === "true")}
              >
                <option value="true">Available for booking</option>
                <option value="false">Unavailable</option>
              </Select>
            )}
          />
        </Field>

        {mutation.isError ? (
          <AppErrorPanel
            error={mutation.error}
            fallbackMessage="Unable to create the item right now."
          />
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <Button disabled={mutation.isPending || !selectedUserId} type="submit">
            {mutation.isPending ? "Creating..." : "Create item"}
          </Button>
          <Button
            disabled={mutation.isPending}
            type="button"
            variant="ghost"
            onClick={() => form.reset(emptyItemDraft)}
          >
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
}
