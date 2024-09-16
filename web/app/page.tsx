"use server"

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Home() {

  let userDataBase64 = cookies().get("user_data")?.value

  if (userDataBase64 !== undefined){
    
    
    if (userDataBase64.startsWith('"')) userDataBase64 = userDataBase64.slice(1, -1)
      
      const user = userDataBase64 ? JSON.parse(atob(userDataBase64)) : null
      
      if (user) {
        redirect("/todos/" + user.username)
      }
    }
  redirect("/sign_in")
  return null
}
