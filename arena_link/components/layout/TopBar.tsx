import { auth, signOut } from "@/auth";
import Link from "next/link";
import Image from "next/image";
import NotificationBell from "@/components/layout/NotificationBell";

export default async function TopBar() {
  const session = await auth();

  return (
    <header className="h-16 border-b border-border bg-surface/80 backdrop-blur-xl sticky top-0 z-30 flex items-center">
      <div className="flex-1 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile Logo */}
        <Link href="/dashboard" className="lg:hidden flex items-center gap-2">
          <Image src="/arenalink_logo.svg" alt="ArenaLink Logo" width={32} height={32} className="rounded-full object-cover" />
          <span className="text-lg font-bold tracking-tight">
            Arena<span className="gradient-text">Link</span>
          </span>
        </Link>

        {/* Page title area (desktop) */}
        <div className="hidden lg:block" />

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <NotificationBell />

          {/* User dropdown */}
          <Link
            href="/profile"
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-surface-hover transition-colors"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
              {session?.user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-primary font-bold text-xs">
                  {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold leading-tight">
                {session?.user?.name || "User"}
              </p>
              <p className="text-[11px] text-muted leading-tight">
                {session?.user?.email}
              </p>
            </div>
          </Link>

          {/* Sign Out */}
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-danger hover:bg-[rgba(239,68,68,0.08)] transition-colors"
              id="signout-btn"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
