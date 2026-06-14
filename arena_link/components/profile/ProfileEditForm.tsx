"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  updateUserProfile,
  type ProfileUpdateState,
  type UserProfile,
} from "@/lib/actions/user";

const SPORTS = [
  { id: "football", label: "Football", emoji: "⚽" },
  { id: "cricket", label: "Cricket", emoji: "🏏" },
  { id: "basketball", label: "Basketball", emoji: "🏀" },
  { id: "volleyball", label: "Volleyball", emoji: "🏐" },
  { id: "tennis", label: "Tennis", emoji: "🎾" },
  { id: "badminton", label: "Badminton", emoji: "🏸" },
];

const SKILL_LEVELS = [
  { id: "beginner", label: "Beginner", desc: "Just starting out" },
  { id: "intermediate", label: "Intermediate", desc: "Play regularly" },
  { id: "advanced", label: "Advanced", desc: "Competitive player" },
  { id: "pro", label: "Pro", desc: "Tournament level" },
];

const initialState: ProfileUpdateState = {};

export default function ProfileEditPage({
  profile,
}: {
  profile: UserProfile;
}) {
  const [state, formAction, isPending] = useActionState(
    updateUserProfile,
    initialState
  );
  const router = useRouter();
  const [selectedSports, setSelectedSports] = useState<string[]>(
    profile.sportsInterests
  );
  const [selectedSkill, setSelectedSkill] = useState(
    profile.skillLevel || "beginner"
  );
  const [selectedGender, setSelectedGender] = useState(profile.gender || "");

  useEffect(() => {
    if (state.success) {
      router.push("/profile");
    }
  }, [state.success, router]);

  const toggleSport = (sportId: string) => {
    setSelectedSports((prev) =>
      prev.includes(sportId)
        ? prev.filter((s) => s !== sportId)
        : [...prev, sportId]
    );
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Profile</h1>
          <p className="text-sm text-muted mt-0.5">
            Update your personal info and sports preferences
          </p>
        </div>
        <Link
          href="/profile"
          className="btn-ghost text-sm"
        >
          Cancel
        </Link>
      </div>

      {/* Error Message */}
      {state.message && !state.success && (
        <div className="mb-6 p-3 rounded-xl bg-[rgba(239,68,68,0.1)] border border-danger/20 text-danger text-sm">
          {state.message}
        </div>
      )}

      {/* Success Message */}
      {state.success && (
        <div className="mb-6 p-3 rounded-xl bg-[rgba(34,197,94,0.1)] border border-success/20 text-success text-sm">
          {state.message}
        </div>
      )}

      <form action={formAction} className="space-y-8">
        {/* Hidden fields for multi-select values */}
        <input
          type="hidden"
          name="sportsInterests"
          value={selectedSports.join(",")}
        />
        <input type="hidden" name="skillLevel" value={selectedSkill} />
        <input type="hidden" name="gender" value={selectedGender} />

        {/* Section 1: Basic Info */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm">👤</span>
            Basic Info
          </h2>
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1.5">
                Full Name <span className="text-danger">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                defaultValue={profile.name}
                required
                className={`input-field ${state.errors?.name ? "border-danger" : ""}`}
                placeholder="Your full name"
              />
              {state.errors?.name && (
                <p className="text-danger text-xs mt-1">{state.errors.name[0]}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1.5">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">@</span>
                <input
                  id="username"
                  name="username"
                  type="text"
                  defaultValue={profile.username}
                  className={`input-field pl-8 ${state.errors?.username ? "border-danger" : ""}`}
                  placeholder="your_username"
                />
              </div>
              {state.errors?.username && (
                <p className="text-danger text-xs mt-1">{state.errors.username[0]}</p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium mb-1.5">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                defaultValue={profile.bio}
                className="input-field resize-none"
                placeholder="Tell others about yourself..."
                maxLength={500}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Sports & Skill */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-sm">🏅</span>
            Sports & Skill Level
          </h2>

          {/* Sports Multi-Select */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">
              Sports Interests
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SPORTS.map((sport) => {
                const isSelected = selectedSports.includes(sport.id);
                return (
                  <button
                    key={sport.id}
                    type="button"
                    onClick={() => toggleSport(sport.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                      isSelected
                        ? "bg-primary/10 border-primary text-primary shadow-[0_0_0_1px_var(--primary)]"
                        : "border-border hover:border-primary/30 hover:bg-surface-hover"
                    }`}
                  >
                    <span className="text-lg">{sport.emoji}</span>
                    {sport.label}
                    {isSelected && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-auto"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Skill Level */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Skill Level
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SKILL_LEVELS.map((level) => {
                const isSelected = selectedSkill === level.id;
                return (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => setSelectedSkill(level.id)}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                      isSelected
                        ? "bg-primary/10 border-primary shadow-[0_0_0_1px_var(--primary)]"
                        : "border-border hover:border-primary/30 hover:bg-surface-hover"
                    }`}
                  >
                    <p className={`text-sm font-semibold ${isSelected ? "text-primary" : ""}`}>
                      {level.label}
                    </p>
                    <p className="text-xs text-muted mt-0.5">{level.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 3: Personal Details */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-sm">📋</span>
            Personal Details
          </h2>
          <div className="space-y-4">
            {/* City */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-1.5">
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                defaultValue={profile.city}
                className="input-field"
                placeholder="e.g. Mumbai, Delhi, Bangalore"
              />
            </div>

            {/* Age */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium mb-1.5">
                Age
              </label>
              <input
                id="age"
                name="age"
                type="number"
                min={13}
                max={100}
                defaultValue={profile.age || ""}
                className={`input-field ${state.errors?.age ? "border-danger" : ""}`}
                placeholder="Your age"
              />
              {state.errors?.age && (
                <p className="text-danger text-xs mt-1">{state.errors.age[0]}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Gender
              </label>
              <div className="flex gap-2">
                {[
                  { id: "male", label: "Male" },
                  { id: "female", label: "Female" },
                  { id: "other", label: "Other" },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGender(g.id)}
                    className={`px-5 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 flex-1 ${
                      selectedGender === g.id
                        ? "bg-primary/10 border-primary text-primary shadow-[0_0_0_1px_var(--primary)]"
                        : "border-border hover:border-primary/30 hover:bg-surface-hover"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 justify-end">
          <Link href="/profile" className="btn-ghost text-sm py-2.5 px-5">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="btn-primary text-sm py-2.5 px-8 disabled:opacity-60 disabled:cursor-not-allowed"
            id="save-profile-btn"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Saving...
              </div>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
