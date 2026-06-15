"use client";

import { useEffect, useState, use } from "react";
import { getTeamById, removeMemberFromTeam, addMemberToTeam, type TeamDisplay } from "@/lib/actions/team";
import { getFriends, type FriendDisplay } from "@/lib/actions/friend";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function TeamDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const teamId = resolvedParams.id;
  const { data: session } = useSession();

  const [team, setTeam] = useState<TeamDisplay | null>(null);
  const [friends, setFriends] = useState<FriendDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  // UI states
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  const fetchData = async () => {
    setIsLoading(true);
    const [teamRes, friendsRes] = await Promise.all([
      getTeamById(teamId),
      getFriends()
    ]);

    if (teamRes.success && teamRes.team) {
      setTeam(teamRes.team);
    } else {
      setError(teamRes.message || "Failed to load team");
    }

    if (friendsRes.success) {
      setFriends(friendsRes.friends);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  const handleInvite = async (friendId: string) => {
    setActionLoading(prev => ({ ...prev, [friendId]: true }));
    const res = await addMemberToTeam(teamId, friendId);
    if (res.success) {
      await fetchData(); // Refresh to show new member
    } else {
      alert(res.message);
    }
    setActionLoading(prev => ({ ...prev, [friendId]: false }));
  };

  const handleRemove = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    
    setActionLoading(prev => ({ ...prev, [memberId]: true }));
    const res = await removeMemberFromTeam(teamId, memberId);
    if (res.success) {
      await fetchData();
    } else {
      alert(res.message);
    }
    setActionLoading(prev => ({ ...prev, [memberId]: false }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="text-center py-20 animate-fade-in-up">
        <h1 className="text-2xl font-bold mb-2">Team Not Found</h1>
        <p className="text-muted mb-6">{error}</p>
        <Link href="/teams" className="btn-primary">Return to Teams</Link>
      </div>
    );
  }

  const isCaptain = team.captain.id === session?.user?.id;

  // Filter friends who are NOT already in the team
  const availableFriendsToInvite = friends.filter(
    f => !team.members.some(m => m.id === f.id)
  );

  return (
    <div className="max-w-5xl mx-auto animate-fade-in-up pb-20">
      
      {/* Header */}
      <div className="glass-card overflow-hidden mb-8">
        <div className="h-24 bg-gradient-to-r from-primary/30 to-accent/30 w-full"></div>
        <div className="px-6 pb-6 relative -mt-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex items-end gap-5">
            <div className="w-24 h-24 rounded-2xl bg-surface border-4 border-surface overflow-hidden flex items-center justify-center shadow-lg text-4xl font-bold">
              {team.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
              ) : (
                team.name.substring(0, 2).toUpperCase()
              )}
            </div>
            <div className="mb-1">
              <h1 className="text-3xl font-bold">{team.name}</h1>
              <p className="text-primary font-medium flex items-center gap-2">
                <span className="uppercase text-xs tracking-wider">{team.sport}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                <span className="text-muted text-sm">{team.members.length} Members</span>
              </p>
            </div>
          </div>
          
          {isCaptain ? (
            <button 
              onClick={() => setShowInviteModal(true)}
              className="btn-primary px-6 shadow-md shadow-primary/20"
            >
              + Invite Friends
            </button>
          ) : (
            <button 
              onClick={() => handleRemove(session?.user?.id || "")}
              className="btn-secondary border-danger/30 text-danger hover:bg-danger/10"
            >
              Leave Team
            </button>
          )}
        </div>
      </div>

      {/* Roster */}
      <div>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span>📋</span> Team Roster
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.members.map(member => {
            const isMemberCaptain = member.id === team.captain.id;
            const isSelf = member.id === session?.user?.id;

            return (
              <div key={member.id} className="glass-card p-4 flex items-center gap-4 relative">
                <Link href={`/profile/${member.id}`} className="w-14 h-14 rounded-full bg-surface-hover overflow-hidden flex-shrink-0 border border-border">
                  {member.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground text-lg">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </Link>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link href={`/profile/${member.id}`} className="font-bold truncate hover:underline text-foreground">
                      {member.name}
                    </Link>
                    {isMemberCaptain && (
                      <span className="bg-warning/20 text-warning text-[10px] uppercase font-bold px-1.5 py-0.5 rounded" title="Team Captain">
                        CAPT
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted mt-1">
                    <span>⭐ {member.rating > 0 ? member.rating.toFixed(1) : "—"}</span>
                    <span>🛡️ {member.reliabilityScore}%</span>
                  </div>
                </div>

                {isCaptain && !isMemberCaptain && (
                  <button 
                    onClick={() => handleRemove(member.id)}
                    disabled={actionLoading[member.id]}
                    className="w-8 h-8 rounded-full bg-danger/10 text-danger flex items-center justify-center hover:bg-danger hover:text-white transition-colors"
                    title="Remove from team"
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Invite Modal Overlay */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowInviteModal(false)}></div>
          
          {/* Modal */}
          <div className="glass-card relative z-10 w-full max-w-md p-6 max-h-[80vh] flex flex-col">
            <button 
              onClick={() => setShowInviteModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-surface-hover text-muted hover:text-foreground"
            >
              ✕
            </button>
            
            <h2 className="text-xl font-bold mb-2">Invite Friends</h2>
            <p className="text-sm text-muted mb-6">Select friends to add to {team.name}</p>

            <div className="overflow-y-auto pr-2 space-y-2 flex-1">
              {availableFriendsToInvite.length === 0 ? (
                <div className="text-center py-8 text-muted">
                  <p>All your friends are already in this team!</p>
                  <p className="text-sm mt-2">Add more friends to invite them.</p>
                </div>
              ) : (
                availableFriendsToInvite.map(friend => (
                  <div key={friend.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-hover transition-colors border border-transparent hover:border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface border border-border overflow-hidden">
                        {friend.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={friend.image} alt={friend.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-xs">
                            {friend.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className="font-semibold">{friend.name}</span>
                    </div>
                    <button 
                      onClick={() => handleInvite(friend.id)}
                      disabled={actionLoading[friend.id]}
                      className="btn-primary py-1.5 px-4 text-xs"
                    >
                      {actionLoading[friend.id] ? "..." : "Add"}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
