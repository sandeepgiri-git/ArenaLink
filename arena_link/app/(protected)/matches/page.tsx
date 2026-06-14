import Link from "next/link";
import { getMatches } from "@/lib/actions/match";
import MatchCard from "@/components/matches/MatchCard";

export const metadata = {
  title: "Matches | ArenaLink",
  description: "Discover and join sports matches near you.",
};

export const revalidate = 0; // Disable static rendering for the feed to always show latest data

export default async function MatchesPage() {
  const matches = await getMatches();

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Discover Matches</h1>
          <p className="text-muted text-sm mt-1">
            Find games near you or host your own.
          </p>
        </div>
        <Link href="/matches/create" className="btn-primary text-sm py-2.5 px-5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 inline">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Host Match
        </Link>
      </div>

      {/* Feed Filters (Placeholder for future) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button className="px-4 py-1.5 rounded-full bg-foreground text-background text-sm font-medium whitespace-nowrap">
          All Sports
        </button>
        <button className="px-4 py-1.5 rounded-full border border-border bg-surface hover:bg-surface-hover text-sm font-medium whitespace-nowrap transition-colors">
          Football
        </button>
        <button className="px-4 py-1.5 rounded-full border border-border bg-surface hover:bg-surface-hover text-sm font-medium whitespace-nowrap transition-colors">
          Cricket
        </button>
        <button className="px-4 py-1.5 rounded-full border border-border bg-surface hover:bg-surface-hover text-sm font-medium whitespace-nowrap transition-colors">
          Badminton
        </button>
      </div>

      {/* Matches Grid */}
      {matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card p-12 text-center mt-6">
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
