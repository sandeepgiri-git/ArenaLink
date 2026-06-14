import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar (renders its own desktop/mobile versions) */}
      <Sidebar />

      {/* Main area — offset by sidebar width on desktop */}
      <div className="lg:pl-[260px] transition-all duration-300">
        {/* Top Bar */}
        <TopBar />

        {/* Page Content */}
        <main className="px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-6">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
