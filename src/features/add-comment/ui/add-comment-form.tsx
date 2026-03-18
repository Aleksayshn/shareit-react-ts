"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { addComment } from "@/src/entities/comment";
import { itemQueryKeys } from "@/src/entities/item";
import { AppError } from "@/src/shared/lib/errors";
import { Button, Card, Field, Textarea } from "@/src/shared/ui";

interface AddCommentFormProps {
  itemId: string;
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

export function AddCommentForm({
  itemId,
  selectedUserId,
}: AddCommentFormProps) {
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const mutation = useMutation({
    mutationFn: () => addComment(itemId, { text }),
    onSuccess: async () => {
      setText("");
      await queryClient.invalidateQueries({
        queryKey: itemQueryKeys.detail(itemId),
      });
    },
  });

  const appError =
    mutation.error instanceof AppError ? mutation.error : null;

  return (
    <Card className="grid gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
          Add comment
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-foreground">
          Share your experience
        </h3>
        <p className="mt-2 text-sm leading-7 text-muted">
          The backend decides whether the selected user is allowed to comment.
          If the business rule fails, the API message is shown directly.
        </p>
      </div>

      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate();
        }}
      >
        <Field
          description="Comments usually become valid after a completed booking."
          htmlFor={`comment-${itemId}`}
          label="Comment"
        >
          <Textarea
            disabled={mutation.isPending || !selectedUserId}
            id={`comment-${itemId}`}
            placeholder={
              selectedUserId
                ? "What was it like to use this item?"
                : "Select a user to leave a comment."
            }
            rows={4}
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
        </Field>

        {appError ? (
          <div className="grid gap-2">
            <p className="text-sm font-medium text-danger">{appError.message}</p>
            {renderErrorDetails(appError)}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button
            disabled={!selectedUserId || mutation.isPending || !text.trim()}
            type="submit"
          >
            {mutation.isPending ? "Sending..." : "Add comment"}
          </Button>
          <Button
            disabled={mutation.isPending || !text}
            type="button"
            variant="ghost"
            onClick={() => setText("")}
          >
            Clear
          </Button>
        </div>
      </form>
    </Card>
  );
}
