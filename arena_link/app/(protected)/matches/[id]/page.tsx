import { notFound } from "next/navigation";
import { getMatchById } from "@/lib/actions/match";
import { getMatchRequests, getUserRequestForMatch } from "@/lib/actions/joinRequest";
import { auth } from "@/auth";
import Link from "next/link";
import HostRequestManager from "@/components/matches/HostRequestManager";
import JoinMatchButton from "@/components/matches/JoinMatchButton";
import MatchChat from "@/components/matches/MatchChat";
import { getMatchMessages } from "@/lib/actions/chat";
import StaticLocationMapWrapper from "@/components/matches/StaticLocationMapWrapper";
import { Metadata } from "next";

const SPORT_EMOJIS: Record<string, string> = {
  football: "⚽",
  cricket: "🏏",
  basketball: "🏀",
  volleyball: "🏐",
  tennis: "🎾",
  badminton: "🏸",
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const match = await getMatchById(id);

  if (!match) {
    return { title: "Match Not Found - ArenaLink" };
  }

  const matchDate = new Date(match.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return {
    title: `${match.title} | ArenaLink`,
    description: `Join ${match.host.name}'s ${match.sport} match on ${matchDate} at ${match.time}. ${match.playersNeeded - match.playersJoinedCount} spots left!`,
    openGraph: {
      title: `⚽ ${match.title}`,
      description: `Join ${match.host.name}'s ${match.sport} match on ${matchDate} at ${match.time}. ${match.playersNeeded - match.playersJoinedCount} spots left!`,
      type: "website",
      siteName: "ArenaLink",
    },
    twitter: {
      card: "summary_large_image",
      title: `${match.title} | ArenaLink`,
      description: `Join ${match.host.name}'s ${match.sport} match on ${matchDate} at ${match.time}.`,
    },
  };
}

export default async function MatchDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const userId = session?.user?.id;

  const match = await getMatchById(id);

  if (!match) {
    notFound();
  }

  const isHost = userId === match.host.id;
  const isJoined = match.playersJoined.some((p) => p.id === userId);
  const spotsLeft = match.playersNeeded - match.playersJoinedCount;
  const isFull = spotsLeft <= 0;

  // If host, fetch all requests. Otherwise fetch just the user's request.
  let hostRequests: any[] = [];
  let userRequestStatus = null;

  if (isHost) {
    hostRequests = await getMatchRequests(id);
  } else if (userId && !isJoined) {
    const userRequest = await getUserRequestForMatch(id);
    userRequestStatus = userRequest?.status || null;
  } else if (isJoined) {
    userRequestStatus = "accepted";
  }

  // Fetch chat messages if user is host or joined
  let initialMessages: any[] = [];
  if ((isHost || isJoined) && userId) {
    initialMessages = await getMatchMessages(id);
  }

  const matchDate = new Date(match.date);
  const formattedDate = matchDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up space-y-8 pb-12">
      {/* Header Section */}
      <div className="glass-card p-6 md:p-8 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 text-[200px] opacity-[0.03] pointer-events-none select-none">
          {SPORT_EMOJIS[match.sport.toLowerCase()] || "🏅"}
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full capitalize">
              {match.sport}
            </span>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
              match.status === "open" ? "bg-success/10 text-success" : 
              match.status === "full" ? "bg-warning/10 text-warning" : 
              "bg-surface-hover text-muted"
            }`}>
              {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
            </span>
            {match.skillLevelRequired !== "any" && (
              <span className="px-3 py-1 bg-surface border border-border text-foreground text-sm font-medium rounded-full capitalize">
                {match.skillLevelRequired} Level
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">{match.title}</h1>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-hover border border-border flex items-center justify-center overflow-hidden">
              {match.host.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={match.host.image} alt={match.host.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-bold text-muted">
                  {match.host.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hosted by</p>
              <Link href={`/profile/${match.host.id}`} className="font-medium hover:text-primary transition-colors">
                {match.host.name}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Info Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="glass-card p-5 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center text-lg flex-shrink-0">
                📅
              </div>
              <div>
                <p className="text-sm text-muted mb-1">Date & Time</p>
                <p className="font-medium">{formattedDate}</p>
                <p className="font-medium text-muted-foreground">{match.time}</p>
              </div>
            </div>

            <div className="glass-card p-5 flex flex-col gap-4 sm:col-span-2 md:col-span-1 lg:col-span-2">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg flex-shrink-0">
                  📍
                </div>
                <div>
                  <p className="text-sm text-muted mb-1">Location</p>
                  <p className="font-medium">{match.location}</p>
                </div>
              </div>
              
              {match.coordinates && match.coordinates.length === 2 && (
                <div className="mt-2 w-full">
                  <StaticLocationMapWrapper lat={match.coordinates[1]} lng={match.coordinates[0]} />
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${match.coordinates[1]},${match.coordinates[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center justify-center gap-2 w-full btn-secondary py-2.5 text-sm font-medium hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                      <line x1="9" y1="3" x2="9" y2="21"></line>
                      <line x1="15" y1="3" x2="15" y2="21"></line>
                    </svg>
                    Open in Google Maps
                  </a>
                </div>
              )}
            </div>

            <div className="glass-card p-5 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center text-lg flex-shrink-0">
                👥
              </div>
              <div>
                <p className="text-sm text-muted mb-1">Players</p>
                <p className="font-medium">
                  {match.playersJoinedCount} / {match.playersNeeded} Joined
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {isFull ? "Match Full" : `${spotsLeft} spots remaining`}
                </p>
              </div>
            </div>

            <div className="glass-card p-5 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-warning/10 text-warning flex items-center justify-center text-lg flex-shrink-0">
                💰
              </div>
              <div>
                <p className="text-sm text-muted mb-1">Cost Per Player</p>
                <p className="font-medium">
                  {match.costPerPlayer === 0 ? "Free" : `₹${match.costPerPlayer}`}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {match.description && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-sm">📝</span>
                About this match
              </h2>
              <p className="text-muted whitespace-pre-wrap leading-relaxed">
                {match.description}
              </p>
            </div>
          )}

          {/* Players Roster */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-sm">🏃</span>
              Players Roster ({match.playersJoinedCount}/{match.playersNeeded})
            </h2>
            
            {match.playersJoined.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {match.playersJoined.map((player) => (
                  <Link href={`/profile/${player.id}`} key={player.id} className="flex flex-col items-center p-4 rounded-xl bg-surface border border-border hover:border-primary/30 transition-colors text-center group">
                    <div className="w-14 h-14 rounded-full bg-surface-hover border-2 border-background overflow-hidden mb-3">
                      {player.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg font-bold text-muted">
                          {player.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <p className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1 w-full">{player.name}</p>
                    <div className="flex items-center justify-center gap-1 mt-1 text-xs text-warning">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      {player.rating.toFixed(1)}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-surface rounded-xl border border-border border-dashed">
                <p className="text-muted">No players have joined yet.</p>
                {!isHost && !isJoined && !isFull && (
                  <p className="text-sm mt-1">Be the first to join!</p>
                )}
              </div>
            )}
          </div>

          {/* Group Chat */}
          {(isHost || isJoined) && userId && (
            <div className="mt-8">
              <MatchChat matchId={id} initialMessages={initialMessages} currentUserId={userId} />
            </div>
          )}
        </div>

        {/* Right Column: Actions / Host Management */}
        <div className="space-y-6">
          {/* Action Card */}
          {!isHost && (
            <div className="glass-card p-6 sticky top-6">
              <h3 className="font-bold text-lg mb-4">Join this match</h3>
              <JoinMatchButton 
                matchId={id} 
                initialStatus={userRequestStatus as "pending" | "accepted" | "rejected" | null}
                isFull={isFull}
              />
              
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted mb-3 text-center">Share with friends</p>
                <button className="w-full btn-secondary py-2 flex items-center justify-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                  Share Match
                </button>
              </div>
            </div>
          )}

          {/* Host Requests Panel */}
          {isHost && (
            <div className="md:sticky md:top-6 space-y-6 md:max-h-[calc(100vh-3rem)] md:overflow-y-auto no-scrollbar pb-6">
              <div className="glass-card p-6 border-primary/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold">You are the Host</h3>
                    <p className="text-xs text-muted">Manage your match here</p>
                  </div>
                </div>
                
                <div className="flex flex-col xl:flex-row gap-2">
                  <button className="flex-1 btn-secondary text-sm py-2">Edit Match</button>
                  <button className="flex-1 btn-secondary text-sm py-2 text-danger hover:bg-danger/10 hover:border-danger/20">Cancel Match</button>
                </div>
              </div>

              <HostRequestManager matchId={id} initialRequests={hostRequests} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
