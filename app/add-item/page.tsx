import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import AddItemClient from "./AddItemClient";

export default async function AddItemPage() {
  const cookieStore = await cookies();
  const authed = cookieStore.get(AUTH_COOKIE_NAME)?.value === "1";

  if (!authed) {
    redirect("/login?next=/add-item");
  }

  return <AddItemClient />;
}
