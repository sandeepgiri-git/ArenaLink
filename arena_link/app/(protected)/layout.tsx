import SessionProviderWrapper from "@/components/auth/SessionProviderWrapper";
import ProtectedLayoutClient from "@/components/layout/ProtectedLayoutClient";
import TopBar from "@/components/layout/TopBar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProviderWrapper>
      <ProtectedLayoutClient topBar={<TopBar />}>
        {children}
      </ProtectedLayoutClient>
    </SessionProviderWrapper>
  );
}
