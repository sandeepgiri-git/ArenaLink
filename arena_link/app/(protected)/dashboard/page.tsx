import { getUserProfile } from "@/lib/actions/user";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect("/login");
  }

  // Calculate profile completion
  const profileFields = [
    profile.name,
    profile.username,
    profile.bio,
    profile.city,
    profile.age,
    profile.gender,
    profile.sportsInterests.length > 0 ? "yes" : "",
    profile.skillLevel,
  ];
  const filled = profileFields.filter(Boolean).length;
  const completion = Math.round((filled / profileFields.length) * 100);
  const isProfileIncomplete = completion < 100;
  
  const firstName = profile.name.split(" ")[0];
  const rating = profile.rating > 0 ? profile.rating.toFixed(1) : "—";
  const reliability = profile.reliabilityScore;
  const matchesPlayed = profile.matchesPlayed;
  
  const winRate = profile.rating > 0 ? Math.round(profile.reliabilityScore * 0.8) : "—"; 

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome Header */}
      <section className="py-6">
        <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-surface">
          Welcome back, {firstName}
        </h1>
        {isProfileIncomplete ? (
          <p className="text-warning font-body-sm text-body-sm mt-2">
            Your profile is {completion}% complete. <Link href="/profile/edit" className="underline font-bold">Complete it now.</Link>
          </p>
        ) : (
          <p className="text-on-surface-variant font-body-sm text-body-sm mt-2">
            Your next match is in 4 hours. Ready to dominate?
          </p>
        )}
      </section>

      {/* Quick Stats Bento Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Rating */}
        <div className="glass-panel rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-2 group hover:border-primary/50 transition-all duration-300">
          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Rating</span>
          <div className="flex items-center gap-1">
            <span className="font-headline-lg text-headline-lg text-primary">{rating}</span>
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          </div>
          <div className="h-1 w-12 bg-primary/20 rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: profile.rating > 0 ? `${(profile.rating / 5) * 100}%` : '0%' }}></div>
          </div>
        </div>

        {/* Reliability Ring */}
        <div className="glass-panel rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-2 group hover:border-secondary/50 transition-all duration-300">
          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Reliability</span>
          <div className="relative flex items-center justify-center">
            <svg className="w-16 h-16">
              <circle className="text-surface-bright" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="4"></circle>
              <circle 
                className="text-secondary glow-green transition-all duration-700 -rotate-90 origin-center" 
                cx="32" 
                cy="32" 
                fill="transparent" 
                r="28" 
                stroke="currentColor" 
                strokeDasharray="175.9" 
                strokeDashoffset={175.9 - (175.9 * reliability) / 100} 
                strokeLinecap="round" 
                strokeWidth="4"
              ></circle>
            </svg>
            <span className="absolute font-headline-md text-headline-md text-secondary">{reliability}%</span>
          </div>
        </div>

        {/* Matches Played */}
        <div className="glass-panel rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-2 group hover:border-white/20 transition-all duration-300">
          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Played</span>
          <span className="font-headline-lg text-headline-lg text-on-surface">{matchesPlayed}</span>
          <span className="text-secondary text-label-sm font-label-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">trending_up</span> +3 this month
          </span>
        </div>

        {/* Win Rate */}
        <div className="glass-panel rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-2 group hover:border-primary-fixed/50 transition-all duration-300">
          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Win Rate</span>
          <span className="font-headline-lg text-headline-lg text-primary-fixed">{winRate}{winRate !== "—" && "%"}</span>
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full border border-background bg-surface-bright"></div>
            <div className="w-6 h-6 rounded-full border border-background bg-surface-bright"></div>
            <div className="w-6 h-6 rounded-full border border-background bg-surface-bright flex items-center justify-center text-[8px]">+32</div>
          </div>
        </div>
      </section>

      {/* Upcoming Matches Slider */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h2 className="font-headline-md text-headline-md text-on-surface">Upcoming Matches</h2>
          <Link href="/matches" className="text-primary font-label-md text-label-md hover:underline">View All</Link>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
          
          {/* Match Card 1 */}
          <div className="snap-start min-w-[280px] md:min-w-[340px] glass-panel rounded-xl overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
            <div className="h-2 bg-primary"></div>
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="bg-primary/10 text-primary px-2 py-[2px] rounded font-label-sm text-label-sm">5v5 Football</span>
                <span className="text-on-surface-variant font-label-sm text-label-sm">Today, 18:30</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="text-center flex-1">
                  <div className="w-12 h-12 bg-surface-container-high rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">shield</span>
                  </div>
                  <span className="font-label-md text-label-md block">Wolves FC</span>
                </div>
                <span className="font-headline-md text-headline-md text-outline opacity-50 px-6">VS</span>
                <div className="text-center flex-1">
                  <div className="w-12 h-12 bg-surface-container-high rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary">sports_soccer</span>
                  </div>
                  <span className="font-label-md text-label-md block">Dragons</span>
                </div>
              </div>
              <div className="bg-surface-container-low/50 rounded-lg p-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">location_on</span>
                  <span className="text-label-sm font-label-sm text-on-surface-variant truncate max-w-[120px]">Metro Arena</span>
                </div>
                <span className="text-secondary font-label-sm text-label-sm">Confirmed</span>
              </div>
            </div>
          </div>

          {/* Match Card 2 */}
          <div className="snap-start min-w-[280px] md:min-w-[340px] glass-panel rounded-xl overflow-hidden group hover:scale-[1.02] transition-transform duration-300 opacity-80">
            <div className="h-2 bg-surface-bright"></div>
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="bg-surface-container-high text-on-surface px-2 py-[2px] rounded font-label-sm text-label-sm">Tennis Single</span>
                <span className="text-on-surface-variant font-label-sm text-label-sm">Sat, 14:00</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="text-center flex-1">
                  <div className="w-12 h-12 bg-surface-container-high rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface">sports_tennis</span>
                  </div>
                  <span className="font-label-md text-label-md block">{firstName} (You)</span>
                </div>
                <span className="font-headline-md text-headline-md text-outline opacity-50 px-6">VS</span>
                <div className="text-center flex-1">
                  <div className="w-12 h-12 bg-surface-container-high rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <span className="material-symbols-outlined text-tertiary">person_search</span>
                  </div>
                  <span className="font-label-md text-label-md block italic">Searching...</span>
                </div>
              </div>
              <button className="w-full py-2 rounded-lg border border-primary/30 text-primary font-label-md text-label-md hover:bg-primary/5 transition-colors">Manage Game</button>
            </div>
          </div>

        </div>
      </section>

      {/* Recommended For You */}
      <section className="space-y-4 pt-4">
        <h2 className="font-headline-md text-headline-md text-on-surface">Recommended For You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative rounded-xl overflow-hidden group h-[200px]">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
            <img 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              alt="Action shot" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHv_uvYq3G2c0R5b5lvM0lJDE_P-FuhefGStwnow0Fl6nkYRjlBD5NMnH3pnhUHDCZrZHaFM5HVf5El1l9wMzmXlNWBXShKmDoU6m5TmLRNyASEathIpyjZa2Fk3qywOibPY9wRHMo5JxFumhts_zGn-fV880qxyqyquozRprX2XvGE6oisCThxiACHpO8zhphMySEqVBHphAhnNsr3oMM3mW9W10YzVQ3PPY3AkyB84G9yjlJMFAJohjf4b09fqGWlbM4cYRoudU1" 
            />
            <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-tertiary-container text-on-tertiary-container px-2 py-[2px] rounded-full text-label-sm font-label-sm flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> LIVE
                </span>
                <span className="text-white text-label-sm font-label-sm">High-Stakes Invitational</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-white mb-4">Arena Elite Tournament</h3>
              <button className="bg-secondary text-on-secondary px-6 py-2 rounded font-label-md text-label-md uppercase tracking-wide hover:scale-105 transition-transform">Register Now</button>
            </div>
          </div>
          
          <div className="glass-panel rounded-xl p-4 flex flex-col justify-between">
            <div>
              <h4 className="font-headline-md text-headline-md text-primary-fixed mb-2">Top Squads</h4>
              <p className="text-on-surface-variant text-body-sm font-body-sm">Teams in your area looking for players with {rating}+ rating.</p>
            </div>
            <div className="space-y-2 mt-6">
              <div className="flex items-center justify-between p-2 bg-surface-container/50 rounded-lg hover:bg-surface-container transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[20px]">groups</span>
                  </div>
                  <span className="font-label-md text-label-md">Shadow Titans</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-surface-container/50 rounded-lg hover:bg-surface-container transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary text-[20px]">groups</span>
                  </div>
                  <span className="font-label-md text-label-md">Neon Strikers</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
