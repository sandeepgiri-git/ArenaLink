"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createMatch, type MatchCreateState } from "@/lib/actions/match";

const SPORTS = [
  { id: "football", label: "Football", emoji: "⚽" },
  { id: "cricket", label: "Cricket", emoji: "🏏" },
  { id: "basketball", label: "Basketball", emoji: "🏀" },
  { id: "volleyball", label: "Volleyball", emoji: "🏐" },
  { id: "tennis", label: "Tennis", emoji: "🎾" },
  { id: "badminton", label: "Badminton", emoji: "🏸" },
];

const SKILL_LEVELS = [
  { id: "any", label: "Any Level", desc: "Everyone welcome" },
  { id: "beginner", label: "Beginner", desc: "Just for fun" },
  { id: "intermediate", label: "Intermediate", desc: "Play regularly" },
  { id: "advanced", label: "Advanced", desc: "Competitive" },
];

const initialState: MatchCreateState = {};

export default function CreateMatchForm() {
  const [state, formAction, isPending] = useActionState(createMatch, initialState);
  const router = useRouter();
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState("");
  const locationRef = useRef<HTMLInputElement>(null);

  // Get tomorrow's date for default minimum date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split("T")[0];

  useEffect(() => {
    if (state.success) {
      router.push("/matches");
    }
  }, [state.success, router]);

  const handleGetCoordinates = async () => {
    setGeocodeError("");
    setLat(null);
    setLng(null);
    const address = locationRef.current?.value;
    if (!address) {
      setGeocodeError("Please enter a location first.");
      return;
    }

    setIsGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        setLat(parseFloat(data[0].lat));
        setLng(parseFloat(data[0].lon));
      } else {
        setGeocodeError("Could not find coordinates for this location.");
      }
    } catch (error) {
      setGeocodeError("Error fetching location data.");
    } finally {
      setIsGeocoding(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Host a Match</h1>
          <p className="text-sm text-muted mt-0.5">
            Create a new sports event and invite players.
          </p>
        </div>
        <Link href="/matches" className="btn-ghost text-sm">
          Cancel
        </Link>
      </div>

      {/* Error Message */}
      {state.message && !state.success && (
        <div className="mb-6 p-3 rounded-xl bg-[rgba(239,68,68,0.1)] border border-danger/20 text-danger text-sm">
          {state.message}
        </div>
      )}

      <form action={formAction} className="space-y-8">
        <input type="hidden" name="lat" value={lat || ""} />
        <input type="hidden" name="lng" value={lng || ""} />
        
        {/* Section 1: Basic Details */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm">📝</span>
            Match Details
          </h2>
          <div className="space-y-4">
            
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1.5">
                Match Title <span className="text-danger">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className={`input-field ${state.errors?.title ? "border-danger" : ""}`}
                placeholder="e.g., Weekend Football at Vijay Nagar Turf"
              />
              {state.errors?.title && (
                <p className="text-danger text-xs mt-1">{state.errors.title[0]}</p>
              )}
            </div>

            {/* Sport Selection */}
            <div>
              <label htmlFor="sport" className="block text-sm font-medium mb-1.5">
                Sport <span className="text-danger">*</span>
              </label>
              <select
                id="sport"
                name="sport"
                required
                className={`input-field bg-surface text-foreground appearance-none ${
                  state.errors?.sport ? "border-danger" : ""
                }`}
              >
                <option value="">Select a sport...</option>
                {SPORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.emoji} {s.label}
                  </option>
                ))}
              </select>
              {state.errors?.sport && (
                <p className="text-danger text-xs mt-1">{state.errors.sport[0]}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1.5">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className={`input-field resize-none ${state.errors?.description ? "border-danger" : ""}`}
                placeholder="Any special instructions or details? (Optional)"
                maxLength={1000}
              />
              {state.errors?.description && (
                <p className="text-danger text-xs mt-1">{state.errors.description[0]}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Time & Place */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-sm">📅</span>
            Time & Place
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-1.5">
                Date <span className="text-danger">*</span>
              </label>
              <input
                id="date"
                name="date"
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                className={`input-field bg-surface ${state.errors?.date ? "border-danger" : ""}`}
              />
              {state.errors?.date && (
                <p className="text-danger text-xs mt-1">{state.errors.date[0]}</p>
              )}
            </div>

            {/* Time */}
            <div>
              <label htmlFor="time" className="block text-sm font-medium mb-1.5">
                Time <span className="text-danger">*</span>
              </label>
              <input
                id="time"
                name="time"
                type="time"
                required
                className={`input-field bg-surface ${state.errors?.time ? "border-danger" : ""}`}
              />
              {state.errors?.time && (
                <p className="text-danger text-xs mt-1">{state.errors.time[0]}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="mt-4">
            <label htmlFor="location" className="block text-sm font-medium mb-1.5">
              Location <span className="text-danger">*</span>
            </label>
            <div className="flex gap-2 items-start">
              <div className="flex-1">
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  ref={locationRef}
                  className={`input-field ${state.errors?.location ? "border-danger" : ""}`}
                  placeholder="e.g., Central Park, Court 2"
                />
                {state.errors?.location && (
                  <p className="text-danger text-xs mt-1">{state.errors.location[0]}</p>
                )}
              </div>
              <button
                type="button"
                onClick={handleGetCoordinates}
                disabled={isGeocoding}
                className="btn-secondary whitespace-nowrap text-sm py-2.5 px-4 h-11 disabled:opacity-50"
                title="Get Coordinates"
              >
                {isGeocoding ? "Finding..." : lat && lng ? "✓ Verified" : "📍 Verify Map Location"}
              </button>
            </div>
            {geocodeError && <p className="text-warning text-xs mt-1">{geocodeError}</p>}
            {lat && lng && !geocodeError && (
              <p className="text-success text-xs mt-1">Coordinates found successfully!</p>
            )}
          </div>
        </div>

        {/* Section 3: Requirements */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center text-sm">👥</span>
            Requirements
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Players Needed */}
            <div>
              <label htmlFor="playersNeeded" className="block text-sm font-medium mb-1.5">
                Players Needed <span className="text-danger">*</span>
              </label>
              <input
                id="playersNeeded"
                name="playersNeeded"
                type="number"
                min="1"
                max="50"
                required
                defaultValue={1}
                className={`input-field ${state.errors?.playersNeeded ? "border-danger" : ""}`}
              />
              {state.errors?.playersNeeded && (
                <p className="text-danger text-xs mt-1">{state.errors.playersNeeded[0]}</p>
              )}
            </div>

            {/* Cost Per Player */}
            <div>
              <label htmlFor="costPerPlayer" className="block text-sm font-medium mb-1.5">
                Cost Per Player (₹)
              </label>
              <input
                id="costPerPlayer"
                name="costPerPlayer"
                type="number"
                min="0"
                defaultValue={0}
                className={`input-field ${state.errors?.costPerPlayer ? "border-danger" : ""}`}
                placeholder="0 for free"
              />
              {state.errors?.costPerPlayer && (
                <p className="text-danger text-xs mt-1">{state.errors.costPerPlayer[0]}</p>
              )}
            </div>
          </div>

          {/* Skill Level */}
          <div className="mt-4">
            <label htmlFor="skillLevelRequired" className="block text-sm font-medium mb-1.5">
              Required Skill Level
            </label>
            <select
              id="skillLevelRequired"
              name="skillLevelRequired"
              className="input-field bg-surface text-foreground appearance-none"
              defaultValue="any"
            >
              {SKILL_LEVELS.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.label} - {level.desc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 justify-end">
          <Link href="/matches" className="btn-ghost text-sm py-2.5 px-5">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="btn-primary text-sm py-2.5 px-8 disabled:opacity-60 disabled:cursor-not-allowed"
            id="create-match-btn"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Creating...
              </div>
            ) : (
              "Create Match"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
