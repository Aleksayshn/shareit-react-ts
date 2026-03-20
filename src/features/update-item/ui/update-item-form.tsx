"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  itemFormSchema,
  itemQueryKeys,
  updateItem,
  type Item,
  type ItemFormValues,
} from "@/src/entities/item";
import { AppErrorPanel, Button, Field, Input, Select, Textarea } from "@/src/shared/ui";

interface UpdateItemFormProps {
  item: Item;
}

function createFormValues(item: Item): ItemFormValues {
  return {
    name: item.name,
    description: item.description,
    available: item.isAvailable,
  };
}

export function UpdateItemForm({ item }: UpdateItemFormProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm<ItemFormValues>({
    defaultValues: createFormValues(item),
    resolver: zodResolver(itemFormSchema),
  });

  useEffect(() => {
    form.reset(createFormValues(item));
  }, [form, item]);

  const mutation = useMutation({
    mutationFn: (values: ItemFormValues) => updateItem(item.id, values),
    onSuccess: async () => {
      setIsEditing(false);
      await queryClient.invalidateQueries({
        queryKey: itemQueryKeys.all,
      });
    },
  });

  if (!isEditing) {
    return (
      <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
        Edit listing
      </Button>
    );
  }

  return (
    <form
      className="grid min-w-80 gap-4 rounded-3xl border border-border/70 bg-surface px-4 py-4"
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
    >
      <Field
        error={form.formState.errors.name?.message}
        htmlFor={`update-item-name-${item.id}`}
        label="Name"
      >
        <Input
          disabled={mutation.isPending}
          id={`update-item-name-${item.id}`}
          {...form.register("name")}
        />
      </Field>

      <Field
        error={form.formState.errors.description?.message}
        htmlFor={`update-item-description-${item.id}`}
        label="Description"
      >
        <Textarea
          disabled={mutation.isPending}
          id={`update-item-description-${item.id}`}
          rows={4}
          {...form.register("description")}
        />
      </Field>

      <Field htmlFor={`update-item-available-${item.id}`} label="Availability">
        <Controller
          control={form.control}
          name="available"
          render={({ field }) => (
            <Select
              disabled={mutation.isPending}
              id={`update-item-available-${item.id}`}
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
          fallbackMessage="We couldn't save this listing right now."
        />
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button disabled={mutation.isPending} size="sm" type="submit">
          {mutation.isPending ? "Saving..." : "Save changes"}
        </Button>
        <Button
          disabled={mutation.isPending}
          size="sm"
          type="button"
          variant="ghost"
          onClick={() => {
            form.reset(createFormValues(item));
            setIsEditing(false);
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
