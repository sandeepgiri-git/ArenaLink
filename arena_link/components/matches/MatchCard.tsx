import Link from "next/link";
import type { MatchDisplayData } from "@/lib/actions/match";

const SPORT_ICONS: Record<string, string> = {
  football: "sports_soccer",
  cricket: "sports_cricket",
  basketball: "sports_basketball",
  volleyball: "sports_volleyball",
  tennis: "sports_tennis",
  badminton: "sports_tennis",
};

export default function MatchCard({ match, index }: { match: MatchDisplayData; index?: number }) {
  const matchDate = new Date(match.date);
  const formattedDate = matchDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const spotsLeft = match.playersNeeded - match.playersJoinedCount;
  const isFull = spotsLeft <= 0;
  const fillPercentage = Math.min(100, (match.playersJoinedCount / match.playersNeeded) * 100);

  const isFeatured = index === 2;

  if (isFeatured) {
    return (
      <div className="relative rounded-xl overflow-hidden min-h-[300px] flex flex-col justify-end p-6 group shadow-2xl">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            alt="Action shot" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBK5f_b_3i7loW13M1MPQ5fL4JWyDJcDZt_lBuxcJDyDWhvsxhwZxmC988t2z1S9LfOudvJlElEFNqsAKNuKcKTWYyTnswJ5GitGhdIELK7ukSF9tydPd0W5_PSmJZHutVnftqNHKsnYGkZii1S2y5dXbpANNEpkpvNuS8kFVD1BY7CY4w4kUO5hziRGYNzlNxtZjNm_cmO7-wLfHMtKWWNsyGxvZ0jq9avchtvq3TOeb_hRU8fdBKjSKNKTLW8H2EhFS0j9VMKfHCT"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-primary text-on-primary text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded">Featured</span>
            <span className="bg-black/50 backdrop-blur text-white text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded border border-white/10">
              {match.costPerPlayer === 0 ? "Free" : `₹${match.costPerPlayer}`}
            </span>
            {match.distanceInKm !== undefined && (
              <span className="bg-black/50 backdrop-blur text-white text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded border border-white/10 flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">my_location</span>
                {match.distanceInKm} km
              </span>
            )}
          </div>
          <h3 className="font-headline-lg text-white truncate">{match.title}</h3>
          <p className="text-on-surface-variant text-body-sm mb-4 truncate">
            {formattedDate} at {match.time} • {match.location}
          </p>
          <Link href={`/matches/${match.id}`} className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-2 rounded-lg font-label-md hover:bg-white/20 transition-all">
            View Match
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-xl p-6 flex flex-col justify-between hover:border-primary/30 transition-all duration-300 group relative overflow-hidden">
      {/* Optional Glow */}
      <div className="absolute -right-12 -top-12 w-32 h-32 bg-primary/5 blur-3xl group-hover:bg-primary/20 transition-all"></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[28px]">{SPORT_ICONS[match.sport.toLowerCase()] || "sports_kabaddi"}</span>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="bg-secondary/10 text-secondary text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded">
                {match.skillLevelRequired === "any" ? "Casual" : match.skillLevelRequired}
              </span>
              <span className="bg-surface-bright text-on-surface text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded">
                {match.costPerPlayer === 0 ? "Free" : `₹${match.costPerPlayer}`}
              </span>
            </div>
            <h3 className="font-headline-md text-on-surface leading-tight mt-1 truncate max-w-[180px]">{match.title}</h3>
          </div>
        </div>
        {match.distanceInKm !== undefined && (
          <div className="flex flex-col items-end text-primary">
            <span className="material-symbols-outlined text-[16px]">my_location</span>
            <span className="text-[10px] font-bold uppercase">{match.distanceInKm} km</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-outline mb-6 relative z-10 bg-surface-container-low/50 p-3 rounded-lg border border-outline-variant/20">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-primary-fixed">calendar_today</span>
          <span className="font-label-sm truncate">{formattedDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-secondary">schedule</span>
          <span className="font-label-sm truncate">{match.time}</span>
        </div>
        <div className="flex items-center gap-2 col-span-2 mt-1">
          <span className="material-symbols-outlined text-[16px] text-tertiary">location_on</span>
          <p className="font-label-sm truncate flex-1">{match.location}</p>
        </div>
      </div>
      
      <div className="mb-6 relative z-10">
        <div className="flex justify-between items-end mb-2">
          <span className="font-label-sm text-on-surface-variant">Players Joined</span>
          <span className="font-headline-md text-secondary">
            {match.playersJoinedCount}<span className="text-on-surface-variant text-sm">/{match.playersNeeded}</span>
          </span>
        </div>
        <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${isFull ? 'bg-error' : 'bg-secondary glow-green'}`} style={{ width: `${fillPercentage}%` }}></div>
        </div>
      </div>
      
      <Link 
        href={`/matches/${match.id}`} 
        className={`w-full py-3 rounded-lg font-headline-md uppercase transition-all active:scale-95 flex items-center justify-center gap-2 relative z-10 ${
          isFull 
            ? 'bg-surface-container-highest text-outline cursor-not-allowed border border-outline-variant/30' 
            : 'bg-secondary text-on-secondary-fixed hover:bg-secondary-fixed shadow-[0_0_10px_rgba(78,222,163,0.3)]'
        }`}
      >
        {isFull ? "MATCH FULL" : "JOIN MATCH"}
      </Link>
    </div>
  );
}
