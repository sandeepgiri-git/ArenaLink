"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOTP, generateAndSendOTP } from "@/lib/actions/verification";
import { signIn } from "next-auth/react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    if (!email) {
      router.push("/login");
    }
  }, [email, router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || otp.length !== 6) return;

    setIsVerifying(true);
    setError("");

    const res = await verifyOTP(email, otp);

    if (res.success) {
      // Direct them to login page so they can login cleanly with the verified account
      // Or auto-login. NextAuth credentials provider doesn't easily let us auto-login here without password.
      // So we redirect them to login with a success message.
      router.push("/login?message=" + encodeURIComponent("Email verified! You can now log in."));
    } else {
      setError(res.message);
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    setResendMessage("");
    setError("");

    const res = await generateAndSendOTP(email, "Player");
    if (res.success) {
      setResendMessage("A new code has been sent to your email.");
    } else {
      setError("Failed to resend code.");
    }
    setIsResending(false);
  };

  if (!email) return null;

  return (
    <>
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          Verify your email
        </h1>
        <p className="text-muted text-sm sm:text-base">
          We sent a 6-digit code to <span className="font-semibold text-foreground">{email}</span>.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-[rgba(239,68,68,0.1)] border border-danger/20 text-danger text-sm text-center">
          {error}
        </div>
      )}

      {resendMessage && (
        <div className="mb-4 p-3 rounded-xl bg-success/10 border border-success/20 text-success text-sm text-center">
          {resendMessage}
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-6">
        <div>
          <label htmlFor="otp" className="block text-sm font-medium mb-1.5 text-center">
            Enter 6-digit Code
          </label>
          <input
            id="otp"
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="000000"
            className="input-field text-center text-3xl tracking-[0.5em] font-mono h-16 placeholder:tracking-normal placeholder:text-muted/30"
            required
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={isVerifying || otp.length !== 6}
          className="btn-primary w-full py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isVerifying ? "Verifying..." : "Verify Email"}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted">
          Didn't receive the code?{" "}
          <button 
            onClick={handleResend}
            disabled={isResending}
            className="text-primary font-semibold hover:underline disabled:opacity-50"
          >
            {isResending ? "Sending..." : "Click to resend"}
          </button>
        </p>
      </div>
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8"><div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
