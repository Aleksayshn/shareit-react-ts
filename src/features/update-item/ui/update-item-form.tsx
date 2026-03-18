"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ItemEditorFields, itemQueryKeys, type Item } from "@/src/entities/item";
import { updateItem } from "@/src/entities/item";
import { AppError } from "@/src/shared/lib/errors";
import { Button } from "@/src/shared/ui";

interface UpdateItemFormProps {
  item: Item;
}

function createDraftFromItem(item: Item) {
  return {
    name: item.name,
    description: item.description,
    available: item.isAvailable,
  };
}

export function UpdateItemForm({ item }: UpdateItemFormProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(() => createDraftFromItem(item));
  const mutation = useMutation({
    mutationFn: () => updateItem(item.id, draft),
    onSuccess: async () => {
      setIsEditing(false);
      await queryClient.invalidateQueries({
        queryKey: itemQueryKeys.all,
      });
    },
  });

  useEffect(() => {
    setDraft(createDraftFromItem(item));
  }, [item]);

  const errorMessage =
    mutation.error instanceof AppError
      ? mutation.error.message
      : "Unable to update the item right now.";

  if (!isEditing) {
    return (
      <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
        Edit item
      </Button>
    );
  }

  return (
    <form
      className="grid min-w-80 gap-4 rounded-3xl border border-border/70 bg-surface px-4 py-4"
      onSubmit={(event) => {
        event.preventDefault();
        mutation.mutate();
      }}
    >
      <ItemEditorFields
        draft={draft}
        disabled={mutation.isPending}
        idPrefix={`update-item-${item.id}`}
        onChange={setDraft}
      />

      {mutation.isError ? (
        <p className="text-sm text-danger">{errorMessage}</p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button
          disabled={
            mutation.isPending ||
            !draft.name.trim() ||
            !draft.description.trim()
          }
          size="sm"
          type="submit"
        >
          {mutation.isPending ? "Saving..." : "Save"}
        </Button>
        <Button
          disabled={mutation.isPending}
          size="sm"
          type="button"
          variant="ghost"
          onClick={() => {
            setDraft(createDraftFromItem(item));
            setIsEditing(false);
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
