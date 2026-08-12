import Link from "next/link";
import { getMatches } from "@/lib/actions/match";
import MatchesFeedClient from "@/components/matches/MatchesFeedClient";

export const metadata = {
  title: "Matches | ArenaLink",
  description: "Discover and join sports matches near you.",
};

export const revalidate = 0;

export default async function MatchesPage() {
  const matches = await getMatches();

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface uppercase">Discover Matches</h1>
          <p className="text-on-surface-variant text-body-sm mt-1">
            Find games near you or host your own.
          </p>
        </div>
        <Link href="/matches/create" className="bg-primary text-on-primary text-sm py-2.5 px-5 rounded-lg font-label-md uppercase tracking-wide flex items-center gap-2 hover:scale-105 transition-transform">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Host Match
        </Link>
      </div>

      {/* Feed Filters and Grid handled by Client Component */}
      <MatchesFeedClient initialMatches={matches} />
    </div>
  );
}
