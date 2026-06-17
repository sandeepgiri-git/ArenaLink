import SessionProviderWrapper from "@/components/auth/SessionProviderWrapper";
import ProtectedLayoutClient from "@/components/layout/ProtectedLayoutClient";
import TopBar from "@/components/layout/TopBar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <SessionProviderWrapper>
      <ProtectedLayoutClient topBar={<TopBar />}>
        {children}
      </ProtectedLayoutClient>
    </SessionProviderWrapper>
  );
}
