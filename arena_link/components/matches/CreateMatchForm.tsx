"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createMatch, type MatchCreateState } from "@/lib/actions/match";
import dynamic from "next/dynamic";

const LocationPickerMap = dynamic(() => import("./LocationPickerMap"), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-surface-container-highest/30 rounded-2xl animate-pulse flex flex-col items-center justify-center text-outline-variant text-sm border border-outline-variant/10">
      <span className="material-symbols-outlined text-[32px] mb-2 text-outline-variant/50">map</span>
      Loading map...
    </div>
  ),
});

const SPORTS = [
  { id: "football", label: "Football", icon: "sports_soccer" },
  { id: "cricket", label: "Cricket", icon: "sports_cricket" },
  { id: "basketball", label: "Basketball", icon: "sports_basketball" },
  { id: "volleyball", label: "Volleyball", icon: "sports_volleyball" },
  { id: "tennis", label: "Tennis", icon: "sports_tennis" },
  { id: "badminton", label: "Badminton", icon: "sports_tennis" },
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
  
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [selectedSkill, setSelectedSkill] = useState<string>("any");

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
    <div className="max-w-3xl mx-auto animate-fade-in-up pb-8 mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Host a Match
          </h1>
          <p className="text-on-surface-variant font-body-sm mt-1">
            Create a new sports event and invite players.
          </p>
        </div>
        <Link href="/matches" className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:bg-surface-bright hover:text-primary transition-colors">
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

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="lat" value={lat || ""} />
        <input type="hidden" name="lng" value={lng || ""} />
        <input type="hidden" name="sport" value={selectedSport} />
        <input type="hidden" name="skillLevelRequired" value={selectedSkill} />
        
        {/* Section 1: Basic Details */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none transition-all duration-700 group-hover:bg-primary/10"></div>
          
          <h2 className="font-headline-md text-primary mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined p-2 bg-primary/10 rounded-xl">edit_note</span>
            Match Details
          </h2>
          
          <div className="space-y-6 relative z-10">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block font-label-md text-on-surface-variant mb-2">
                Match Title <span className="text-error">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className={`w-full bg-surface-container-lowest/50 border ${state.errors?.title ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary focus:ring-primary/20"} rounded-xl px-5 py-4 text-on-surface focus:outline-none focus:ring-4 transition-all placeholder:text-outline-variant`}
                placeholder="e.g., Weekend Football at Vijay Nagar Turf"
              />
              {state.errors?.title && (
                <p className="text-error text-xs mt-2 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span> {state.errors.title[0]}</p>
              )}
            </div>

            {/* Sport Selection */}
            <div>
              <label className="block font-label-md text-on-surface-variant mb-3">
                Sport <span className="text-error">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SPORTS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedSport(s.id)}
                    className={`relative p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 overflow-hidden ${
                      selectedSport === s.id 
                        ? "bg-primary/15 border border-primary text-primary-fixed shadow-[0_0_20px_rgba(124,58,237,0.2)] -translate-y-1" 
                        : "bg-surface-container-high/50 border border-outline-variant/20 text-on-surface-variant hover:bg-surface-bright hover:text-on-surface hover:-translate-y-1"
                    }`}
                  >
                    {selectedSport === s.id && (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50"></div>
                    )}
                    <span className="material-symbols-outlined text-[32px] relative z-10" style={selectedSport === s.id ? { fontVariationSettings: "'FILL' 1" } : {}}>
                      {s.icon}
                    </span>
                    <span className="font-label-md relative z-10">{s.label}</span>
                  </button>
                ))}
              </div>
              {state.errors?.sport && (
                <p className="text-error text-xs mt-2 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span> {state.errors.sport[0]}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block font-label-md text-on-surface-variant mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className={`w-full bg-surface-container-lowest/50 border ${state.errors?.description ? "border-error focus:border-error" : "border-outline-variant/30 focus:border-primary focus:ring-primary/20"} rounded-xl px-5 py-4 text-on-surface focus:outline-none focus:ring-4 transition-all placeholder:text-outline-variant resize-none`}
                placeholder="Any special instructions, rules, or details? (Optional)"
                maxLength={1000}
              />
              {state.errors?.description && (
                <p className="text-error text-xs mt-2 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span> {state.errors.description[0]}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Time & Place */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none transition-all duration-700 group-hover:bg-secondary/10"></div>
          
          <h2 className="font-headline-md text-secondary mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined p-2 bg-secondary/10 rounded-xl">calendar_clock</span>
            Time & Place
          </h2>
          
          <div className="space-y-6 relative z-10">
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Date */}
              <div>
                <label htmlFor="date" className="block font-label-md text-on-surface-variant mb-2">
                  Date <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline-variant pointer-events-none">calendar_month</span>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    required
                    min={minDateStr}
                    className={`w-full bg-surface-container-lowest/50 border ${state.errors?.date ? "border-error focus:border-error" : "border-outline-variant/30 focus:border-secondary focus:ring-secondary/20"} rounded-xl pl-12 pr-4 py-4 text-on-surface focus:outline-none focus:ring-4 transition-all color-scheme-dark`}
                    style={{ colorScheme: "dark" }}
                  />
                </div>
                {state.errors?.date && (
                  <p className="text-error text-xs mt-2 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span> {state.errors.date[0]}</p>
                )}
              </div>

              {/* Time */}
              <div>
                <label htmlFor="time" className="block font-label-md text-on-surface-variant mb-2">
                  Time <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline-variant pointer-events-none">schedule</span>
                  <input
                    id="time"
                    name="time"
                    type="time"
                    required
                    className={`w-full bg-surface-container-lowest/50 border ${state.errors?.time ? "border-error focus:border-error" : "border-outline-variant/30 focus:border-secondary focus:ring-secondary/20"} rounded-xl pl-12 pr-4 py-4 text-on-surface focus:outline-none focus:ring-4 transition-all color-scheme-dark`}
                    style={{ colorScheme: "dark" }}
                  />
                </div>
                {state.errors?.time && (
                  <p className="text-error text-xs mt-2 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span> {state.errors.time[0]}</p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4 pt-2">
              <div>
                <label htmlFor="location" className="block font-label-md text-on-surface-variant mb-2">
                  Venue Name / Address <span className="text-error">*</span>
                </label>
                <div className="flex gap-3 items-start flex-col sm:flex-row">
                  <div className="flex-1 w-full relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline-variant pointer-events-none">location_on</span>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      required
                      ref={locationRef}
                      className={`w-full bg-surface-container-lowest/50 border ${state.errors?.location ? "border-error focus:border-error" : "border-outline-variant/30 focus:border-secondary focus:ring-secondary/20"} rounded-xl pl-12 pr-4 py-4 text-on-surface focus:outline-none focus:ring-4 transition-all placeholder:text-outline-variant`}
                      placeholder="e.g., Central Park, Court 2"
                    />
                    {state.errors?.location && (
                      <p className="text-error text-xs mt-2 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span> {state.errors.location[0]}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleGetCoordinates}
                    disabled={isGeocoding}
                    className="bg-secondary/10 text-secondary border border-secondary/30 hover:bg-secondary/20 hover:border-secondary/50 transition-all font-label-md px-6 py-4 rounded-xl flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 w-full sm:w-auto"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isGeocoding ? "hourglass_empty" : "search"}
                    </span>
                    {isGeocoding ? "Searching..." : "Find on Map"}
                  </button>
                </div>
                {geocodeError && <p className="text-warning text-xs mt-2 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">warning</span> {geocodeError}</p>}
              </div>

              <div className="bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl p-4 mt-4">
                <label className="block font-label-md text-on-surface mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px]">pin_drop</span>
                  Pinpoint on Map
                </label>
                <p className="text-xs text-on-surface-variant mb-4">Click on the map to drop a precise pin. This helps players navigate exactly to your match!</p>
                <div className="rounded-xl overflow-hidden border border-outline-variant/20 shadow-inner">
                  <LocationPickerMap 
                    onLocationSelect={(newLat, newLng) => {
                      setLat(newLat);
                      setLng(newLng);
                      setGeocodeError("");
                    }} 
                    defaultLat={lat || undefined} 
                    defaultLng={lng || undefined} 
                  />
                </div>
                {lat && lng && !geocodeError && (
                  <p className="text-secondary text-xs mt-3 flex items-center gap-1 bg-secondary/10 w-fit px-3 py-1.5 rounded-lg border border-secondary/20">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    Coordinates selected successfully!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Requirements */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-tertiary/5 rounded-full blur-3xl pointer-events-none transition-all duration-700 group-hover:bg-tertiary/10"></div>
          
          <h2 className="font-headline-md text-tertiary mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined p-2 bg-tertiary/10 rounded-xl">groups</span>
            Requirements
          </h2>
          
          <div className="space-y-6 relative z-10">
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Players Needed */}
              <div>
                <label htmlFor="playersNeeded" className="block font-label-md text-on-surface-variant mb-2">
                  Players Needed <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline-variant pointer-events-none">person_add</span>
                  <input
                    id="playersNeeded"
                    name="playersNeeded"
                    type="number"
                    min="1"
                    max="50"
                    required
                    defaultValue={1}
                    className={`w-full bg-surface-container-lowest/50 border ${state.errors?.playersNeeded ? "border-error focus:border-error" : "border-outline-variant/30 focus:border-tertiary focus:ring-tertiary/20"} rounded-xl pl-12 pr-4 py-4 text-on-surface focus:outline-none focus:ring-4 transition-all`}
                  />
                </div>
                {state.errors?.playersNeeded && (
                  <p className="text-error text-xs mt-2 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span> {state.errors.playersNeeded[0]}</p>
                )}
              </div>

              {/* Cost Per Player */}
              <div>
                <label htmlFor="costPerPlayer" className="block font-label-md text-on-surface-variant mb-2">
                  Cost Per Player (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant font-bold pointer-events-none">₹</span>
                  <input
                    id="costPerPlayer"
                    name="costPerPlayer"
                    type="number"
                    min="0"
                    defaultValue={0}
                    className={`w-full bg-surface-container-lowest/50 border ${state.errors?.costPerPlayer ? "border-error focus:border-error" : "border-outline-variant/30 focus:border-tertiary focus:ring-tertiary/20"} rounded-xl pl-12 pr-4 py-4 text-on-surface focus:outline-none focus:ring-4 transition-all`}
                    placeholder="0 for free"
                  />
                </div>
                {state.errors?.costPerPlayer && (
                  <p className="text-error text-xs mt-2 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span> {state.errors.costPerPlayer[0]}</p>
                )}
              </div>
            </div>

            {/* Skill Level */}
            <div className="pt-2">
              <label className="block font-label-md text-on-surface-variant mb-3">
                Required Skill Level
              </label>
              <div className="grid grid-cols-2 gap-3">
                {SKILL_LEVELS.map((level) => (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => setSelectedSkill(level.id)}
                    className={`p-4 rounded-2xl border text-left transition-all duration-300 ${
                      selectedSkill === level.id
                        ? "bg-tertiary/15 border-tertiary shadow-[0_0_15px_rgba(200,26,66,0.15)] -translate-y-1"
                        : "bg-surface-container-high/50 border-outline-variant/20 hover:bg-surface-bright hover:-translate-y-1"
                    }`}
                  >
                    <p className={`font-label-md mb-1 ${selectedSkill === level.id ? "text-tertiary" : "text-on-surface"}`}>
                      {level.label}
                    </p>
                    <p className="text-xs text-on-surface-variant">{level.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-end pt-4">
          <Link href="/matches" className="w-full sm:w-auto px-8 py-4 font-label-md text-outline hover:text-on-surface hover:bg-surface-container-highest rounded-xl transition-colors text-center">
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
                Creating...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                Create Match
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
