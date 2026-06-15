"use client";

import { useEffect, useState } from "react";
import { getFriends, getPendingRequests, acceptFriendRequest, rejectFriendRequest, type FriendDisplay } from "@/lib/actions/friend";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function FriendsPage() {
  const { data: session } = useSession();
  const [friends, setFriends] = useState<FriendDisplay[]>([]);
  const [incoming, setIncoming] = useState<FriendDisplay[]>([]);
  const [outgoing, setOutgoing] = useState<FriendDisplay[]>([]);
  const [activeTab, setActiveTab] = useState<"friends" | "requests">("friends");
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  const fetchData = async () => {
    setIsLoading(true);
    const [friendsRes, pendingRes] = await Promise.all([
      getFriends(),
      getPendingRequests()
    ]);
    
    if (friendsRes.success) setFriends(friendsRes.friends);
    if (pendingRes.success) {
      setIncoming(pendingRes.incoming);
      setOutgoing(pendingRes.outgoing);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAccept = async (friendshipId: string) => {
    setActionLoading(prev => ({ ...prev, [friendshipId]: true }));
    await acceptFriendRequest(friendshipId);
    await fetchData();
    setActionLoading(prev => ({ ...prev, [friendshipId]: false }));
  };

  const handleReject = async (friendshipId: string) => {
    setActionLoading(prev => ({ ...prev, [friendshipId]: true }));
    await rejectFriendRequest(friendshipId);
    await fetchData();
    setActionLoading(prev => ({ ...prev, [friendshipId]: false }));
  };

  if (isLoading && friends.length === 0 && incoming.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p className="text-muted font-medium animate-pulse">Loading friends...</p>
      </div>
    );
  }

  const pendingCount = incoming.length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Friends</h1>
          <p className="text-muted mt-1">Connect with players you've met on ArenaLink.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-surface rounded-2xl border border-border w-fit">
        <button
          onClick={() => setActiveTab("friends")}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
            activeTab === "friends"
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
              : "text-muted hover:text-foreground hover:bg-surface-hover"
          }`}
        >
          My Friends ({friends.length})
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 relative ${
            activeTab === "requests"
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
              : "text-muted hover:text-foreground hover:bg-surface-hover"
          }`}
        >
          Requests
          {pendingCount > 0 && (
             <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-xs rounded-full flex items-center justify-center font-bold">
               {pendingCount}
             </span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-4">
        
        {/* Friends Tab */}
        {activeTab === "friends" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {friends.length === 0 ? (
              <div className="col-span-full glass-card p-12 text-center text-muted">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-lg font-semibold text-foreground mb-1">No friends yet</h3>
                <p>Play matches and add players to your friends list!</p>
                <Link href="/matches" className="btn-primary mt-4 inline-block">Browse Matches</Link>
              </div>
            ) : (
              friends.map(friend => (
                <Link key={friend.id} href={`/profile/${friend.id}`} className="glass-card-hover p-4 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-surface-hover overflow-hidden flex-shrink-0">
                    {friend.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={friend.image} alt={friend.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground bg-surface border border-border">
                        {friend.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold truncate">{friend.name}</h4>
                    <div className="flex gap-3 text-xs text-muted mt-1">
                      <span className="flex items-center gap-1">⭐ {friend.rating > 0 ? friend.rating.toFixed(1) : "—"}</span>
                      <span className="flex items-center gap-1">🛡️ {friend.reliabilityScore}%</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === "requests" && (
          <div className="space-y-8">
            
            {/* Incoming Requests */}
            <div>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                Incoming Requests
                <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">{incoming.length}</span>
              </h2>
              {incoming.length === 0 ? (
                <div className="glass-card p-8 text-center text-muted text-sm">
                  You have no pending friend requests.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {incoming.map(req => (
                    <div key={req.id} className="glass-card p-4 flex items-center gap-4">
                      <Link href={`/profile/${req.id}`} className="w-12 h-12 rounded-full bg-surface-hover overflow-hidden flex-shrink-0">
                        {req.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={req.image} alt={req.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground bg-surface border border-border">
                            {req.name.charAt(0)}
                          </div>
                        )}
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/profile/${req.id}`} className="font-bold truncate hover:underline">{req.name}</Link>
                        <p className="text-xs text-muted mt-0.5">Wants to be friends</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleAccept(req.friendshipId)}
                          disabled={actionLoading[req.friendshipId]}
                          className="w-8 h-8 rounded-full bg-success/10 text-success flex items-center justify-center hover:bg-success hover:text-white transition-colors"
                          title="Accept"
                        >
                          ✓
                        </button>
                        <button 
                          onClick={() => handleReject(req.friendshipId)}
                          disabled={actionLoading[req.friendshipId]}
                          className="w-8 h-8 rounded-full bg-danger/10 text-danger flex items-center justify-center hover:bg-danger hover:text-white transition-colors"
                          title="Decline"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Outgoing Requests */}
            {outgoing.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-4">Outgoing Requests</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {outgoing.map(req => (
                    <div key={req.id} className="glass-card p-3 flex items-center justify-between gap-3 opacity-70">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-surface overflow-hidden flex-shrink-0">
                          {req.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={req.image} alt={req.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-xs">
                              {req.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-sm truncate">{req.name}</span>
                      </div>
                      <button 
                        onClick={() => handleReject(req.friendshipId)}
                        disabled={actionLoading[req.friendshipId]}
                        className="text-xs text-danger hover:underline px-2 py-1"
                      >
                        Cancel
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
