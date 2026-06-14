import { getUserProfile } from "@/lib/actions/user";
import { redirect } from "next/navigation";
import Link from "next/link";

const SPORT_EMOJIS: Record<string, string> = {
  football: "⚽",
  cricket: "🏏",
  basketball: "🏀",
  volleyball: "🏐",
  tennis: "🎾",
  badminton: "🏸",
};

export default async function ProfilePage() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect("/login");
  }

  const joinedDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Profile Header Card */}
      <div className="glass-card overflow-hidden">
        {/* Cover gradient */}
        <div className="h-32 sm:h-40 bg-gradient-to-r from-primary via-accent to-secondary relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+')] opacity-50" />
        </div>

        <div className="px-6 sm:px-8 pb-6">
          {/* Avatar + Name */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-14">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-surface border-4 border-surface shadow-lg flex items-center justify-center overflow-hidden flex-shrink-0">
              {profile.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-primary">
                  {profile.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div className="flex-1 sm:pb-1">
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              {profile.username && (
                <p className="text-muted text-sm">@{profile.username}</p>
              )}
              <div className="flex items-center gap-3 mt-1 text-xs text-muted">
                {profile.city && (
                  <span className="flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {profile.city}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Joined {joinedDate}
                </span>
              </div>
            </div>

            <Link
              href="/profile/edit"
              className="btn-primary text-sm py-2.5 px-5 self-start sm:self-end"
              id="edit-profile-btn"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
              Edit Profile
            </Link>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="mt-4 text-sm text-muted leading-relaxed max-w-2xl">
              {profile.bio}
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-5 text-center">
          <p className="text-2xl font-bold text-primary">
            {profile.matchesPlayed}
          </p>
          <p className="text-xs text-muted mt-1">Matches Played</p>
        </div>
        <div className="glass-card p-5 text-center">
          <p className="text-2xl font-bold text-warning">
            {profile.rating > 0 ? `${profile.rating.toFixed(1)} ★` : "—"}
          </p>
          <p className="text-xs text-muted mt-1">Rating</p>
        </div>
        <div className="glass-card p-5 text-center">
          <p className="text-2xl font-bold text-success">
            {profile.reliabilityScore}%
          </p>
          <p className="text-xs text-muted mt-1">Reliability</p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sports Interests */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>🏅</span> Sports Interests
          </h2>
          {profile.sportsInterests.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.sportsInterests.map((sport) => (
                <span
                  key={sport}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
                >
                  <span>{SPORT_EMOJIS[sport.toLowerCase()] || "🎯"}</span>
                  {sport.charAt(0).toUpperCase() + sport.slice(1)}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">
              No sports selected yet.{" "}
              <Link href="/profile/edit" className="text-primary hover:underline">
                Add your sports
              </Link>
            </p>
          )}
        </div>

        {/* Personal Info */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>📋</span> Details
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-muted">Skill Level</span>
              <span className="font-medium capitalize">
                {profile.skillLevel || "—"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-muted">Gender</span>
              <span className="font-medium capitalize">
                {profile.gender || "—"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-muted">Age</span>
              <span className="font-medium">{profile.age || "—"}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-muted">Email</span>
              <span className="font-medium">{profile.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
