import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted text-sm mt-1">
          Manage your account preferences
        </p>
      </div>

      {/* Coming Soon */}
      <div className="glass-card p-12 text-center">
        <div className="w-20 h-20 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">⚙️</span>
        </div>
        <h2 className="text-xl font-bold mb-2">Coming Soon</h2>
        <p className="text-muted text-sm max-w-md mx-auto mb-6">
          Account settings, notification preferences, and theme customization
          are on the way.
        </p>
        <Link href="/dashboard" className="btn-primary text-sm py-2.5 px-6">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
