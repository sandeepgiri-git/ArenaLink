"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import { getPublicProfile } from "@/lib/actions/user";
import { 
  getFriendshipStatus, 
  sendFriendRequest, 
  acceptFriendRequest, 
  rejectFriendRequest, 
  removeFriend 
} from "@/lib/actions/friend";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const targetUserId = resolvedParams.id;
  const { data: session } = useSession();

  const [profile, setProfile] = useState<any>(null);
  const [friendStatus, setFriendStatus] = useState<any>({ status: "loading" });
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const p = await getPublicProfile(targetUserId);
      if (p) {
        setProfile(p);
        const fStatus = await getFriendshipStatus(targetUserId);
        setFriendStatus(fStatus);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [targetUserId]);

  const handleSendRequest = async () => {
    setActionLoading(true);
    const res = await sendFriendRequest(targetUserId);
    if (res.success) {
      setFriendStatus({ status: "pending", requesterId: session?.user?.id });
    }
    setActionLoading(false);
  };

  const handleAcceptRequest = async () => {
    setActionLoading(true);
    const res = await acceptFriendRequest(friendStatus.friendshipId);
    if (res.success) {
      setFriendStatus({ ...friendStatus, status: "accepted" });
    }
    setActionLoading(false);
  };

  const handleCancelOrReject = async () => {
    setActionLoading(true);
    const res = await rejectFriendRequest(friendStatus.friendshipId);
    if (res.success) {
      setFriendStatus({ status: "none", requesterId: null });
    }
    setActionLoading(false);
  };

  const handleRemoveFriend = async () => {
    if (!confirm("Are you sure you want to remove this friend?")) return;
    setActionLoading(true);
    const res = await removeFriend(friendStatus.friendshipId);
    if (res.success) {
      setFriendStatus({ status: "none", requesterId: null });
    }
    setActionLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20 animate-fade-in-up">
        <h1 className="text-2xl font-bold mb-2">User Not Found</h1>
        <p className="text-muted mb-6">The profile you are looking for does not exist.</p>
        <Link href="/dashboard" className="btn-primary">Return Home</Link>
      </div>
    );
  }

  const isSelf = friendStatus.status === "self";

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      {/* Header Profile Card */}
      <div className="glass-card overflow-hidden">
        <div className="h-24 sm:h-32 bg-gradient-to-r from-primary/40 to-accent/40 w-full relative"></div>
        <div className="px-6 sm:px-10 pb-8 relative">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 sm:-mt-12 mb-4 relative z-10">
            {/* Avatar */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-surface bg-surface overflow-hidden flex items-center justify-center shadow-xl">
              {profile.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-muted-foreground">{profile.name.charAt(0)}</span>
              )}
            </div>

            {/* Friend Actions */}
            {!isSelf && (
              <div className="flex gap-2">
                {friendStatus.status === "none" && (
                  <button onClick={handleSendRequest} disabled={actionLoading} className="btn-primary py-2 px-6 shadow-md">
                    {actionLoading ? "..." : "Add Friend"}
                  </button>
                )}
                
                {friendStatus.status === "pending" && friendStatus.requesterId === session?.user?.id && (
                  <button onClick={handleCancelOrReject} disabled={actionLoading} className="btn-secondary py-2 px-6">
                    {actionLoading ? "..." : "Cancel Request"}
                  </button>
                )}

                {friendStatus.status === "pending" && friendStatus.requesterId !== session?.user?.id && (
                  <div className="flex gap-2">
                    <button onClick={handleAcceptRequest} disabled={actionLoading} className="btn-primary py-2 px-4 shadow-md bg-success border-success text-success-foreground hover:bg-success/90">
                      Accept
                    </button>
                    <button onClick={handleCancelOrReject} disabled={actionLoading} className="btn-secondary py-2 px-4">
                      Decline
                    </button>
                  </div>
                )}

                {friendStatus.status === "accepted" && (
                  <button onClick={handleRemoveFriend} disabled={actionLoading} className="btn-secondary py-2 px-6 border-danger/30 text-danger hover:bg-danger/10">
                    Remove Friend
                  </button>
                )}

                {friendStatus.status === "rejected" && (
                  <button onClick={handleSendRequest} disabled={actionLoading} className="btn-primary py-2 px-6 shadow-md">
                    {actionLoading ? "..." : "Add Friend"}
                  </button>
                )}
              </div>
            )}
            
            {isSelf && (
               <Link href="/profile/edit" className="btn-secondary py-2 px-6">
                 Edit Profile
               </Link>
            )}
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{profile.name}</h1>
            <p className="text-muted font-medium">@{profile.username || "user"}</p>
            {profile.bio && <p className="mt-4 text-sm max-w-lg">{profile.bio}</p>}
          </div>

        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <div className="glass-card p-5 text-center">
          <p className="text-2xl font-bold text-primary">{profile.matchesPlayed}</p>
          <p className="text-xs text-muted mt-1 uppercase font-bold tracking-wider">Matches</p>
        </div>
        <div className="glass-card p-5 text-center">
          <p className="text-2xl font-bold text-warning">
            {profile.rating > 0 ? profile.rating.toFixed(1) : "—"}
          </p>
          <p className="text-xs text-muted mt-1 uppercase font-bold tracking-wider">Rating</p>
        </div>
        <div className="glass-card p-5 text-center">
          <p className="text-2xl font-bold text-success">{profile.reliabilityScore}%</p>
          <p className="text-xs text-muted mt-1 uppercase font-bold tracking-wider">Reliability</p>
        </div>
        <div className="glass-card p-5 text-center">
          <p className="text-2xl font-bold text-accent">
            {profile.sportsInterests?.length || 0}
          </p>
          <p className="text-xs text-muted mt-1 uppercase font-bold tracking-wider">Sports</p>
        </div>
      </div>

      {/* Details */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span>📍</span> Location & Details
          </h2>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-muted">City</span>
              <span className="font-medium">{profile.city || "Not specified"}</span>
            </li>
            <li className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-muted">Skill Level</span>
              <span className="font-medium capitalize">{profile.skillLevel || "Not specified"}</span>
            </li>
            <li className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-muted">Gender</span>
              <span className="font-medium capitalize">{profile.gender || "Not specified"}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted">Age</span>
              <span className="font-medium">{profile.age || "Not specified"}</span>
            </li>
          </ul>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span>⚽</span> Favorite Sports
          </h2>
          {profile.sportsInterests && profile.sportsInterests.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.sportsInterests.map((sport: string) => (
                <span key={sport} className="px-3 py-1 bg-surface-hover border border-border rounded-lg text-sm font-medium">
                  {sport}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No sports listed.</p>
          )}
        </div>
      </div>

    </div>
  );
}
