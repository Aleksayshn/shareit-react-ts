"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createItem, emptyItemDraft, itemQueryKeys } from "@/src/entities/item";
import { AppError } from "@/src/shared/lib/errors";
import { Button, Card } from "@/src/shared/ui";
import { ItemEditorFields } from "@/src/entities/item";

interface CreateItemFormProps {
  selectedUserId: string | null;
}

export function CreateItemForm({ selectedUserId }: CreateItemFormProps) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState(emptyItemDraft);
  const mutation = useMutation({
    mutationFn: () => createItem(draft),
    onSuccess: async () => {
      setDraft(emptyItemDraft);
      await queryClient.invalidateQueries({
        queryKey: itemQueryKeys.all,
      });
    },
  });

  const isDisabled =
    !selectedUserId ||
    mutation.isPending ||
    !draft.name.trim() ||
    !draft.description.trim();

  const errorMessage =
    mutation.error instanceof AppError
      ? mutation.error.message
      : "Unable to create the item right now.";

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
          New items are created for the active sharer stored in the app.
        </p>
      </div>

      <form
        className="grid gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate();
        }}
      >
        <ItemEditorFields
          draft={draft}
          disabled={mutation.isPending || !selectedUserId}
          idPrefix="create-item"
          onChange={setDraft}
        />

        {mutation.isError ? (
          <p className="text-sm text-danger">{errorMessage}</p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <Button disabled={isDisabled} type="submit">
            {mutation.isPending ? "Creating..." : "Create item"}
          </Button>
          <Button
            disabled={mutation.isPending}
            type="button"
            variant="ghost"
            onClick={() => setDraft(emptyItemDraft)}
          >
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
}
