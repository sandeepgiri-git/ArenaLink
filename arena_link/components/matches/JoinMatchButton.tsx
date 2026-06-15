"use client";

import { useState } from "react";
import { sendJoinRequest } from "@/lib/actions/joinRequest";

interface JoinMatchButtonProps {
  matchId: string;
  initialStatus: "pending" | "accepted" | "rejected" | null;
  isFull: boolean;
}

export default function JoinMatchButton({ matchId, initialStatus, isFull }: JoinMatchButtonProps) {
  const [status, setStatus] = useState<"pending" | "accepted" | "rejected" | null>(initialStatus);
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleJoin = async () => {
    setIsPending(true);
    setError("");

    const result = await sendJoinRequest(matchId, message);

    if (result.success) {
      setStatus("pending");
    } else {
      setError(result.message || "Failed to send join request.");
    }

    setIsPending(false);
  };

  if (status === "accepted") {
    return (
      <div className="p-4 rounded-xl border border-success/30 bg-success/10 text-success flex items-center justify-center gap-2 font-medium">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        You have joined this match!
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="p-4 rounded-xl border border-warning/30 bg-warning/10 text-warning flex items-center justify-center gap-2 font-medium">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        Join Request Pending Approval
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="p-4 rounded-xl border border-danger/30 bg-danger/10 text-danger flex flex-col items-center justify-center gap-1 font-medium text-center">
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          Request Declined
        </div>
        <span className="text-xs font-normal opacity-80">The host declined your request.</span>
      </div>
    );
  }

  if (isFull) {
    return (
      <div className="p-4 rounded-xl border border-border bg-surface text-muted flex items-center justify-center gap-2 font-medium">
        Match is currently full
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm">
          {error}
        </div>
      )}
      <button
        onClick={handleJoin}
        disabled={isPending}
        className="w-full btn-primary py-3.5 flex justify-center items-center font-semibold text-base shadow-lg shadow-primary/20"
      >
        {isPending ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Sending Request...
          </div>
        ) : (
          "Request to Join Match"
        )}
      </button>
      <p className="text-xs text-center text-muted">
        The host will need to approve your request.
      </p>
    </div>
  );
}
