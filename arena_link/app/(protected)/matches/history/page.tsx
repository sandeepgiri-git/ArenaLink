"use client";

import { useEffect, useState } from "react";
import { getUserMatches, type MatchDisplayData } from "@/lib/actions/match";
import MatchCard from "@/components/matches/MatchCard";
import Link from "next/link";

export default function MatchHistoryPage() {
  const [upcomingMatches, setUpcomingMatches] = useState<MatchDisplayData[]>([]);
  const [pastMatches, setPastMatches] = useState<MatchDisplayData[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const { upcoming, past, currentUserId } = await getUserMatches();
      setUpcomingMatches(upcoming);
      setPastMatches(past);
      setCurrentUserId(currentUserId);
      setIsLoading(false);
    };
    fetchHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p className="text-muted font-medium animate-pulse">Loading your match history...</p>
      </div>
    );
  }

  const currentMatches = activeTab === "upcoming" ? upcomingMatches : pastMatches;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">My Matches</h1>
          <p className="text-muted mt-1">Track the games you're hosting or playing in.</p>
        </div>
        <Link href="/matches/create" className="btn-primary flex-shrink-0 text-center">
          + Host New Match
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-surface rounded-2xl border border-border w-fit">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
            activeTab === "upcoming"
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
              : "text-muted hover:text-foreground hover:bg-surface-hover"
          }`}
        >
          Upcoming ({upcomingMatches.length})
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
            activeTab === "past"
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
              : "text-muted hover:text-foreground hover:bg-surface-hover"
          }`}
        >
          Past Matches ({pastMatches.length})
        </button>
      </div>

      {/* Match List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {currentMatches.length === 0 ? (
          <div className="col-span-full glass-card p-12 text-center text-muted flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-surface-hover flex items-center justify-center mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              No {activeTab} matches found
            </h3>
            <p className="max-w-md">
              {activeTab === "upcoming" 
                ? "You haven't joined or hosted any upcoming matches yet. Check out the feed to find a game!"
                : "You don't have any completed matches yet."}
            </p>
            {activeTab === "upcoming" && (
              <Link href="/matches" className="btn-secondary mt-6">
                Browse Matches
              </Link>
            )}
          </div>
        ) : (
          currentMatches.map((match) => (
            <div key={match.id} className="relative group flex flex-col h-full">
              <div className="flex-1">
                <MatchCard match={match} />
              </div>
              
              {/* Rate Players Button for Past Matches */}
              {activeTab === "past" && (
                <div className="mt-3">
                  <Link href={`/matches/${match.id}/rate`} className="btn-primary w-full text-center py-2.5 shadow-sm">
                    ⭐ Rate Players
                  </Link>
                </div>
              )}
              
              {/* Badge for Host vs Joined */}
              <div className="absolute top-3 left-3 z-10">
                {match.host.id === currentUserId ? (
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-md shadow-lg shadow-primary/20 flex items-center gap-1 border border-primary-foreground/10">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    Hosting
                  </span>
                ) : (
                  <span className="bg-success text-success-foreground text-xs font-bold px-2 py-1 rounded-md shadow-lg shadow-success/20 border border-success-foreground/10">
                    Joined
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
