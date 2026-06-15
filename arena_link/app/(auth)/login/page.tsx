"use client";

import { useActionState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons/SportIcons";
import { loginUser, type LoginState } from "./actions";
import { signIn } from "next-auth/react";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    loginUser,
    initialState
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlMessage = searchParams.get("message");

  useEffect(() => {
    if (state.success) {
      if (state.requiresVerification && state.email) {
        router.push(`/verify-email?email=${encodeURIComponent(state.email)}`);
      } else {
        router.push(searchParams.get("callbackUrl") || "/dashboard");
      }
    }
  }, [state.success, state.requiresVerification, state.email, router, searchParams]);

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          Welcome back
        </h1>
        <p className="text-muted">
          Log in to your ArenaLink account to continue
        </p>
      </div>

      {/* Server-side Error Message */}
      {state.message && !state.success && (
        <div className="mb-4 p-3 rounded-xl bg-[rgba(239,68,68,0.1)] border border-danger/20 text-danger text-sm text-center">
          {state.message}
        </div>
      )}

      {/* URL Success Message */}
      {urlMessage && !state.message && (
        <div className="mb-4 p-3 rounded-xl bg-success/10 border border-success/20 text-success text-sm text-center">
          {urlMessage}
        </div>
      )}

      {/* Google Login */}
      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-border bg-surface hover:bg-surface-hover transition-all duration-200 font-medium text-sm mb-6"
        id="login-google"
      >
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </button>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-3 text-muted-foreground">
            or log in with email
          </span>
        </div>
      </div>

      {/* Login Form */}
      <form action={formAction} className="space-y-4" id="login-form">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1.5">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            className={`input-field ${state.errors?.email ? "border-danger focus:border-danger focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]" : ""}`}
          />
          {state.errors?.email && (
            <p className="text-danger text-xs mt-1.5">
              {state.errors.email[0]}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <span
              className="text-xs text-primary font-medium cursor-pointer hover:underline"
              id="forgot-password-link"
            >
              Forgot password?
            </span>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            required
            className={`input-field ${state.errors?.password ? "border-danger focus:border-danger focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]" : ""}`}
          />
          {state.errors?.password && (
            <p className="text-danger text-xs mt-1.5">
              {state.errors.password[0]}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary w-full py-3.5 text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          id="login-submit"
        >
          {isPending ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Logging in...
            </div>
          ) : (
            <>
              Log In
              <ArrowRightIcon size={18} />
            </>
          )}
        </button>
      </form>

      {/* Signup Link */}
      <p className="text-sm text-muted text-center mt-6">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-primary font-semibold hover:underline"
          id="login-signup-link"
        >
          Sign up for free
        </Link>
      </p>
    </>
  );
}
