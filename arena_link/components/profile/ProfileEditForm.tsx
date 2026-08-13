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
  { id: "football", label: "Football", icon: "sports_soccer" },
  { id: "cricket", label: "Cricket", icon: "sports_cricket" },
  { id: "basketball", label: "Basketball", icon: "sports_basketball" },
  { id: "volleyball", label: "Volleyball", icon: "sports_volleyball" },
  { id: "tennis", label: "Tennis", icon: "sports_tennis" },
  { id: "badminton", label: "Badminton", icon: "sports_tennis" },
];

const SKILL_LEVELS = [
  { id: "beginner", label: "Beginner", desc: "Just starting out" },
  { id: "intermediate", label: "Intermediate", desc: "Play regularly" },
  { id: "advanced", label: "Advanced", desc: "Competitive player" },
  { id: "pro", label: "Pro", desc: "Tournament level" },
];

const initialState: ProfileUpdateState = {};

export default function ProfileEditForm({
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
    <div className="max-w-3xl mx-auto animate-fade-in-up pb-8 mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Edit Profile
          </h1>
          <p className="text-on-surface-variant font-body-sm mt-1">
            Update your personal info and sports preferences
          </p>
        </div>
        <Link href="/profile" className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:bg-surface-bright hover:text-primary transition-colors">
          <span className="material-symbols-outlined">close</span>
        </Link>
      </div>

      {/* Error Message */}
      {state.message && !state.success && (
        <div className="mb-6 p-4 rounded-2xl bg-error/10 border border-error/30 text-error flex items-start gap-3 animate-fade-in-up">
          <span className="material-symbols-outlined">error</span>
          <p className="font-label-md mt-0.5">{state.message}</p>
        </div>
      )}

      {/* Success Message */}
      {state.success && (
        <div className="mb-6 p-4 rounded-2xl bg-secondary/10 border border-secondary/30 text-secondary flex items-start gap-3 animate-fade-in-up">
          <span className="material-symbols-outlined">check_circle</span>
          <p className="font-label-md mt-0.5">{state.message}</p>
        </div>
      )}

      <form action={formAction} className="space-y-6">
        {/* Hidden fields for multi-select values */}
        <input type="hidden" name="sportsInterests" value={selectedSports.join(",")} />
        <input type="hidden" name="skillLevel" value={selectedSkill} />
        <input type="hidden" name="gender" value={selectedGender} />

        {/* Section 1: Basic Info */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none transition-all duration-700 group-hover:bg-primary/10"></div>
          
          <h2 className="font-headline-md text-primary mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined p-2 bg-primary/10 rounded-xl">person</span>
            Basic Info
          </h2>
          
          <div className="space-y-6 relative z-10">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block font-label-md text-on-surface-variant mb-2">
                Full Name <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline-variant pointer-events-none">badge</span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  defaultValue={profile.name}
                  required
                  className={`w-full bg-surface-container-lowest/50 border ${state.errors?.name ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary focus:ring-primary/20"} rounded-xl pl-12 pr-4 py-4 text-on-surface focus:outline-none focus:ring-4 transition-all placeholder:text-outline-variant`}
                  placeholder="Your full name"
                />
              </div>
              {state.errors?.name && (
                <p className="text-error text-xs mt-2 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span> {state.errors.name[0]}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block font-label-md text-on-surface-variant mb-2">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline-variant pointer-events-none">alternate_email</span>
                <input
                  id="username"
                  name="username"
                  type="text"
                  defaultValue={profile.username}
                  className={`w-full bg-surface-container-lowest/50 border ${state.errors?.username ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary focus:ring-primary/20"} rounded-xl pl-12 pr-4 py-4 text-on-surface focus:outline-none focus:ring-4 transition-all placeholder:text-outline-variant`}
                  placeholder="your_username"
                />
              </div>
              {state.errors?.username && (
                <p className="text-error text-xs mt-2 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span> {state.errors.username[0]}</p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block font-label-md text-on-surface-variant mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                defaultValue={profile.bio}
                className="w-full bg-surface-container-lowest/50 border border-outline-variant/30 focus:border-primary focus:ring-primary/20 rounded-xl px-5 py-4 text-on-surface focus:outline-none focus:ring-4 transition-all placeholder:text-outline-variant resize-none"
                placeholder="Tell others about yourself..."
                maxLength={500}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Personal Details */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-tertiary/5 rounded-full blur-3xl pointer-events-none transition-all duration-700 group-hover:bg-tertiary/10"></div>
          
          <h2 className="font-headline-md text-tertiary mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined p-2 bg-tertiary/10 rounded-xl">manage_accounts</span>
            Personal Details
          </h2>
          
          <div className="space-y-6 relative z-10">
            <div className="grid sm:grid-cols-2 gap-6">
              {/* City */}
              <div>
                <label htmlFor="city" className="block font-label-md text-on-surface-variant mb-2">
                  City
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline-variant pointer-events-none">location_city</span>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    defaultValue={profile.city}
                    className="w-full bg-surface-container-lowest/50 border border-outline-variant/30 focus:border-tertiary focus:ring-tertiary/20 rounded-xl pl-12 pr-4 py-4 text-on-surface focus:outline-none focus:ring-4 transition-all placeholder:text-outline-variant"
                    placeholder="e.g. Mumbai, Delhi"
                  />
                </div>
              </div>

              {/* Age */}
              <div>
                <label htmlFor="age" className="block font-label-md text-on-surface-variant mb-2">
                  Age
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline-variant pointer-events-none">cake</span>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    min={13}
                    max={100}
                    defaultValue={profile.age || ""}
                    className={`w-full bg-surface-container-lowest/50 border ${state.errors?.age ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-tertiary focus:ring-tertiary/20"} rounded-xl pl-12 pr-4 py-4 text-on-surface focus:outline-none focus:ring-4 transition-all placeholder:text-outline-variant`}
                    placeholder="Your age"
                  />
                </div>
                {state.errors?.age && (
                  <p className="text-error text-xs mt-2 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span> {state.errors.age[0]}</p>
                )}
              </div>
            </div>

            {/* Gender */}
            <div className="pt-2">
              <label className="block font-label-md text-on-surface-variant mb-3">
                Gender
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "male", label: "Male", icon: "male" },
                  { id: "female", label: "Female", icon: "female" },
                  { id: "other", label: "Other", icon: "agender" },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGender(g.id)}
                    className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
                      selectedGender === g.id
                        ? "bg-tertiary/15 border border-tertiary text-tertiary shadow-[0_0_15px_rgba(200,26,66,0.15)] -translate-y-1"
                        : "bg-surface-container-high/50 border border-outline-variant/20 text-on-surface hover:bg-surface-bright hover:-translate-y-1"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[24px]">{g.icon}</span>
                    <span className="font-label-md">{g.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Sports & Skill */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none transition-all duration-700 group-hover:bg-secondary/10"></div>
          
          <h2 className="font-headline-md text-secondary mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined p-2 bg-secondary/10 rounded-xl">sports_baseball</span>
            Sports & Skill Level
          </h2>

          <div className="space-y-8 relative z-10">
            {/* Sports Multi-Select */}
            <div>
              <label className="block font-label-md text-on-surface-variant mb-3">
                Sports Interests
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SPORTS.map((sport) => {
                  const isSelected = selectedSports.includes(sport.id);
                  return (
                    <button
                      key={sport.id}
                      type="button"
                      onClick={() => toggleSport(sport.id)}
                      className={`relative p-4 rounded-2xl flex items-center gap-3 transition-all duration-300 overflow-hidden ${
                        isSelected
                          ? "bg-secondary/15 border border-secondary text-secondary-fixed shadow-[0_0_20px_rgba(78,222,163,0.15)] -translate-y-1"
                          : "bg-surface-container-high/50 border border-outline-variant/20 text-on-surface-variant hover:bg-surface-bright hover:text-on-surface hover:-translate-y-1"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-50"></div>
                      )}
                      <span className={`material-symbols-outlined text-[24px] relative z-10 transition-transform ${isSelected ? 'scale-110' : ''}`} style={isSelected ? { fontVariationSettings: "'FILL' 1" } : {}}>
                        {sport.icon}
                      </span>
                      <span className="font-label-md relative z-10 flex-1 text-left">{sport.label}</span>
                      {isSelected && (
                        <span className="material-symbols-outlined text-[20px] text-secondary relative z-10">check_circle</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Skill Level */}
            <div>
              <label className="block font-label-md text-on-surface-variant mb-3">
                Current Skill Level
              </label>
              <div className="grid grid-cols-2 gap-3">
                {SKILL_LEVELS.map((level) => {
                  const isSelected = selectedSkill === level.id;
                  return (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => setSelectedSkill(level.id)}
                      className={`p-4 rounded-2xl border text-left transition-all duration-300 ${
                        isSelected
                          ? "bg-secondary/15 border-secondary shadow-[0_0_15px_rgba(78,222,163,0.15)] -translate-y-1"
                          : "bg-surface-container-high/50 border-outline-variant/20 hover:bg-surface-bright hover:-translate-y-1"
                      }`}
                    >
                      <p className={`font-label-md mb-1 ${isSelected ? "text-secondary-fixed" : "text-on-surface"}`}>
                        {level.label}
                      </p>
                      <p className="text-xs text-on-surface-variant">{level.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-end pt-4">
          <Link href="/profile" className="w-full sm:w-auto px-8 py-4 font-label-md text-outline hover:text-on-surface hover:bg-surface-container-highest rounded-xl transition-colors text-center">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto bg-primary text-on-primary hover:bg-primary-fixed shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all font-headline-md uppercase px-10 py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                Saving...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">save</span>
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
