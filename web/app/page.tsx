"use server"

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Home() {

  const userDataBase64 = cookies().get("user_data")
  const user = userDataBase64 ? JSON.parse(atob(userDataBase64.value.slice(1, -1))) : null

  if (user) {
    redirect("/todos/" + user.username)
  }
  redirect("/sign_in")
  return null
}
