
import LoginPage from "@/component/auth/login";
import { cookies } from "next/headers";
import {redirect} from "next/navigation";

export default async function Page() {

  const token = (await cookies()).get("auth_token");
  console.log(token, "token");

  if (token) {
    redirect("/dashboard");
  }

  return <LoginPage />;
}
