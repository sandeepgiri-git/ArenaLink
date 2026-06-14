import { getUserProfile } from "@/lib/actions/user";
import { redirect } from "next/navigation";
import ProfileEditForm from "@/components/profile/ProfileEditForm";

export default async function ProfileEditPage() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect("/login");
  }

  return <ProfileEditForm profile={profile} />;
}
