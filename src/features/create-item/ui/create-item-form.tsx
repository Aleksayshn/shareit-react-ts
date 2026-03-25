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
import { useAuth } from "@/src/shared/auth";
import { AppErrorPanel, Button, Card, Field, Input, LinkButton, Select, Textarea } from "@/src/shared/ui";

interface CreateItemFormProps {
  framed?: boolean;
}

export function CreateItemForm({ framed = true }: CreateItemFormProps) {
  const { isAuthenticated } = useAuth();
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

  const content = (
    <>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
          New listing
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-foreground">
          Add an item to share
        </h2>
        <p className="mt-2 text-sm leading-7 text-muted">
          Describe something people can borrow from you.
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
            disabled={mutation.isPending || !isAuthenticated}
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
            disabled={mutation.isPending || !isAuthenticated}
            id="create-item-description"
            placeholder="Share what it is, what condition it's in, and anything borrowers should know."
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
                disabled={mutation.isPending || !isAuthenticated}
                id="create-item-available"
                value={field.value ? "true" : "false"}
                onChange={(event) => field.onChange(event.target.value === "true")}
              >
                <option value="true">Available to borrow</option>
                <option value="false">Not available right now</option>
              </Select>
            )}
          />
        </Field>

        {mutation.isError ? (
          <AppErrorPanel
            error={mutation.error}
            fallbackMessage="We couldn't create this listing right now."
          />
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          {isAuthenticated ? (
            <Button disabled={mutation.isPending} type="submit">
              {mutation.isPending ? "Adding..." : "Add listing"}
            </Button>
          ) : (
            <LinkButton href="/login?next=/items" size="sm" variant="secondary">
              Sign in to add
            </LinkButton>
          )}
          <Button
            disabled={mutation.isPending}
            type="button"
            variant="ghost"
            onClick={() => form.reset(emptyItemDraft)}
          >
            Clear
          </Button>
        </div>
      </form>
    </>
  );

  if (!framed) {
    return content;
  }

  return <Card className="grid gap-5">{content}</Card>;
}
