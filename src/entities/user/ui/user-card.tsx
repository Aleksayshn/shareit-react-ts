import { cn } from "@/src/shared/lib";
import type { ReactNode } from "react";
import { Card, LinkButton } from "@/src/shared/ui";
import type { User } from "../model";

interface UserCardProps {
  user: User;
  isActive?: boolean;
  actions?: ReactNode;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function UserCard({
  user,
  isActive = false,
  actions,
}: UserCardProps) {
  return (
    <Card
      className={cn(
        "grid gap-5",
        isActive ? "border-accent/35 shadow-[0_20px_48px_-34px_rgba(15,118,110,0.55)]" : undefined,
      )}
      tone={isActive ? "accent" : "default"}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent/12 text-sm font-semibold uppercase tracking-[0.16em] text-accent">
            {getInitials(user.name)}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-semibold text-foreground">{user.name}</h2>
              {isActive ? (
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent-foreground">
                  Current profile
                </span>
              ) : null}
            </div>
            <p className="mt-2 truncate text-sm leading-7 text-muted">{user.email}</p>
            <p className="mt-1 text-sm leading-6 text-muted">
              Use this profile to share listings, send requests, and manage activity.
            </p>
          </div>
        </div>
        <LinkButton href={`/users/${user.id}`} size="sm" variant="secondary">
          View profile
        </LinkButton>
      </div>

      {actions ? (
        <div className="flex flex-wrap gap-3 border-t border-border/70 pt-4">
          {actions}
        </div>
      ) : null}
    </Card>
  );
}
