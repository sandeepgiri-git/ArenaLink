"use client";

import { useActionState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser, type SignupState } from "./actions";
import { signIn } from "next-auth/react";

const initialState: SignupState = {};

function SignupForm() {
  const [state, formAction, isPending] = useActionState(registerUser, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      if (state.requiresVerification && state.email) {
        router.push(`/verify-email?email=${encodeURIComponent(state.email)}`);
      } else {
        router.push("/dashboard");
      }
    }
  }, [state.success, state.requiresVerification, state.email, router]);

  return (
    <>
      <div className="mb-8">
        <h2 className="font-headline-lg text-headline-lg mb-2 uppercase">Claim Your Territory</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Join ArenaLink and start finding matches near you.</p>
      </div>
      
      {state.message && !state.success && (
        <div className="mb-6 p-4 rounded-xl bg-error-container/20 border border-error/20 text-error text-sm text-center">
          {state.message}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div className="space-y-2 group relative">
          <label htmlFor="name" className="font-label-md text-label-md text-on-surface-variant ml-1 group-focus-within:text-primary transition-colors uppercase">Athlete Name</label>
          <div className="relative">
            <input 
              id="name"
              name="name"
              type="text" 
              required
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-6 py-4 text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.4)] transition-all placeholder:text-outline/50" 
              placeholder="e.g. John Doe" 
            />
          </div>
          {state.errors?.name && (
            <p className="text-error text-xs ml-1">{state.errors.name[0]}</p>
          )}
        </div>

        <div className="space-y-2 group relative">
          <label htmlFor="email" className="font-label-md text-label-md text-on-surface-variant ml-1 group-focus-within:text-primary transition-colors uppercase">Athlete Email</label>
          <div className="relative">
            <input 
              id="email"
              name="email"
              type="email" 
              required
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-6 py-4 text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.4)] transition-all placeholder:text-outline/50" 
              placeholder="name@arenamail.com" 
            />
          </div>
          {state.errors?.email && (
            <p className="text-error text-xs ml-1">{state.errors.email[0]}</p>
          )}
        </div>
        
        <div className="space-y-2 group relative">
          <label htmlFor="password" className="font-label-md text-label-md text-on-surface-variant ml-1 group-focus-within:text-primary transition-colors uppercase">Security Key (Password)</label>
          <div className="relative">
            <input 
              id="password"
              name="password"
              type="password" 
              required
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-6 py-4 text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.4)] transition-all placeholder:text-outline/50" 
              placeholder="At least 8 characters" 
            />
          </div>
          {state.errors?.password && (
            <p className="text-error text-xs ml-1">{state.errors.password[0]}</p>
          )}
        </div>

        <div className="space-y-2 group relative">
          <label htmlFor="confirmPassword" className="font-label-md text-label-md text-on-surface-variant ml-1 group-focus-within:text-primary transition-colors uppercase">Confirm Security Key</label>
          <div className="relative">
            <input 
              id="confirmPassword"
              name="confirmPassword"
              type="password" 
              required
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-6 py-4 text-on-surface focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.4)] transition-all placeholder:text-outline/50" 
              placeholder="Re-enter password" 
            />
          </div>
          {state.errors?.confirmPassword && (
            <p className="text-error text-xs ml-1">{state.errors.confirmPassword[0]}</p>
          )}
        </div>
        
        <div className="pt-2">
          <button 
            type="submit" 
            disabled={isPending}
            className="w-full flex items-center justify-center bg-secondary text-on-secondary font-headline-md text-headline-md py-4 rounded-xl uppercase tracking-widest hover:shadow-[0_0_20px_rgba(78,222,163,0.3)] transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            {isPending ? (
              <>
                <div className="w-5 h-5 border-2 border-on-secondary/30 border-t-on-secondary rounded-full animate-spin mr-3" />
                REGISTERING...
              </>
            ) : (
              "JOIN ARENALINK"
            )}
          </button>
        </div>
        
        <div className="relative py-6 flex items-center">
          <div className="flex-grow border-t border-outline-variant/20"></div>
          <span className="flex-shrink mx-4 text-outline font-label-sm uppercase tracking-tighter">OR CONNECT WITH</span>
          <div className="flex-grow border-t border-outline-variant/20"></div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <button 
            type="button" 
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="flex items-center justify-center space-x-3 w-full bg-surface border border-outline-variant/30 rounded-xl px-6 py-4 text-on-surface hover:bg-surface-bright transition-all active:scale-95"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M12 5.04c1.74 0 3.3.6 4.53 1.77l3.39-3.39C17.85 1.41 15.15 0 12 0 7.31 0 3.25 2.69 1.24 6.61l3.96 3.07C6.15 7.15 8.87 5.04 12 5.04z" fill="#EA4335"></path>
              <path d="M22.76 12.23c0-.79-.07-1.55-.2-2.3H12v4.35h6.03c-.26 1.38-1.04 2.55-2.21 3.33l3.44 2.67c2.01-1.85 3.5-4.58 3.5-8.05z" fill="#FBBC05"></path>
              <path d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.44-2.67c-1.09.73-2.48 1.16-4.51 1.16-3.13 0-5.85-2.11-6.8-4.96l-3.98 3.09C3.25 21.31 7.31 24 12 24z" fill="#34A853"></path>
              <path d="M5.2 14.62c-.24-.73-.38-1.51-.38-2.31s.14-1.58.38-2.31L1.24 6.61C.45 8.21 0 10.05 0 12s.45 3.79 1.24 5.39l3.96-3.07z" fill="#4285F4"></path>
            </svg>
            <span className="font-label-md text-label-md uppercase">Sign up with Google</span>
          </button>
        </div>
      </form>
      
      <div className="mt-8 text-center">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Already have an account? <Link href="/login" className="text-primary font-bold hover:underline uppercase">Log In</Link>
        </p>
      </div>
    </>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8"><div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div></div>}>
      <SignupForm />
    </Suspense>
  );
}
