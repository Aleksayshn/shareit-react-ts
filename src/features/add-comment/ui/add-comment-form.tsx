"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment, commentFormSchema, type CommentFormValues } from "@/src/entities/comment";
import { itemQueryKeys } from "@/src/entities/item";
import { useAuth } from "@/src/shared/auth";
import { AppErrorPanel, Button, Card, Field, LinkButton, Textarea } from "@/src/shared/ui";

interface AddCommentFormProps {
  itemId: string;
}

export function AddCommentForm({ itemId }: AddCommentFormProps) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const form = useForm<CommentFormValues>({
    defaultValues: {
      text: "",
    },
    resolver: zodResolver(commentFormSchema),
  });

  const mutation = useMutation({
    mutationFn: (values: CommentFormValues) => addComment(itemId, values),
    onSuccess: async () => {
      form.reset();
      await queryClient.invalidateQueries({
        queryKey: itemQueryKeys.detail(itemId),
      });
    },
  });

  return (
    <Card className="grid gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
          Leave a note
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-foreground">
          Share how it went
        </h3>
        <p className="mt-2 text-sm leading-7 text-muted">
          If you&apos;ve borrowed this item before, you can leave a note for future borrowers.
        </p>
      </div>

      <form
        className="grid gap-4"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        <Field
          description="Notes are available after an eligible completed request."
          error={form.formState.errors.text?.message}
          htmlFor={`comment-${itemId}`}
          label="Your note"
        >
          <Textarea
            disabled={mutation.isPending || !isAuthenticated}
            id={`comment-${itemId}`}
            placeholder={
              isAuthenticated
                ? "What should the next borrower know?"
                : "Sign in to leave a note."
            }
            rows={4}
            {...form.register("text")}
          />
        </Field>

        {mutation.isError ? (
          <AppErrorPanel
            error={mutation.error}
            fallbackMessage="We couldn't add your note right now."
          />
        ) : null}

        <div className="flex flex-wrap gap-3">
          {isAuthenticated ? (
            <Button disabled={mutation.isPending} type="submit">
              {mutation.isPending ? "Posting..." : "Post note"}
            </Button>
          ) : (
            <LinkButton
              href={`/login?next=${encodeURIComponent(`/items/${itemId}`)}`}
              size="sm"
              variant="secondary"
            >
              Sign in to post
            </LinkButton>
          )}
          <Button
            disabled={mutation.isPending}
            type="button"
            variant="ghost"
            onClick={() => form.reset()}
          >
            Clear
          </Button>
        </div>
      </form>
    </Card>
  );
}
