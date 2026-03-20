import type { ReactNode } from "react";
import { Card, LinkButton } from "@/src/shared/ui";
import type { Item } from "../model";

interface ItemCardProps {
  item: Item;
  actions?: ReactNode;
  href?: string;
}

export function ItemCard({ item, actions, href = `/items/${item.id}` }: ItemCardProps) {
  return (
    <Card className="flex h-full flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                item.isAvailable
                  ? "bg-accent/12 text-accent"
                  : "bg-danger/12 text-danger"
              }`}
            >
              {item.isAvailable ? "Available now" : "Not available"}
            </span>
            <span className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted ring-1 ring-border/70">
              {item.comments.length > 0
                ? `${item.comments.length} note${item.comments.length > 1 ? "s" : ""}`
                : "No notes yet"}
            </span>
          </div>
          <h3 className="mt-4 text-xl font-semibold text-foreground">{item.name}</h3>
          <p className="mt-3 text-sm leading-7 text-muted">{item.description}</p>
        </div>
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-4">
        <p className="max-w-xs text-sm leading-6 text-muted">
          {item.isAvailable
            ? "Open for new borrow requests."
            : "This listing is temporarily unavailable."}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {actions}
          <LinkButton href={href} size="sm" variant="secondary">
            See details
          </LinkButton>
        </div>
      </div>
    </Card>
  );
}
