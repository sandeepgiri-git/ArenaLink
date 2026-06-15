"use client";

import { useState, useEffect } from "react";
import { getHostedOpenMatches, inviteUserToMatch, type MatchDisplayData } from "@/lib/actions/match";

type InviteToMatchModalProps = {
  targetUserId: string;
  targetUserName: string;
  onClose: () => void;
};

export default function InviteToMatchModal({ targetUserId, targetUserName, onClose }: InviteToMatchModalProps) {
  const [matches, setMatches] = useState<MatchDisplayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [invitingMatchId, setInvitingMatchId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error", message: string } | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      const data = await getHostedOpenMatches();
      setMatches(data);
      setIsLoading(false);
    };
    fetchMatches();
  }, []);

  const handleInvite = async (matchId: string) => {
    setInvitingMatchId(matchId);
    setFeedback(null);
    const res = await inviteUserToMatch(matchId, targetUserId);
    setFeedback({ type: res.success ? "success" : "error", message: res.message });
    setInvitingMatchId(null);
    
    if (res.success) {
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-foreground transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h2 className="text-xl font-bold mb-2">Invite {targetUserName} to a Match</h2>
        <p className="text-muted text-sm mb-6">Select one of your upcoming matches to send an invite.</p>

        {feedback && (
          <div className={`p-3 rounded-xl text-sm font-medium mb-4 ${
            feedback.type === "success" ? "bg-success/10 text-success border border-success/20" : "bg-danger/10 text-danger border border-danger/20"
          }`}>
            {feedback.message}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-8 bg-surface-hover rounded-xl border border-border">
            <p className="text-muted text-sm">You aren't hosting any upcoming open matches.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {matches.map((match) => (
              <div key={match.id} className="flex items-center justify-between p-3 rounded-xl border border-border bg-background hover:border-primary/50 transition-colors">
                <div>
                  <h3 className="font-semibold text-sm">{match.title}</h3>
                  <p className="text-xs text-muted">
                    {new Date(match.date).toLocaleDateString()} • {match.sport}
                  </p>
                </div>
                <button
                  onClick={() => handleInvite(match.id)}
                  disabled={invitingMatchId === match.id}
                  className="btn-primary text-xs py-1.5 px-3"
                >
                  {invitingMatchId === match.id ? "Sending..." : "Invite"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
