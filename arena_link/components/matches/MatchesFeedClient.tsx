"use client";

import { useState, useMemo } from "react";
import { getMatches, type MatchDisplayData } from "@/lib/actions/match";
import MatchCard from "@/components/matches/MatchCard";
import Link from "next/link";

const SPORTS = [
  { id: "all", label: "All", icon: "apps" },
  { id: "football", label: "Football", icon: "sports_soccer" },
  { id: "cricket", label: "Cricket", icon: "sports_cricket" },
  { id: "basketball", label: "Basketball", icon: "sports_basketball" },
  { id: "volleyball", label: "Volleyball", icon: "sports_volleyball" },
  { id: "tennis", label: "Tennis", icon: "sports_tennis" },
];

export default function MatchesFeedClient({
  initialMatches,
}: {
  initialMatches: MatchDisplayData[];
}) {
  const [matches, setMatches] = useState<MatchDisplayData[]>(initialMatches);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSport, setFilterSport] = useState("all");

  const filteredMatches = useMemo(() => {
    let result = matches.filter((match) => {
      if (filterSport !== "all" && match.sport !== filterSport) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!match.title.toLowerCase().includes(q) && !match.location.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
    return result;
  }, [matches, filterSport, searchQuery]);

  return (
    <>
      {/* Search & Filters */}
      <section className="mb-8">
        <div className="relative mb-4">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input 
            className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl py-4 pl-12 pr-4 text-on-surface focus:outline-none focus:border-primary transition-all focus:ring-1 focus:ring-primary/50 font-body-md" 
            placeholder="Search matches, venues, or players..." 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0" style={{ scrollbarWidth: 'none' }}>
          {SPORTS.map((sport) => {
            const isActive = filterSport === sport.id;
            return (
              <button 
                key={sport.id}
                onClick={() => setFilterSport(sport.id)}
                className={`${isActive ? "bg-primary text-on-primary" : "bg-surface-container-high border border-outline-variant/30 text-on-surface-variant hover:bg-surface-bright"} px-6 py-2 rounded-full font-label-md whitespace-nowrap active:scale-95 transition-colors flex items-center gap-2`}
              >
                {sport.icon !== "apps" && <span className="material-symbols-outlined text-[18px]">{sport.icon}</span>}
                {sport.label}
              </button>
            )
          })}
        </div>
      </section>

      {/* Match Grid */}
      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((match, idx) => (
            <MatchCard key={match.id} match={match} index={idx} />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 text-center rounded-xl flex flex-col items-center justify-center min-h-[300px]">
          <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">search_off</span>
          <h2 className="text-headline-md font-headline-md mb-2">No matches found</h2>
          <p className="text-on-surface-variant text-body-sm max-w-md mx-auto mb-6">
            We couldn&apos;t find any matches matching your filters. Try adjusting them or host your own!
          </p>
          <Link href="/matches/create" className="bg-primary text-on-primary font-headline-md text-sm py-3 px-6 rounded-lg uppercase tracking-wide">
            Host a Match
          </Link>
        </div>
      )}
    </>
  );
}
