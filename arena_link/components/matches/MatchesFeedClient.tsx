"use client";

import { useState, useEffect } from "react";
import { getMatches, type MatchDisplayData } from "@/lib/actions/match";
import MatchCard from "@/components/matches/MatchCard";
import Link from "next/link";

export default function MatchesFeedClient({
  initialMatches,
}: {
  initialMatches: MatchDisplayData[];
}) {
  const [matches, setMatches] = useState<MatchDisplayData[]>(initialMatches);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [isSortedByDistance, setIsSortedByDistance] = useState(false);

  const fetchMatchesWithLocation = async () => {
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
          setIsSortedByDistance(true);
        } catch (error) {
          setLocationError("Failed to fetch sorted matches.");
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        setLocationError("Location access denied or failed.");
        setIsLoadingLocation(false);
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Feed Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button className="px-4 py-1.5 rounded-full bg-foreground text-background text-sm font-medium whitespace-nowrap">
          All Sports
        </button>
        <button
          onClick={fetchMatchesWithLocation}
          disabled={isLoadingLocation || isSortedByDistance}
          className={`px-4 py-1.5 rounded-full border text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            isSortedByDistance
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-surface hover:bg-surface-hover"
          } disabled:opacity-70`}
        >
          <span>📍</span>
          {isLoadingLocation
            ? "Locating..."
            : isSortedByDistance
            ? "Sorted by Nearest"
            : "Sort by Distance"}
        </button>
      </div>

      {locationError && (
        <div className="p-3 rounded-xl bg-warning/10 border border-warning/20 text-warning text-sm">
          {locationError} Showing default matches.
        </div>
      )}

      {/* Matches Grid */}
      {matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up">
          {matches.map((match) => (
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
            There are currently no open matches available. Be the first to host a game!
          </p>
          <Link href="/matches/create" className="btn-primary text-sm py-2.5 px-6 inline-block">
            Host a Match
          </Link>
        </div>
      )}
    </div>
  );
}
