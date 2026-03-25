import { redirect } from "next/navigation";
import { BookingsPage } from "@/src/views";
import { getSessionUser } from "@/src/shared/auth/server";

export default async function OwnerBookingsRoute() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login?next=/bookings/owner");
  }

  return <BookingsPage mode="owner" />;
}
