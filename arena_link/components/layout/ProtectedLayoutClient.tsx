"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Explore", href: "/matches", icon: "explore" },
  { label: "Teams", href: "/teams", icon: "groups" },
  { label: "Profile", href: "/profile", icon: "person" },
];

export default function ProtectedLayoutClient({
  children,
  topBar,
}: {
  children: React.ReactNode;
  topBar?: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background flex flex-col font-body-md text-on-surface pb-24">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-dim/80 backdrop-blur-md border-b border-outline-variant">
        <div className="flex justify-between items-center w-full px-4 py-2 max-w-7xl mx-auto h-16">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-headline-md">sports_kabaddi</span>
            <span className="font-headline-md text-headline-md font-bold tracking-tighter text-primary">ARENALINK</span>
          </Link>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-bright p-2 rounded-full transition-colors">
              notifications
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/30">
              <img 
                className="w-full h-full object-cover" 
                alt="Profile" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzR7fVGXQgDTMKuwbn4vypPcr064EvXOD6Vkf1UWyRymAq8OYet4p8qsbMG1f1ghpAT29WMOCLZWZN6FmKkg8zXFguApe3H0xADQo_h-Irw-QHRQmq9j2MIzxDk1grZzY_GsR-ihfKpqM3SF5e_0fGKST_dpJb1MY1OHAVIZR2KfBqCQiAIjviSTzRkbVa24j4tQqxn43S5q9MwB-9vKF_Xw492cCs7ywl3A7hklod9thH6fD4RnJSvzLY1dmDXrmpjLp938XD6hqO" 
              />
            </div>
          </div>
        </div>
      </header>

      <main className="mt-20 px-4 md:px-6 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-surface-container-low/90 backdrop-blur-xl border-t border-primary-container/30 shadow-[0_-4px_20px_rgba(124,58,237,0.3)] rounded-t-xl md:justify-center md:gap-12">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center transition-all ${
                isActive 
                  ? "text-primary font-bold shadow-[0_0_15px_rgba(210,187,255,0.4)] scale-110" 
                  : "text-outline opacity-70 hover:text-primary-fixed"
              }`}
            >
              <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {item.icon}
              </span>
              <span className="font-label-sm text-label-sm mt-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      {/* Floating Action Button */}
      <Link href="/matches/create" className="fixed bottom-24 right-4 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg glow-purple flex items-center justify-center active:scale-95 transition-transform z-40">
        <span className="material-symbols-outlined text-[28px]">add</span>
      </Link>
    </div>
  );
}
