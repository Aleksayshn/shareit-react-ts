"use client";

import { useQuery } from "@tanstack/react-query";
import { getItemDetails, itemQueryKeys } from "@/src/entities/item";
import { AppError } from "@/src/shared/lib/errors";
import { Card, LinkButton, PageShell, Spinner } from "@/src/shared/ui";

interface ItemDetailsPageProps {
  itemId: string;
}

export function ItemDetailsPage({ itemId }: ItemDetailsPageProps) {
  const itemQuery = useQuery({
    queryKey: itemQueryKeys.detail(itemId),
    queryFn: () => getItemDetails(itemId),
  });

  const errorMessage =
    itemQuery.error instanceof AppError
      ? itemQuery.error.message
      : "Unable to load this item right now.";

  return (
    <PageShell
      actions={
        <div className="flex flex-wrap gap-3">
          <LinkButton href="/" size="sm" variant="ghost">
            Discovery
          </LinkButton>
          <LinkButton href="/items" size="sm" variant="secondary">
            My items
          </LinkButton>
        </div>
      }
      description="This route keeps item-card navigation real and gives the upcoming booking flow a place to grow."
      eyebrow="Item details"
      title="Inspect an item before you request it"
    >
      {itemQuery.isPending ? (
        <Card className="flex items-center gap-3">
          <Spinner />
          <p className="text-sm text-muted">Loading item details...</p>
        </Card>
      ) : null}

      {itemQuery.isError ? (
        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-danger">
            Item error
          </p>
          <p className="mt-3 text-sm leading-7 text-muted">{errorMessage}</p>
        </Card>
      ) : null}

      {itemQuery.isSuccess ? (
        <div className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
          <Card className="grid gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-3xl font-semibold text-foreground">
                {itemQuery.data.name}
              </h2>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                  itemQuery.data.isAvailable
                    ? "bg-accent/12 text-accent"
                    : "bg-danger/12 text-danger"
                }`}
              >
                {itemQuery.data.isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>
            <p className="text-base leading-8 text-muted">
              {itemQuery.data.description}
            </p>
          </Card>

          <Card className="grid gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
                Comments
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-foreground">
                Owner feedback history
              </h3>
            </div>

            {itemQuery.data.comments.length === 0 ? (
              <p className="text-sm leading-7 text-muted">
                No comments yet. This route is ready for comment rendering once
                the booking flow unlocks comments.
              </p>
            ) : (
              <div className="grid gap-3">
                {itemQuery.data.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-3xl border border-border/70 bg-surface px-4 py-4"
                  >
                    <p className="text-sm leading-7 text-foreground">
                      {comment.text}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted">
                      {comment.authorName} - {comment.createdAt}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      ) : null}
    </PageShell>
  );
}
