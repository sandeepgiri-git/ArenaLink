"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/theme-toggle";

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
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="min-h-screen bg-background flex flex-col font-body-md text-on-surface pb-24">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-dim/80 backdrop-blur-md border-b border-outline-variant">
        <div className="flex justify-between items-center w-full px-4 py-2 max-w-7xl mx-auto h-16">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-headline-md">sports_kabaddi</span>
            <span className="font-headline-md text-headline-md font-bold tracking-tighter text-primary">ARENALINK</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <Link href="/notifications" className="material-symbols-outlined text-on-surface-variant hover:bg-surface-bright p-2 rounded-full transition-colors flex items-center justify-center w-9 h-9">
              notifications
            </Link>
            <Link href="/profile" className="w-9 h-9 rounded-full overflow-hidden border border-primary/30 flex items-center justify-center bg-surface-container-high hover:border-primary transition-colors ml-1">
              {user?.image ? (
                <img 
                  className="w-full h-full object-cover" 
                  alt={user.name || "Profile"} 
                  src={user.image} 
                />
              ) : (
                <span className="font-bold text-on-surface text-sm">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <main className="mt-20 px-4 md:px-6 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 pb-[env(safe-area-inset-bottom,8px)] bg-surface-container-lowest/95 backdrop-blur-2xl border-t border-white/[0.04] shadow-[0_-8px_40px_rgba(0,0,0,0.6)] md:justify-center md:gap-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"));
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group relative flex flex-col items-center justify-center w-16 h-14"
            >
              {/* Active Glow Aura */}
              {isActive && (
                <div className="absolute -inset-1 rounded-2xl bg-primary/10 blur-lg animate-pulse pointer-events-none" />
              )}

              {/* Top Pill Indicator */}
              <div
                className={`absolute -top-[1px] h-[3px] rounded-b-full transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)] ${
                  isActive
                    ? "w-8 bg-primary shadow-[0_2px_12px_rgba(124,58,237,0.9)]"
                    : "w-0 bg-transparent"
                }`}
              />

              {/* Icon */}
              <div
                className={`relative z-10 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)] ${
                  isActive
                    ? "text-primary -translate-y-1 scale-110 drop-shadow-[0_0_8px_rgba(210,187,255,0.7)]"
                    : "text-outline group-hover:text-primary-fixed-dim group-hover:-translate-y-1 group-hover:scale-105"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[26px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
              </div>

              {/* Label */}
              <span
                className={`relative z-10 text-[10px] font-bold tracking-wider uppercase transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)] ${
                  isActive
                    ? "text-primary opacity-100 translate-y-0 mt-0.5"
                    : "text-outline opacity-0 translate-y-1 group-hover:opacity-70 group-hover:translate-y-0 group-hover:text-primary-fixed-dim mt-0.5"
                }`}
              >
                {item.label}
              </span>
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
