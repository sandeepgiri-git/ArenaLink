"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full flex items-center justify-center p-2 text-on-surface-variant hover:bg-surface-bright transition-colors">
        <span className="material-symbols-outlined text-[20px] opacity-0">light_mode</span>
      </div>
    );
  }

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-bright hover:text-primary transition-all duration-300 overflow-hidden relative group"
      aria-label="Toggle theme"
    >
      <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ${isDark ? 'translate-y-0 rotate-0' : '-translate-y-10 rotate-90 opacity-0'}`}>
        <span className="material-symbols-outlined text-[20px]">dark_mode</span>
      </div>
      <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ${isDark ? 'translate-y-10 -rotate-90 opacity-0' : 'translate-y-0 rotate-0'}`}>
        <span className="material-symbols-outlined text-[20px]">light_mode</span>
      </div>
    </button>
  );
}
