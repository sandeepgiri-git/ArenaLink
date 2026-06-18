"use client";

import { useState, useEffect, useRef } from "react";
import { sendMessage, getMatchMessages, type MessageDisplay } from "@/lib/actions/chat";
import Link from "next/link";

interface MatchChatProps {
  matchId: string;
  initialMessages: MessageDisplay[];
  currentUserId: string;
  isCompleted?: boolean;
}

export default function MatchChat({ matchId, initialMessages, currentUserId, isCompleted = false }: MatchChatProps) {
  const [messages, setMessages] = useState<MessageDisplay[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Polling for new messages every 3 seconds
  useEffect(() => {
    if (isCompleted) return;

    const intervalId = setInterval(async () => {
      const freshMessages = await getMatchMessages(matchId);
      if (freshMessages.length > messages.length) {
        setMessages(freshMessages);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [matchId, messages.length]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSending(true);
    const textToSend = newMessage.trim();
    setNewMessage(""); // Optimistically clear input

    // Optimistically add message
    const tempMessage: MessageDisplay = {
      id: `temp-${Date.now()}`,
      matchId,
      userId: currentUserId,
      text: textToSend,
      createdAt: new Date().toISOString(),
      user: { name: "You", image: "" }, // Will be replaced on next poll
    };
    
    setMessages((prev) => [...prev, tempMessage]);

    const result = await sendMessage(matchId, textToSend);
    if (!result.success) {
      // Revert if failed
      setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
      setNewMessage(textToSend); // Restore text
      alert(result.message || "Failed to send message.");
    }
    
    setIsSending(false);
  };

  return (
    <div className="glass-card flex flex-col h-[500px]">
      {/* Header */}
      <div className="p-4 border-b border-border bg-surface/50 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
        <h3 className="font-semibold text-foreground">Match Group Chat</h3>
        <span className="text-xs text-muted ml-auto">Messages auto-delete 1 day after match</span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-2 opacity-50">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <p>No messages yet.</p>
            <p className="text-sm">Say hi to your team!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.userId === currentUserId;
            
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-2 max-w-[80%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                  {!isMe && (
                    <Link href={`/profile/${msg.userId}`} className="w-8 h-8 rounded-full bg-surface-hover border border-border flex-shrink-0 flex items-center justify-center overflow-hidden mt-auto">
                      {msg.user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={msg.user.image} alt={msg.user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold text-muted">{msg.user.name.charAt(0).toUpperCase()}</span>
                      )}
                    </Link>
                  )}
                  
                  <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                    {!isMe && (
                      <span className="text-[10px] text-muted ml-1 mb-0.5">{msg.user.name}</span>
                    )}
                    <div 
                      className={`px-4 py-2.5 rounded-2xl ${
                        isMe 
                          ? "bg-primary text-primary-foreground rounded-br-sm" 
                          : "bg-surface border border-border text-foreground rounded-bl-sm"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                    </div>
                    <span className="text-[10px] text-muted mt-0.5 mx-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-surface/50">
        {isCompleted ? (
          <div className="text-center p-3 rounded-lg bg-surface border border-border text-muted text-sm">
            Chat is paused because the match is completed.
          </div>
        ) : (
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="input-field flex-1 !py-2.5"
              maxLength={1000}
              disabled={isSending}
            />
            <button 
              type="submit" 
              disabled={!newMessage.trim() || isSending}
              className="btn-primary px-5 py-2.5 flex items-center justify-center disabled:opacity-50 transition-all active:scale-95"
              title="Send Message"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
