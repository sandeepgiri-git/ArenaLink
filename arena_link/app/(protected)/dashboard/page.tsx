import { getUserProfile } from "@/lib/actions/user";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect("/login");
  }

  // Calculate profile completion
  const profileFields = [
    profile.name,
    profile.username,
    profile.bio,
    profile.city,
    profile.age,
    profile.gender,
    profile.sportsInterests.length > 0 ? "yes" : "",
    profile.skillLevel,
  ];
  const filled = profileFields.filter(Boolean).length;
  const completion = Math.round((filled / profileFields.length) * 100);
  const isProfileIncomplete = completion < 100;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Welcome */}
      <div className="glass-card p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">👋</span>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Welcome, {profile.name.split(" ")[0]}!
            </h1>
            <p className="text-muted text-sm mt-0.5">
              Your ArenaLink dashboard — everything starts here.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Completion Nudge */}
      {isProfileIncomplete && (
        <div className="glass-card p-6 border-l-4 border-l-warning animate-fade-in-up">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center flex-shrink-0">
                <span className="text-lg">⚡</span>
              </div>
              <div>
                <h3 className="font-semibold">Complete your profile</h3>
                <p className="text-sm text-muted">
                  Add your city, sports interests, and more to get matched faster.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Progress ring */}
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.5"
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.5"
                    fill="none"
                    stroke="var(--warning)"
                    strokeWidth="3"
                    strokeDasharray={`${completion} 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                  {completion}%
                </span>
              </div>
              <Link
                href="/profile/edit"
                className="btn-primary text-sm py-2 px-4"
              >
                Complete Profile
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/matches"
            className="glass-card-hover p-6 text-center group block"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🏟️</span>
            </div>
            <h3 className="font-semibold mb-1">Create Match</h3>
            <p className="text-sm text-muted">
              Host a game and find players nearby
            </p>
          </Link>
          <Link
            href="/matches"
            className="glass-card-hover p-6 text-center group block"
          >
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="font-semibold mb-1">Find Matches</h3>
            <p className="text-sm text-muted">
              Browse and join available matches
            </p>
          </Link>
          <Link
            href="/profile/edit"
            className="glass-card-hover p-6 text-center group block"
          >
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <span className="text-2xl">👤</span>
            </div>
            <h3 className="font-semibold mb-1">Edit Profile</h3>
            <p className="text-sm text-muted">
              Set up your sports preferences
            </p>
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Your Stats</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-5 text-center">
            <p className="text-2xl font-bold text-primary">{profile.matchesPlayed}</p>
            <p className="text-xs text-muted mt-1">Matches Played</p>
          </div>
          <div className="glass-card p-5 text-center">
            <p className="text-2xl font-bold text-warning">
              {profile.rating > 0 ? profile.rating.toFixed(1) : "—"}
            </p>
            <p className="text-xs text-muted mt-1">Rating</p>
          </div>
          <div className="glass-card p-5 text-center">
            <p className="text-2xl font-bold text-success">{profile.reliabilityScore}%</p>
            <p className="text-xs text-muted mt-1">Reliability</p>
          </div>
          <div className="glass-card p-5 text-center">
            <p className="text-2xl font-bold text-accent">
              {profile.sportsInterests.length}
            </p>
            <p className="text-xs text-muted mt-1">Sports</p>
          </div>
        </div>
      </div>
    </div>
  );
}
