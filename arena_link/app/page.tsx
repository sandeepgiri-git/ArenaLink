import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <>
      {/* TopAppBar Navigation Shell */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface-dim/80 backdrop-blur-md border-b border-outline-variant">
        <div className="flex justify-between items-center w-full px-4 py-2 max-w-7xl mx-auto h-16">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-headline-md">sports_kabaddi</span>
            <span className="font-headline-md text-headline-md font-bold tracking-tighter text-primary">ARENALINK</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="#features" className="font-label-md text-label-md text-primary font-bold">Features</Link>
            <Link href="#explore" className="font-label-md text-label-md text-on-surface-variant hover:bg-surface-bright transition-colors px-2 py-1 rounded">Explore</Link>
            <Link href="#stats" className="font-label-md text-label-md text-on-surface-variant hover:bg-surface-bright transition-colors px-2 py-1 rounded">Stats</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:block text-on-surface-variant hover:text-primary font-label-md text-label-md font-bold transition-colors">Log In</Link>
            <Link href="/signup" className="hidden md:block bg-secondary text-on-secondary px-4 py-1.5 rounded font-label-md text-label-md font-bold uppercase transition-transform active:scale-95">Sign Up</Link>
          </div>
        </div>
      </header>
      
      <main className="relative pt-16">
        {/* Hero Section */}
        <section 
          className="relative min-h-[795px] flex flex-col items-center justify-center text-center px-5 overflow-hidden bg-turf hero-gradient" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAGRSAwRPWxt-IeS_4kjAUWfpMvqAwz3UzQaefNgJ_PVhiZhE2o6kI0FvumVL-b90_o1aBDHFTcG1i1wCbYch05DS3gXLxv9E0Ucu9C0mw84jE5HQD0oCAvu02JuQIk_-noPY8URZzw9rS04sEccq8dm_L1bRWZeORt2VJscBuk6BL_dAFcx-HnSlxWOrSCRVBmJlxCOLCu4HRJpRUM_FHWBXkH_Pj8bTqhs4hQ-YPgLeinKkp6Y7_3E3ktRrJm_vO5ILvcKu5D_LC9')" }}
        >
          {/* Atmospheric Shader Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-40"></div>
          <div className="relative z-10 max-w-4xl mx-auto space-y-6 px-4">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm text-primary font-label-sm text-label-sm uppercase tracking-widest mb-2">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              Live Matchmaking Active
            </div>
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg leading-none uppercase tracking-tighter text-on-surface drop-shadow-lg">
              Find Players. <br />
              <span className="text-secondary italic">Fill Matches.</span> <br />
              Instantly.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              The elite platform for competitive athletes. Connect with local players, manage your team rosters, and never play a short-handed game again.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link href="/signup" className="w-full sm:w-auto bg-secondary text-on-secondary px-20 py-4 rounded-lg font-label-md text-label-md font-bold uppercase glow-green transition-all hover:-translate-y-1 hover:shadow-secondary/40 active:scale-95 text-center">
                Sign Up
              </Link>
              <Link href="/explore" className="w-full sm:w-auto px-20 py-4 rounded-lg font-label-md text-label-md font-bold uppercase border-2 border-primary-container text-primary backdrop-blur-md transition-all hover:bg-primary/10 active:scale-95 text-center">
                Find Matches
              </Link>
            </div>
          </div>
          
          {/* Stats Bar (Glassmorphism) */}
          <div className="relative z-10 mt-20 w-full max-w-5xl mx-auto px-4" id="stats">
            <div className="glass-panel rounded-2xl p-4 md:p-6 flex flex-wrap md:flex-nowrap items-center justify-around gap-6 shadow-2xl border-white/10">
              <div className="flex flex-col items-center">
                <span className="font-headline-lg text-headline-lg text-primary leading-tight">10k+</span>
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Active Players</span>
              </div>
              <div className="hidden md:block w-px h-12 bg-outline-variant"></div>
              <div className="flex flex-col items-center">
                <span className="font-headline-lg text-headline-lg text-secondary leading-tight">5k+</span>
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Matches Filled</span>
              </div>
              <div className="hidden md:block w-px h-12 bg-outline-variant"></div>
              <div className="flex flex-col items-center">
                <span className="font-headline-lg text-headline-lg text-tertiary leading-tight">120+</span>
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Arenas Linked</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="py-20 max-w-7xl mx-auto px-4" id="features">
          <div className="mb-12 text-center">
            <h2 className="font-headline-lg text-headline-lg uppercase tracking-tighter text-on-surface">Precision Features</h2>
            <p className="font-body-md text-body-md text-outline">Designed for the serious competitor.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel group p-8 rounded-2xl transition-all hover:border-primary/40 hover:-translate-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary text-4xl">sports_cricket</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Instant Matchmaking</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Our algorithm matches you with players of equal skill levels in seconds, ensuring competitive play every time.</p>
            </div>
            
            <div className="glass-panel group p-8 rounded-2xl transition-all hover:border-secondary/40 hover:-translate-y-2">
              <div className="w-16 h-16 bg-secondary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
                <span className="material-symbols-outlined text-secondary text-4xl">stadium</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Arena Booking</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Real-time availability for premium courts and fields. One-click reservation with automated splitting of fees.</p>
            </div>
            
            <div className="glass-panel group p-8 rounded-2xl transition-all hover:border-tertiary/40 hover:-translate-y-2">
              <div className="w-16 h-16 bg-tertiary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-tertiary/20 transition-colors">
                <span className="material-symbols-outlined text-tertiary text-4xl">handshake</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Team Management</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Build your roster, track individual stats, and manage communication in one unified, high-performance dashboard.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 mb-24 relative overflow-hidden" id="explore">
          <div className="absolute inset-0 bg-primary-container/10 -skew-y-3 origin-right"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
              <h2 className="font-display-lg text-headline-lg md:text-display-lg uppercase tracking-tight text-on-surface leading-none mb-4">Ready to <span className="text-primary">Dominate</span> the Court?</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">Join thousands of athletes who never settle for anything less than a full squad.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Link href="/signup" className="bg-secondary text-on-secondary px-12 py-4 rounded-lg font-label-md text-label-md font-bold uppercase glow-green hover:scale-105 transition-all text-center">
                Get Started Now
              </Link>
              <Link href="/contact" className="bg-surface-container-high text-on-surface px-12 py-4 rounded-lg font-label-md text-label-md font-bold uppercase hover:bg-surface-bright transition-all text-center">
                Contact Arena Sales
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-surface-container-low/90 backdrop-blur-xl border-t border-primary-container/30 shadow-[0_-4px_20px_rgba(124,58,237,0.3)] rounded-t-xl">
        <Link href="/login" className="flex flex-col items-center justify-center text-outline opacity-70 hover:text-primary-fixed transition-all">
          <span className="material-symbols-outlined">login</span>
          <span className="font-label-sm text-label-sm">Log In</span>
        </Link>
        <Link href="/signup" className="flex flex-col items-center justify-center text-primary font-bold shadow-[0_0_15px_rgba(210,187,255,0.4)] scale-110">
          <span className="material-symbols-outlined">person_add</span>
          <span className="font-label-sm text-label-sm">Sign Up</span>
        </Link>
      </nav>
    </>
  );
}
