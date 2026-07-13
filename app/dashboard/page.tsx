import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardLayout from "@/component/dashboard/DashboardLayout";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const authToken =cookieStore.get("auth_token")?.value;

    console.log(authToken,'authToken')
  if (!authToken) {
    redirect("/");
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50">
      <DashboardLayout />
    </main>
  );
}