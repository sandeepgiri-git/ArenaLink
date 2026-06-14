import Link from "next/link";
import type { MatchDisplayData } from "@/lib/actions/match";

const SPORT_EMOJIS: Record<string, string> = {
  football: "⚽",
  cricket: "🏏",
  basketball: "🏀",
  volleyball: "🏐",
  tennis: "🎾",
  badminton: "🏸",
};

export default function MatchCard({ match }: { match: MatchDisplayData }) {
  const matchDate = new Date(match.date);
  const formattedDate = matchDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const spotsLeft = match.playersNeeded - match.playersJoinedCount;
  const isFull = spotsLeft <= 0;

  return (
    <div className="glass-card-hover p-5 flex flex-col group relative overflow-hidden">
      {/* Status Banner */}
      {isFull && (
        <div className="absolute top-0 right-0 bg-danger text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg z-10">
          Full
        </div>
      )}

      {/* Header: Sport & Title */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-2xl">
          {SPORT_EMOJIS[match.sport.toLowerCase()] || "🏅"}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg leading-tight truncate group-hover:text-primary transition-colors">
            {match.title}
          </h3>
          <p className="text-sm text-muted capitalize mt-0.5">{match.sport}</p>
        </div>
      </div>

      {/* Details List */}
      <div className="space-y-2 mb-5 flex-1 text-sm">
        <div className="flex items-center gap-2 text-muted">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className="truncate">{formattedDate} at {match.time}</span>
        </div>
        
        <div className="flex items-center gap-2 text-muted">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="truncate">{match.location}</span>
        </div>

        <div className="flex items-center gap-2 text-muted">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <span>
            {isFull ? (
              <span className="text-danger font-medium">Match is full</span>
            ) : (
              <span className="text-primary font-medium">{spotsLeft} spots left</span>
            )}
            {" "}({match.playersNeeded} total)
          </span>
        </div>
      </div>

      {/* Footer: Host & Action */}
      <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-surface-hover border border-border flex items-center justify-center overflow-hidden">
            {match.host.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={match.host.image} alt={match.host.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-muted">
                {match.host.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="text-xs">
            <p className="text-muted-foreground">Hosted by</p>
            <p className="font-semibold truncate max-w-[100px]">{match.host.name.split(" ")[0]}</p>
          </div>
        </div>

        <Link
          href={`/matches/${match.id}`}
          className={`btn-ghost text-xs py-1.5 px-3 ${isFull ? 'opacity-50' : 'text-primary hover:bg-primary/10'}`}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
