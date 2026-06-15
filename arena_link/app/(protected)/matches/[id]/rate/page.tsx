"use client";

import { useState, useEffect } from "react";
import { getMatchParticipantsToRate, submitReview, type ParticipantDisplay } from "@/lib/actions/review";
import Link from "next/link";
import { use } from "react";

export default function RateMatchPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const matchId = resolvedParams.id;

  const [participants, setParticipants] = useState<ParticipantDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form states per participant
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [attended, setAttended] = useState<Record<string, boolean>>({});
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchParticipants = async () => {
      const res = await getMatchParticipantsToRate(matchId);
      if (res.success) {
        setParticipants(res.participants);
        // Initialize state
        const r: Record<string, number> = {};
        const a: Record<string, boolean> = {};
        res.participants.forEach(p => {
          r[p.id] = 5; // Default 5 stars
          a[p.id] = true; // Default attended
        });
        setRatings(r);
        setAttended(a);
      } else {
        setError(res.message || "Failed to load participants.");
      }
      setIsLoading(false);
    };

    fetchParticipants();
  }, [matchId]);

  const handleSubmit = async (participantId: string) => {
    setSubmitting(prev => ({ ...prev, [participantId]: true }));
    setError("");
    
    const res = await submitReview(
      matchId,
      participantId,
      ratings[participantId],
      attended[participantId],
      feedbacks[participantId]
    );

    if (res.success) {
      setParticipants(prev => prev.map(p => p.id === participantId ? { ...p, hasBeenRated: true } : p));
      
      // Check if all are rated now
      const remaining = participants.filter(p => p.id !== participantId && !p.hasBeenRated).length;
      if (remaining === 0) {
        setSuccess(true);
      }
    } else {
      setError(res.message || "Failed to submit review.");
    }
    
    setSubmitting(prev => ({ ...prev, [participantId]: false }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error && participants.length === 0) {
    return (
      <div className="max-w-2xl mx-auto glass-card p-8 text-center text-danger border-danger/20">
        <p>{error}</p>
        <Link href="/matches/history" className="btn-secondary mt-4">Back to History</Link>
      </div>
    );
  }

  const unratedParticipants = participants.filter(p => !p.hasBeenRated);

  if (success || unratedParticipants.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 animate-fade-in-up">
        <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
          ✓
        </div>
        <h1 className="text-3xl font-bold mb-3">All Done!</h1>
        <p className="text-muted mb-8 text-lg">Thank you for rating your teammates. Your feedback helps keep the ArenaLink community safe and reliable.</p>
        <Link href="/matches/history" className="btn-primary px-8 py-3 text-lg">
          Back to Match History
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Rate Players</h1>
        <p className="text-muted mt-1">Please rate the players from your recent match. Be honest!</p>
      </div>

      {error && (
        <div className="p-4 bg-danger/10 text-danger rounded-xl text-sm border border-danger/20">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {unratedParticipants.map(player => (
          <div key={player.id} className="glass-card p-5 sm:p-6 flex flex-col sm:flex-row gap-6">
            
            {/* Player Info */}
            <div className="flex sm:flex-col items-center sm:w-1/4 sm:border-r border-border sm:pr-6 gap-4 sm:gap-2">
              <div className="w-16 h-16 rounded-full bg-surface border border-border overflow-hidden flex items-center justify-center flex-shrink-0">
                {player.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-bold text-muted-foreground">{player.name.charAt(0)}</span>
                )}
              </div>
              <div className="text-left sm:text-center">
                <h3 className="font-semibold text-lg">{player.name}</h3>
                <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase mt-1 inline-block ${player.role === 'host' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'}`}>
                  {player.role}
                </span>
              </div>
            </div>

            {/* Rating Form */}
            <div className="flex-1 space-y-5">
              
              {/* Attendance Toggle */}
              <div>
                <label className="block text-sm font-semibold mb-2">Did they show up?</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setAttended(prev => ({ ...prev, [player.id]: true }))}
                    className={`flex-1 py-2 px-3 rounded-xl border font-medium text-sm transition-colors ${
                      attended[player.id] 
                        ? "bg-success/10 border-success/30 text-success" 
                        : "bg-surface border-border text-muted hover:border-success/30 hover:text-success"
                    }`}
                  >
                    Yes, they came
                  </button>
                  <button
                    onClick={() => setAttended(prev => ({ ...prev, [player.id]: false }))}
                    className={`flex-1 py-2 px-3 rounded-xl border font-medium text-sm transition-colors ${
                      !attended[player.id] 
                        ? "bg-danger/10 border-danger/30 text-danger" 
                        : "bg-surface border-border text-muted hover:border-danger/30 hover:text-danger"
                    }`}
                  >
                    No Show
                  </button>
                </div>
                {!attended[player.id] && (
                  <p className="text-xs text-danger mt-2 flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    This will severely penalize their Reliability Score.
                  </p>
                )}
              </div>

              {/* Stars (Only if attended) */}
              {attended[player.id] && (
                <div>
                  <label className="block text-sm font-semibold mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRatings(prev => ({ ...prev, [player.id]: star }))}
                        className={`text-3xl transition-transform hover:scale-110 ${
                          star <= (ratings[player.id] || 5) ? "text-warning" : "text-muted/30"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback */}
              <div>
                <label className="block text-sm font-semibold mb-2">Private Feedback (Optional)</label>
                <textarea 
                  placeholder="How was playing with them?"
                  className="w-full bg-surface border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none h-20"
                  value={feedbacks[player.id] || ""}
                  onChange={(e) => setFeedbacks(prev => ({ ...prev, [player.id]: e.target.value }))}
                />
              </div>

              {/* Submit */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => handleSubmit(player.id)}
                  disabled={submitting[player.id]}
                  className="btn-primary py-2 px-6"
                >
                  {submitting[player.id] ? "Submitting..." : "Submit Review"}
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
