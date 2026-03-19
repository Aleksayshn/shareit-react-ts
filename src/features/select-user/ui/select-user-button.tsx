"use client";

import { useActiveUserStore } from "@/src/shared/model";
import { Button } from "@/src/shared/ui";

interface SelectUserButtonProps {
  userId: string;
}

export function SelectUserButton({ userId }: SelectUserButtonProps) {
  const selectedUserId = useActiveUserStore((state) => state.selectedUserId);
  const setSelectedUserId = useActiveUserStore((state) => state.setSelectedUserId);
  const isActive = selectedUserId === userId;

  return (
    <Button
      size="sm"
      type="button"
      variant={isActive ? "secondary" : "primary"}
      onClick={() => setSelectedUserId(userId)}
    >
      {isActive ? "Active user" : "Make active"}
    </Button>
  );
}
