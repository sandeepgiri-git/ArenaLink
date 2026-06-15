import Link from "next/link";
import { getMatches } from "@/lib/actions/match";
import MatchesFeedClient from "@/components/matches/MatchesFeedClient";

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

      {/* Feed Filters and Grid handled by Client Component */}
      <MatchesFeedClient initialMatches={matches} />
    </div>
  );
}
