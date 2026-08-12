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
  const [error, setError] = useState("");

  const handleJoin = async () => {
    setIsPending(true);
    setError("");

    const result = await sendJoinRequest(matchId, "");

    if (result.success) {
      setStatus("pending");
    } else {
      setError(result.message || "Failed to send join request.");
    }

    setIsPending(false);
  };

  const getButtonContent = () => {
    if (status === "accepted") {
      return (
        <button disabled className="w-full md:w-auto md:min-w-[320px] bg-secondary-container text-on-secondary-container font-headline-lg text-headline-lg py-5 px-12 rounded-xl uppercase tracking-tight shadow-[0_4px_20px_rgba(0,165,114,0.4)] flex items-center justify-center gap-4">
          <span className="material-symbols-outlined font-bold">check_circle</span>
          <span className="relative z-10">MATCH JOINED</span>
        </button>
      );
    }
    
    if (status === "pending") {
      return (
        <button disabled className="w-full md:w-auto md:min-w-[320px] bg-surface-container-high text-warning font-headline-lg text-headline-lg py-5 px-12 rounded-xl uppercase tracking-tight border border-warning/30 flex items-center justify-center gap-4">
          <span className="material-symbols-outlined font-bold animate-pulse">hourglass_empty</span>
          <span className="relative z-10">REQUEST PENDING</span>
        </button>
      );
    }

    if (status === "rejected") {
      return (
        <button disabled className="w-full md:w-auto md:min-w-[320px] bg-error-container/20 text-error font-headline-lg text-headline-lg py-5 px-12 rounded-xl uppercase tracking-tight border border-error/30 flex items-center justify-center gap-4">
          <span className="material-symbols-outlined font-bold">block</span>
          <span className="relative z-10">REQUEST DECLINED</span>
        </button>
      );
    }

    if (isFull) {
      return (
        <button disabled className="w-full md:w-auto md:min-w-[320px] bg-surface-container-highest text-outline font-headline-lg text-headline-lg py-5 px-12 rounded-xl uppercase tracking-tight flex items-center justify-center gap-4">
          <span className="material-symbols-outlined font-bold">group_off</span>
          <span className="relative z-10">MATCH IS FULL</span>
        </button>
      );
    }

    return (
      <button 
        onClick={handleJoin}
        disabled={isPending}
        className="w-full md:w-auto md:min-w-[320px] bg-primary text-on-primary font-headline-lg text-headline-lg py-5 px-12 rounded-xl uppercase tracking-tight shadow-[0_4px_20px_rgba(124,58,237,0.4)] hover:shadow-[0_4px_30px_rgba(124,58,237,0.6)] hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-4 overflow-hidden relative group"
      >
        {isPending ? (
          <>
            <span className="material-symbols-outlined animate-spin font-bold">sync</span>
            <span className="relative z-10">RESERVING SPOT...</span>
          </>
        ) : (
          <>
            <span className="relative z-10">JOIN MATCH NOW</span>
            <span className="material-symbols-outlined relative z-10 font-bold">bolt</span>
            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
          </>
        )}
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-surface-dim/95 backdrop-blur-2xl border-t border-primary/20 px-4 py-6 md:py-8 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4">
        {error && <div className="text-error font-label-sm absolute -top-8 bg-error-container/20 px-4 py-1 rounded-full">{error}</div>}
        {getButtonContent()}
      </div>
    </div>
  );
}
