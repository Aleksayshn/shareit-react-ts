import { redirect } from "next/navigation";
import { MyItemsPage } from "@/src/views";
import { getSessionUser } from "@/src/shared/auth/server";

export default async function ItemsPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login?next=/items");
  }

  return <MyItemsPage />;
}
