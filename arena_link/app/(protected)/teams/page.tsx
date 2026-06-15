"use client";

import { useEffect, useState } from "react";
import { getUserTeams, createTeam, type TeamDisplay } from "@/lib/actions/team";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TeamsPage() {
  const [teams, setTeams] = useState<TeamDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  
  // Form State
  const [name, setName] = useState("");
  const [sport, setSport] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchTeams = async () => {
      const res = await getUserTeams();
      if (res.success) {
        setTeams(res.teams);
      }
      setIsLoading(false);
    };
    fetchTeams();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsCreating(true);

    const res = await createTeam(name, sport);
    if (res.success && res.teamId) {
      router.push(`/teams/${res.teamId}`);
    } else {
      setError(res.message || "Failed to create team");
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">My Teams</h1>
          <p className="text-muted mt-1">Manage your squads and coordinate matches.</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="btn-primary flex-shrink-0">
          {showCreate ? "Cancel" : "+ Create Team"}
        </button>
      </div>

      {showCreate && (
        <div className="glass-card p-6 border-primary/20 shadow-lg shadow-primary/5">
          <h2 className="text-xl font-bold mb-4">Create a New Team</h2>
          {error && <p className="text-danger text-sm mb-4 bg-danger/10 p-3 rounded-xl">{error}</p>}
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Team Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary/50"
                  placeholder="e.g. The Net Ninjas"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Primary Sport</label>
                <select 
                  value={sport}
                  onChange={e => setSport(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary/50 appearance-none"
                  required
                >
                  <option value="">Select a sport</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Soccer">Soccer</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Volleyball">Volleyball</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button type="submit" disabled={isCreating} className="btn-primary px-8">
                {isCreating ? "Creating..." : "Create Team"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {teams.length === 0 ? (
          <div className="col-span-full glass-card p-12 text-center text-muted flex flex-col items-center">
            <div className="text-5xl mb-4">🛡️</div>
            <h3 className="text-lg font-semibold text-foreground mb-1">No Teams Yet</h3>
            <p className="max-w-md mb-6">Create a team to easily invite your friends to matches together.</p>
            <button onClick={() => setShowCreate(true)} className="btn-secondary">
              Create Team
            </button>
          </div>
        ) : (
          teams.map(team => (
            <Link key={team.id} href={`/teams/${team.id}`} className="glass-card-hover p-6 flex flex-col items-center text-center group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="w-20 h-20 rounded-2xl bg-surface-hover flex items-center justify-center text-3xl font-bold shadow-inner mb-4 group-hover:scale-110 transition-transform">
                {team.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={team.logo} alt={team.name} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  team.name.substring(0, 2).toUpperCase()
                )}
              </div>
              
              <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{team.name}</h3>
              <p className="text-sm font-medium text-muted uppercase tracking-wider mb-4">{team.sport}</p>
              
              <div className="w-full flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                <div className="flex -space-x-2">
                  {team.members.slice(0, 3).map(m => (
                    <div key={m.id} className="w-8 h-8 rounded-full border-2 border-surface bg-surface-hover overflow-hidden flex items-center justify-center text-xs font-bold shadow-sm">
                      {m.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                      ) : (
                        m.name.charAt(0)
                      )}
                    </div>
                  ))}
                  {team.members.length > 3 && (
                    <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-hover flex items-center justify-center text-xs font-bold shadow-sm z-10">
                      +{team.members.length - 3}
                    </div>
                  )}
                </div>
                <span className="text-xs text-muted font-medium bg-surface px-2 py-1 rounded-md">
                  {team.members.length} Members
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
