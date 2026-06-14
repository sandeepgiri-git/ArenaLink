"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons/SportIcons";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    // TODO: Integrate with Auth.js / NextAuth v5
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          Create your account
        </h1>
        <p className="text-muted">
          Join ArenaLink and start finding matches near you
        </p>
      </div>

      {/* Google Sign Up */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-border bg-surface hover:bg-surface-hover transition-all duration-200 font-medium text-sm mb-6"
        id="signup-google"
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
            or sign up with email
          </span>
        </div>
      </div>

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-4" id="signup-form">
        {/* Full Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium mb-1.5"
          >
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Sandeep Giri"
            value={formData.name}
            onChange={handleChange}
            className={`input-field ${errors.name ? "border-danger focus:border-danger focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]" : ""}`}
          />
          {errors.name && (
            <p className="text-danger text-xs mt-1.5">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-1.5"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            className={`input-field ${errors.email ? "border-danger focus:border-danger focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]" : ""}`}
          />
          {errors.email && (
            <p className="text-danger text-xs mt-1.5">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-1.5"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={formData.password}
            onChange={handleChange}
            className={`input-field ${errors.password ? "border-danger focus:border-danger focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]" : ""}`}
          />
          {errors.password && (
            <p className="text-danger text-xs mt-1.5">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium mb-1.5"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`input-field ${errors.confirmPassword ? "border-danger focus:border-danger focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]" : ""}`}
          />
          {errors.confirmPassword && (
            <p className="text-danger text-xs mt-1.5">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-3.5 text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          id="signup-submit"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Creating account...
            </div>
          ) : (
            <>
              Create Account
              <ArrowRightIcon size={18} />
            </>
          )}
        </button>
      </form>

      {/* Terms */}
      <p className="text-xs text-muted-foreground text-center mt-4 leading-relaxed">
        By signing up, you agree to our{" "}
        <span className="text-foreground underline cursor-pointer">
          Terms of Service
        </span>{" "}
        and{" "}
        <span className="text-foreground underline cursor-pointer">
          Privacy Policy
        </span>
      </p>

      {/* Login Link */}
      <p className="text-sm text-muted text-center mt-6">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary font-semibold hover:underline"
          id="signup-login-link"
        >
          Log in
        </Link>
      </p>
    </>
  );
}
