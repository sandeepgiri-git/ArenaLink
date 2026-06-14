"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MenuIcon, XIcon } from "@/components/icons/SportIcons";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-surface/80 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" id="logo">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="text-primary-foreground font-bold text-lg">
                A
              </span>
            </div>
            <span className="text-xl font-bold tracking-tight">
              Arena
              <span className="gradient-text">Link</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <a href="#features" className="btn-ghost" id="nav-features">
              Features
            </a>
            <a href="#how-it-works" className="btn-ghost" id="nav-how-it-works">
              How It Works
            </a>
            <a href="#sports" className="btn-ghost" id="nav-sports">
              Sports
            </a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/login"
              className="btn-ghost font-semibold"
              id="nav-login"
            >
              Log In
            </Link>
            <Link href="/signup" className="btn-primary" id="nav-signup">
              Sign Up Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-surface-hover transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
            id="mobile-menu-toggle"
          >
            {isMobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-6 pt-2 bg-surface/95 backdrop-blur-xl border-t border-border space-y-1">
          <a
            href="#features"
            className="block px-4 py-2.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
            id="mobile-nav-features"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="block px-4 py-2.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
            id="mobile-nav-how-it-works"
          >
            How It Works
          </a>
          <a
            href="#sports"
            className="block px-4 py-2.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
            id="mobile-nav-sports"
          >
            Sports
          </a>
          <div className="pt-3 border-t border-border flex flex-col gap-2">
            <Link
              href="/login"
              className="btn-secondary w-full text-center"
              id="mobile-nav-login"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="btn-primary w-full text-center"
              id="mobile-nav-signup"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
