import { redirect } from "next/navigation";
import { getAuthToken } from "@/lib/auth-cookies";
import { ApiError, getCurrentUser, isAdmin } from "@/lib/api";
import Sidebar from "./_components/sidebar";
import Header from "./_components/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getAuthToken();
  if (!token) {
    redirect("/login");
  }

  let me;
  try {
    me = await getCurrentUser(token);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect("/login");
    }
    throw error;
  }
  const admin = isAdmin(me);

  return (
    <div className="flex min-h-full flex-1 bg-background">
      <Sidebar isAdmin={admin} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header me={me} />
        <main className="flex-1 overflow-y-auto px-6 py-6">{children}</main>
      </div>
    </div>
  );
}