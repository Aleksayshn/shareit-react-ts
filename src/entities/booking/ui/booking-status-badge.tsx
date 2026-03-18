import { cn } from "@/src/shared/lib";
import type { BookingStatus } from "../model";

const statusClasses: Record<BookingStatus, string> = {
  WAITING: "bg-[#fff1c9] text-[#8a5a00]",
  APPROVED: "bg-accent/12 text-accent",
  REJECTED: "bg-danger/12 text-danger",
  CANCELED: "bg-[#d8d2ca] text-[#5f5750]",
  UNKNOWN: "bg-[#e6e0d7] text-[#5f5750]",
};

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
        statusClasses[status],
      )}
    >
      {status}
    </span>
  );
}
