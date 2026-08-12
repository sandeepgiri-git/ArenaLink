"use client";

import { useState, useMemo, useEffect } from "react";
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

const SKILL_LEVELS = [
  { id: "all", label: "Any Skill Level" },
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
  { id: "pro", label: "Pro" },
];

export default function MatchesFeedClient({
  initialMatches,
}: {
  initialMatches: MatchDisplayData[];
}) {
  const [matches, setMatches] = useState<MatchDisplayData[]>(initialMatches);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSport, setFilterSport] = useState("all");
  const [filterSkill, setFilterSkill] = useState("all");
  
  const [sortBy, setSortBy] = useState<"date" | "distance">("date");
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  // Handle Sort By Distance
  useEffect(() => {
    if (sortBy === "distance") {
      setIsLocating(true);
      setLocationError("");
      
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const distanceMatches = await getMatches(latitude, longitude);
              setMatches(distanceMatches);
            } catch (error) {
              console.error("Error fetching distance matches:", error);
              setLocationError("Failed to fetch nearby matches");
              setSortBy("date");
            } finally {
              setIsLocating(false);
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            setLocationError("Location access denied or unavailable");
            setSortBy("date");
            setIsLocating(false);
          },
          { timeout: 10000 }
        );
      } else {
        setLocationError("Geolocation is not supported by your browser");
        setSortBy("date");
        setIsLocating(false);
      }
    } else {
      // Revert to initial matches (sorted by date)
      setMatches(initialMatches);
    }
  }, [sortBy, initialMatches]);

  const filteredMatches = useMemo(() => {
    let result = matches.filter((match) => {
      // Sport Filter
      if (filterSport !== "all" && match.sport !== filterSport) return false;
      
      // Skill Filter
      if (filterSkill !== "all" && match.skillLevelRequired !== "any" && match.skillLevelRequired !== filterSkill) return false;
      
      // Search Query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!match.title.toLowerCase().includes(q) && !match.location.toLowerCase().includes(q)) {
          return false;
        }
      }
      
      return true;
    });
    return result;
  }, [matches, filterSport, filterSkill, searchQuery]);

  return (
    <>
      {/* Search & Filters */}
      <section className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input 
            className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl py-4 pl-12 pr-4 text-on-surface focus:outline-none focus:border-primary transition-all focus:ring-1 focus:ring-primary/50 font-body-md" 
            placeholder="Search matches, venues, or players..." 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Sport Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 flex-1" style={{ scrollbarWidth: 'none' }}>
            {SPORTS.map((sport) => {
              const isActive = filterSport === sport.id;
              return (
                <button 
                  key={sport.id}
                  onClick={() => setFilterSport(sport.id)}
                  className={`${isActive ? "bg-primary text-on-primary font-bold" : "bg-surface-container-high border border-outline-variant/30 text-on-surface-variant hover:bg-surface-bright"} px-5 py-2.5 rounded-full font-label-md whitespace-nowrap active:scale-95 transition-all flex items-center gap-2`}
                >
                  {sport.icon !== "apps" && <span className="material-symbols-outlined text-[18px]">{sport.icon}</span>}
                  {sport.label}
                </button>
              )
            })}
          </div>

          {/* Secondary Filters & Sort */}
          <div className="flex items-center gap-3">
            {/* Skill Level Dropdown */}
            <div className="relative">
              <select 
                value={filterSkill}
                onChange={(e) => setFilterSkill(e.target.value)}
                className="appearance-none bg-surface-container border border-outline-variant/30 text-on-surface rounded-xl px-4 py-2.5 pr-10 font-label-md outline-none focus:border-primary cursor-pointer"
              >
                {SKILL_LEVELS.map(skill => (
                  <option key={skill.id} value={skill.id}>{skill.label}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline-variant">expand_more</span>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "distance")}
                disabled={isLocating}
                className="appearance-none bg-surface-container border border-outline-variant/30 text-on-surface rounded-xl px-4 py-2.5 pr-10 font-label-md outline-none focus:border-primary cursor-pointer disabled:opacity-50"
              >
                <option value="date">Sort by Date</option>
                <option value="distance">Sort by Distance</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline-variant">
                {isLocating ? "sync" : "expand_more"}
              </span>
            </div>
          </div>
        </div>

        {locationError && (
          <div className="text-error text-sm bg-error-container/20 border border-error/20 px-4 py-2 rounded-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">error</span>
            {locationError}
          </div>
        )}
      </section>

      {/* Match Grid */}
      {isLocating ? (
        <div className="glass-panel p-12 text-center rounded-xl flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
          <h2 className="text-headline-md font-headline-md text-on-surface mb-2">Locating Matches...</h2>
          <p className="text-on-surface-variant text-body-sm">Finding the best games near you.</p>
        </div>
      ) : filteredMatches.length > 0 ? (
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
            We couldn't find any matches matching your filters. Try adjusting them or host your own!
          </p>
          <Link href="/matches/create" className="bg-primary text-on-primary font-headline-md text-sm py-3 px-6 rounded-lg uppercase tracking-wide flex items-center gap-2 hover:scale-105 transition-transform w-fit mx-auto">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Host a Match
          </Link>
        </div>
      )}
    </>
  );
}
