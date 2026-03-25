import { redirect } from "next/navigation";
import { BookingsPage } from "@/src/views";
import { getSessionUser } from "@/src/shared/auth/server";

export default async function MyBookingsRoute() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login?next=/bookings");
  }

  return <BookingsPage mode="mine" />;
}
