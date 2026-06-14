import Link from "next/link";

export default function MatchesPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold">Matches</h1>
        <p className="text-muted text-sm mt-1">
          Find and create sports matches near you
        </p>
      </div>

      {/* Coming Soon */}
      <div className="glass-card p-12 text-center">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">🏟️</span>
        </div>
        <h2 className="text-xl font-bold mb-2">Coming Soon</h2>
        <p className="text-muted text-sm max-w-md mx-auto mb-6">
          Match creation and discovery features are being built. You&apos;ll soon be
          able to create matches, find players, and join games near you.
        </p>
        <Link href="/dashboard" className="btn-primary text-sm py-2.5 px-6">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
