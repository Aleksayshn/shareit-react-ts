import type { ReactNode } from "react";
import { Card, LinkButton } from "@/src/shared/ui";
import type { User } from "../model";

interface UserCardProps {
  user: User;
  isActive?: boolean;
  actions?: ReactNode;
}

export function UserCard({
  user,
  isActive = false,
  actions,
}: UserCardProps) {
  return (
    <Card className="grid gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-semibold text-foreground">{user.name}</h2>
            {isActive ? (
              <span className="rounded-full bg-accent/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Active
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-sm leading-7 text-muted">{user.email}</p>
        </div>
        <LinkButton href={`/users/${user.id}`} size="sm" variant="secondary">
          Open details
        </LinkButton>
      </div>

      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </Card>
  );
}
