"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

export default function ProtectedLayoutClient({
  children,
  topBar,
}: {
  children: React.ReactNode;
  topBar: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  
  // Optional: Auto-collapse on smaller desktop screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
        setCollapsed(true);
      } else if (window.innerWidth >= 1280) {
        setCollapsed(false);
      }
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div 
        className={`flex-1 transition-all duration-300 ${
          collapsed ? "lg:pl-[72px]" : "lg:pl-[260px]"
        }`}
      >
        {topBar}

        <main className="px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-6">
          <div className="max-w-6xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
