import { redirect } from "next/navigation";
import { getAuthToken } from "@/lib/auth-cookies";
import { getCurrentUser } from "@/lib/api";
import ProfileForm from "./profile-form";

export default async function PerfilPage() {
  const token = await getAuthToken();
  if (!token) redirect("/login");
  const me = await getCurrentUser(token);
  return <ProfileForm me={me} />;
}
