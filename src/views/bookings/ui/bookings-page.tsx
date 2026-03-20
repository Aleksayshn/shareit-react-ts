import { Suspense } from "react";
import { LinkButton, LoadingState, PageShell } from "@/src/shared/ui";
import { BookingsContent } from "./bookings-content";

type BookingViewMode = "mine" | "owner";

interface BookingsPageProps {
  mode: BookingViewMode;
}

export function BookingsPage({ mode }: BookingsPageProps) {
  const title =
    mode === "mine" ? "Borrowing" : "Lending";
  const description =
    mode === "mine"
      ? "Track the items you requested and their current status."
      : "Review and manage borrowing requests for your shared items.";

  return (
    <PageShell
      actions={
        <div className="flex flex-wrap gap-3">
          <LinkButton
            href="/bookings"
            size="sm"
            variant={mode === "mine" ? "primary" : "ghost"}
          >
            Borrowing
          </LinkButton>
          <LinkButton
            href="/bookings/owner"
            size="sm"
            variant={mode === "owner" ? "primary" : "ghost"}
          >
            Lending
          </LinkButton>
        </div>
      }
      description={description}
      eyebrow={mode === "mine" ? "Borrowing" : "Lending"}
      title={title}
    >
      <Suspense
        fallback={
          <LoadingState
            message={
              mode === "mine"
                ? "Loading your borrowing activity..."
                : "Loading lending requests..."
            }
          />
        }
      >
        <BookingsContent mode={mode} />
      </Suspense>
    </PageShell>
  );
}
