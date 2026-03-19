import type { ReactNode } from "react";
import { UserCard, type User } from "@/src/entities/user";
import { EmptyState } from "@/src/shared/ui";

interface UserListProps {
  users: User[];
  activeUserId: string | null;
  emptyTitle: string;
  emptyDescription: string;
  renderActions?: (user: User) => ReactNode;
}

export function UserList({
  users,
  activeUserId,
  emptyTitle,
  emptyDescription,
  renderActions,
}: UserListProps) {
  if (users.length === 0) {
    return (
      <EmptyState
        description={emptyDescription}
        title={emptyTitle}
      />
    );
  }

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      {users.map((user) => (
        <UserCard
          key={user.id}
          actions={renderActions?.(user)}
          isActive={activeUserId === user.id}
          user={user}
        />
      ))}
    </section>
  );
}
