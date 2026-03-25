import { redirect } from "next/navigation";
import { getSessionUser } from "@/src/shared/auth/server";

export default async function UsersRoute() {
  const user = await getSessionUser();

  redirect(user ? "/items" : "/register");
}
