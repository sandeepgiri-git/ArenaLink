"use client";

import { useState } from "react";
import { updateJoinRequestStatus, type JoinRequestDisplay } from "@/lib/actions/joinRequest";
import Link from "next/link";

export default function HostRequestManager({
  matchId,
  initialRequests,
}: {
  matchId: string;
  initialRequests: JoinRequestDisplay[];
}) {
  const [requests, setRequests] = useState<JoinRequestDisplay[]>(initialRequests);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleUpdate = async (requestId: string, status: "accepted" | "rejected") => {
    setProcessingId(requestId);
    const result = await updateJoinRequestStatus(requestId, status);
    
    if (result.success) {
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } else {
      alert(result.message || "Failed to update request.");
    }
    setProcessingId(null);
  };

  if (requests.length === 0) {
    return (
      <div className="glass-panel p-10 text-center rounded-xl">
        <div className="w-12 h-12 rounded-full bg-surface-bright flex items-center justify-center mx-auto mb-3 text-on-surface-variant">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <line x1="19" y1="8" x2="19" y2="14"></line>
            <line x1="22" y1="11" x2="16" y2="11"></line>
          </svg>
        </div>
        <h3 className="font-semibold text-on-surface">No Pending Requests</h3>
        <p className="text-sm text-on-surface-variant mt-1">When players request to join, they will appear here.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel overflow-hidden rounded-xl">
      <div className="p-4 border-b border-outline-variant/30 bg-surface-container-low/50">
        <h3 className="font-semibold flex items-center gap-2 text-on-surface">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          Pending Requests ({requests.length})
        </h3>
      </div>
      <div className="divide-y divide-outline-variant/30">
        {requests.map((request) => (
          <div key={request.id} className="p-4 flex flex-col gap-4 hover:bg-surface-bright/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-container border border-outline-variant/30 overflow-hidden flex-shrink-0 flex items-center justify-center">
                {request.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={request.user.image} alt={request.user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-on-surface-variant text-sm">{request.user.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div>
                <Link href={`/profile/${request.userId}`} className="font-medium text-on-surface hover:text-primary transition-colors">
                  {request.user.name}
                </Link>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-0.5">
                  <span className="flex items-center gap-1 text-secondary">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    {request.user.rating.toFixed(1)}
                  </span>
                  <span>•</span>
                  <span>Requested {new Date(request.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            {request.message && (
              <p className="text-sm text-on-surface-variant italic bg-surface-container p-2 rounded-lg break-words border border-outline-variant/20">
                "{request.message}"
              </p>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleUpdate(request.id, "rejected")}
                disabled={processingId !== null}
                className="flex-1 bg-transparent border border-outline-variant text-on-surface rounded-xl hover:bg-error-container/20 hover:text-error hover:border-error/20 transition-all text-sm py-2 px-4 disabled:opacity-50"
              >
                Decline
              </button>
              <button
                onClick={() => handleUpdate(request.id, "accepted")}
                disabled={processingId !== null}
                className="flex-1 bg-primary-container text-white font-label-md rounded-xl hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all text-sm py-2 px-4 disabled:opacity-50"
              >
                {processingId === request.id ? "Processing..." : "Accept"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
