import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Top Navigation Bar (Mobile Branding) */}
      <header className="md:hidden fixed top-0 left-0 w-full z-50 p-6 flex items-center justify-between pointer-events-none">
        <div className="flex items-center space-x-2 pointer-events-auto">
          <span className="material-symbols-outlined text-primary text-3xl">sports_kabaddi</span>
          <span className="font-headline-md text-headline-md font-bold tracking-tighter text-primary">ARENALINK</span>
        </div>
      </header>

      {/* Left Side: Visual/Dynamic Graphic Section */}
      <section className="relative w-full md:w-1/2 lg:w-3/5 h-64 md:h-screen overflow-hidden hidden md:block">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent md:bg-gradient-to-r z-10"></div>
        <div className="relative z-20 h-full flex flex-col justify-end p-6 md:p-20 md:justify-center">
          <div className="max-w-xl">
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-2 uppercase italic tracking-tighter">
              Claim Your <span className="text-primary italic">Territory</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md hidden md:block">
              Join the elite matchmaking network for competitive athletes. Find your next match, build your legacy, and dominate the arena.
            </p>
          </div>
        </div>
        {/* Dynamic Athlete Image (Background) */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuChaujFvsk5JbZNLF69poGaFkx-nZEQA5BPc2yYoMqI0lGQdB5kYeXIJQZkRxolMTVXRmygNtATqk9swNF-638fXqRnLXzI7xK4kX1wxMxmffcxGPIfrz-OlU4O9IGmo-f8lEuFSm_hNlW-LWVbKKn8pZNVo2VdwtK39lnp0h18p7tylXedWNh5IVgLR8dcwVDjcuMZ1jH6mPFL34rsFdifo6g2gORzooV3viI78AZ_a80aNQSoMlaQwGoYO1FYp1yp7vTNNo_5JHeu')" }}
        ></div>
      </section>

      {/* Right Side: Authentication Form Section */}
      <section className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center px-4 md:px-12 py-20 bg-surface-container-lowest min-h-screen md:min-h-0 pt-24 md:pt-20">
        <div className="w-full max-w-md mx-auto flex-grow flex flex-col justify-center">
          {children}
        </div>
        <footer className="mt-20 text-center">
          <div className="flex justify-center space-x-6 mb-2">
            <Link href="/privacy" className="text-outline text-xs hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-outline text-xs hover:text-primary transition-colors">Terms of Play</Link>
          </div>
          <p className="text-outline/40 text-[10px] tracking-widest uppercase">© {new Date().getFullYear()} ARENALINK Matchmaking Systems</p>
        </footer>
      </section>
    </div>
  );
}
