import { Suspense } from "react";
import { LinkButton, LoadingState, PageShell } from "@/src/shared/ui";
import { BookingsContent } from "./bookings-content";

type BookingViewMode = "mine" | "owner";

interface BookingsPageProps {
  mode: BookingViewMode;
}

export function BookingsPage({ mode }: BookingsPageProps) {
  const title =
    mode === "mine" ? "Track your bookings" : "Review booking requests";
  const description =
    mode === "mine"
      ? "This page shows bookings created by the active user via `GET /bookings`."
      : "This page shows booking requests for the active user's items via `GET /bookings/owner`.";

  return (
    <PageShell
      actions={
        <div className="flex flex-wrap gap-3">
          <LinkButton
            href="/bookings"
            size="sm"
            variant={mode === "mine" ? "primary" : "ghost"}
          >
            My bookings
          </LinkButton>
          <LinkButton
            href="/bookings/owner"
            size="sm"
            variant={mode === "owner" ? "primary" : "ghost"}
          >
            Owner requests
          </LinkButton>
        </div>
      }
      description={description}
      eyebrow="Bookings"
      title={title}
    >
      <Suspense fallback={<LoadingState message="Loading bookings..." />}>
        <BookingsContent mode={mode} />
      </Suspense>
    </PageShell>
  );
}
