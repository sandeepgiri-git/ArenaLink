"use client";

import { useState, useMemo } from "react";
import { getMatches, type MatchDisplayData } from "@/lib/actions/match";
import MatchCard from "@/components/matches/MatchCard";
import Link from "next/link";

const SPORTS = [
  { id: "all", label: "All Sports", emoji: "🏆" },
  { id: "football", label: "Football", emoji: "⚽" },
  { id: "cricket", label: "Cricket", emoji: "🏏" },
  { id: "basketball", label: "Basketball", emoji: "🏀" },
  { id: "volleyball", label: "Volleyball", emoji: "🏐" },
  { id: "tennis", label: "Tennis", emoji: "🎾" },
  { id: "badminton", label: "Badminton", emoji: "🏸" },
];

export default function MatchesFeedClient({
  initialMatches,
}: {
  initialMatches: MatchDisplayData[];
}) {
  const [matches, setMatches] = useState<MatchDisplayData[]>(initialMatches);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [isSortedByDistance, setIsSortedByDistance] = useState(false);

  // Filter States
  const [filterSport, setFilterSport] = useState("all");
  const [filterDate, setFilterDate] = useState("all");
  const [filterTime, setFilterTime] = useState("all");
  const [filterSkill, setFilterSkill] = useState("all");
  const [filterDistance, setFilterDistance] = useState("all");
  
  const [showFilters, setShowFilters] = useState(false);

  const fetchMatchesWithLocation = async (autoSort: boolean = true) => {
    setIsLoadingLocation(true);
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const sortedMatches = await getMatches(lat, lng);
          setMatches(sortedMatches);
          setIsSortedByDistance(autoSort);
        } catch (error) {
          setLocationError("Failed to fetch sorted matches.");
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        setLocationError("Location access denied. Distance filters unavailable.");
        setFilterDistance("all");
        setIsLoadingLocation(false);
      }
    );
  };

  const handleDistanceFilterChange = (val: string) => {
    setFilterDistance(val);
    if (val !== "all" && !isSortedByDistance) {
      fetchMatchesWithLocation(false);
    }
  };

  const filteredMatches = useMemo(() => {
    let result = matches.filter((match) => {
      // 1. Sport
      if (filterSport !== "all" && match.sport !== filterSport) return false;

      // 2. Skill Level (If match requires 'intermediate', but user filters 'beginner', hide it)
      // Usually, 'any' skill matches everything.
      if (filterSkill !== "all" && match.skillLevelRequired !== "any" && match.skillLevelRequired !== filterSkill) return false;

      // 3. Date
      if (filterDate !== "all") {
        const matchDate = new Date(match.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const matchDateStr = matchDate.toISOString().split("T")[0];
        const todayStr = today.toISOString().split("T")[0];
        const tomorrowStr = tomorrow.toISOString().split("T")[0];

        if (filterDate === "today" && matchDateStr !== todayStr) return false;
        if (filterDate === "tomorrow" && matchDateStr !== tomorrowStr) return false;
        if (filterDate === "this_week") {
          const nextWeek = new Date(today);
          nextWeek.setDate(nextWeek.getDate() + 7);
          if (matchDate > nextWeek || matchDate < today) return false;
        }
      }

      // 4. Time
      if (filterTime !== "all") {
        const hour = parseInt(match.time.split(":")[0], 10);
        if (filterTime === "morning" && (hour < 5 || hour >= 12)) return false;
        if (filterTime === "afternoon" && (hour < 12 || hour >= 17)) return false;
        if (filterTime === "evening" && (hour < 17)) return false;
      }

      // 5. Distance
      if (filterDistance !== "all" && match.distanceInKm !== undefined) {
        if (match.distanceInKm > parseInt(filterDistance, 10)) return false;
      }

      return true;
    });

    // If "Sorted by Distance" button is explicitly active, sort by distance.
    // (getMatches already sorts by distance, but we re-apply just in case).
    if (isSortedByDistance) {
      result.sort((a, b) => (a.distanceInKm || 9999) - (b.distanceInKm || 9999));
    }

    return result;
  }, [matches, filterSport, filterDate, filterTime, filterSkill, filterDistance, isSortedByDistance]);

  const activeFiltersCount = [
    filterSport !== "all",
    filterDate !== "all",
    filterTime !== "all",
    filterSkill !== "all",
    filterDistance !== "all"
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Filters Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Quick Sport Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide flex-1">
          {SPORTS.slice(0, 4).map((sport) => (
            <button
              key={sport.id}
              onClick={() => setFilterSport(sport.id)}
              className={`px-4 py-1.5 rounded-full border text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                filterSport === sport.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-surface hover:bg-surface-hover"
              }`}
            >
              <span>{sport.emoji}</span>
              {sport.label}
            </button>
          ))}
          
          <button
            onClick={() => {
              setFilterDistance("all");
              fetchMatchesWithLocation(true);
            }}
            disabled={isLoadingLocation || isSortedByDistance}
            className={`px-4 py-1.5 rounded-full border text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              isSortedByDistance
                ? "border-success bg-success/10 text-success"
                : "border-border bg-surface hover:bg-surface-hover"
            } disabled:opacity-70`}
          >
            <span>📍</span>
            {isLoadingLocation ? "Locating..." : isSortedByDistance ? "Nearest First" : "Sort Nearest"}
          </button>
        </div>

        {/* Toggle Advanced Filters Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
            showFilters || activeFiltersCount > 0
              ? "bg-primary/10 border-primary text-primary"
              : "bg-surface border-border hover:bg-surface-hover text-muted-foreground"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
          Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </button>
      </div>

      {/* Expandable Filters Panel */}
      {showFilters && (
        <div className="glass-card p-5 animate-fade-in-up grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Sport</label>
            <select
              value={filterSport}
              onChange={(e) => setFilterSport(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary appearance-none"
            >
              {SPORTS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Date</label>
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary appearance-none"
            >
              <option value="all">Any Date</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="this_week">This Week</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Time</label>
            <select
              value={filterTime}
              onChange={(e) => setFilterTime(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary appearance-none"
            >
              <option value="all">Any Time</option>
              <option value="morning">Morning (5am - 12pm)</option>
              <option value="afternoon">Afternoon (12pm - 5pm)</option>
              <option value="evening">Evening (5pm+)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Skill Level</label>
            <select
              value={filterSkill}
              onChange={(e) => setFilterSkill(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary appearance-none"
            >
              <option value="all">Any Level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="pro">Pro</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Max Distance</label>
            <select
              value={filterDistance}
              onChange={(e) => handleDistanceFilterChange(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary appearance-none"
            >
              <option value="all">Any Distance</option>
              <option value="5">Within 5 km</option>
              <option value="10">Within 10 km</option>
              <option value="25">Within 25 km</option>
            </select>
          </div>
          
          {activeFiltersCount > 0 && (
            <div className="sm:col-span-2 lg:col-span-5 flex justify-end mt-2">
              <button 
                onClick={() => {
                  setFilterSport("all");
                  setFilterDate("all");
                  setFilterTime("all");
                  setFilterSkill("all");
                  setFilterDistance("all");
                  setIsSortedByDistance(false);
                }}
                className="text-xs text-danger hover:underline font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {locationError && (
        <div className="p-3 rounded-xl bg-warning/10 border border-warning/20 text-warning text-sm">
          {locationError}
        </div>
      )}

      {/* Matches Grid */}
      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up">
          {filteredMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card p-12 text-center mt-6 animate-fade-in-up">
          <div className="w-20 h-20 rounded-2xl bg-surface-hover border border-border flex items-center justify-center mx-auto mb-4 text-4xl">
            🏟️
          </div>
          <h2 className="text-lg font-bold mb-2">No matches found</h2>
          <p className="text-muted text-sm max-w-md mx-auto mb-6">
            We couldn't find any open matches matching your filters. Try adjusting them or host your own!
          </p>
          <Link href="/matches/create" className="btn-primary text-sm py-2.5 px-6 inline-block">
            Host a Match
          </Link>
        </div>
      )}
    </div>
  );
}
