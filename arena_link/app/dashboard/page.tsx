import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <header className="border-b border-border bg-surface/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  A
                </span>
              </div>
              <span className="text-xl font-bold tracking-tight">
                Arena
                <span className="gradient-text">Link</span>
              </span>
            </Link>

            {/* User Info + Sign Out */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{session.user.name}</p>
                <p className="text-xs text-muted">{session.user.email}</p>
              </div>

              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
                {session.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-primary font-bold text-sm">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                )}
              </div>

              {/* Sign Out */}
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="btn-ghost text-sm text-danger hover:text-danger hover:bg-[rgba(239,68,68,0.08)]"
                  id="signout-btn"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Card */}
        <div className="glass-card p-8 mb-8 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">👋</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Welcome, {session.user.name?.split(" ")[0]}!
              </h1>
              <p className="text-muted">
                Your ArenaLink dashboard — everything starts here.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 animate-fade-in-up delay-200">
          <div className="glass-card-hover p-6 text-center cursor-pointer group">
            <div className="text-3xl mb-3">🏟️</div>
            <h3 className="font-semibold mb-1">Create Match</h3>
            <p className="text-sm text-muted">
              Host a game and find players nearby
            </p>
          </div>
          <div className="glass-card-hover p-6 text-center cursor-pointer group">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="font-semibold mb-1">Find Matches</h3>
            <p className="text-sm text-muted">
              Browse and join available matches
            </p>
          </div>
          <div className="glass-card-hover p-6 text-center cursor-pointer group">
            <div className="text-3xl mb-3">👤</div>
            <h3 className="font-semibold mb-1">Edit Profile</h3>
            <p className="text-sm text-muted">
              Set up your sports preferences
            </p>
          </div>
        </div>

        {/* Session Debug Info (dev only) */}
        <div className="glass-card p-6 animate-fade-in-up delay-400">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="text-sm">🔐</span> Session Info
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted min-w-[80px]">Name:</span>
              <span className="font-medium">{session.user.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted min-w-[80px]">Email:</span>
              <span className="font-medium">{session.user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted min-w-[80px]">User ID:</span>
              <span className="font-mono text-xs bg-surface-hover px-2 py-1 rounded">
                {session.user.id || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
