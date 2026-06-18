import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Image from "next/image";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  FootballIcon,
  CricketIcon,
  BasketballIcon,
  VolleyballIcon,
  TennisIcon,
  BadmintonIcon,
  SearchIcon,
  ZapIcon,
  ChatIcon,
  StarIcon,
  MapPinIcon,
  UsersIcon,
  ArrowRightIcon,
  ShieldIcon,
} from "@/components/icons/SportIcons";

const features = [
  {
    icon: SearchIcon,
    title: "Find Matches",
    description:
      "Discover nearby sports matches filtered by sport, location, skill level, and time.",
    color: "text-primary",
    bg: "bg-primary-light",
  },
  {
    icon: ZapIcon,
    title: "Join Instantly",
    description:
      "Send join requests with one tap. Get accepted and you're in the game.",
    color: "text-accent",
    bg: "bg-accent-light",
  },
  {
    icon: ChatIcon,
    title: "Real-time Chat",
    description:
      "Coordinate with teammates in match group chats. Plan strategy before you play.",
    color: "text-secondary",
    bg: "bg-secondary-light",
  },
  {
    icon: StarIcon,
    title: "Rating System",
    description:
      "Rate players and hosts after matches. Build your reputation in the community.",
    color: "text-warning",
    bg: "bg-[rgba(245,158,11,0.12)]",
  },
  {
    icon: MapPinIcon,
    title: "Location Based",
    description:
      "Find matches happening near you with GPS-powered discovery and Google Maps.",
    color: "text-danger",
    bg: "bg-[rgba(239,68,68,0.12)]",
  },
  {
    icon: UsersIcon,
    title: "Build Your Network",
    description:
      "Add friends, create teams, and grow your local sports community.",
    color: "text-info",
    bg: "bg-[rgba(59,130,246,0.12)]",
  },
];

const steps = [
  {
    number: "01",
    title: "Create a Match",
    description:
      "Set the sport, date, time, location, and number of players needed. It takes just 30 seconds.",
    icon: "🏟️",
  },
  {
    number: "02",
    title: "Discover & Join",
    description:
      "Browse nearby matches or let ArenaLink suggest the best ones for you. Send a join request.",
    icon: "🔍",
  },
  {
    number: "03",
    title: "Play Together",
    description:
      "Once accepted, coordinate via group chat, show up, and enjoy the game. Rate players after!",
    icon: "⚡",
  },
];

const sports = [
  { name: "Football", icon: FootballIcon, color: "text-primary" },
  { name: "Cricket", icon: CricketIcon, color: "text-accent" },
  { name: "Basketball", icon: BasketballIcon, color: "text-warning" },
  { name: "Volleyball", icon: VolleyballIcon, color: "text-secondary" },
  { name: "Tennis", icon: TennisIcon, color: "text-success" },
  { name: "Badminton", icon: BadmintonIcon, color: "text-danger" },
];

const stats = [
  { value: "10K+", label: "Active Players" },
  { value: "5K+", label: "Matches Played" },
  { value: "50+", label: "Cities" },
  { value: "4.9★", label: "App Rating" },
];

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <>
      <Navbar />

      {/* ===================== HERO SECTION ===================== */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-background">
          {/* Gradient Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute top-1/2 right-1/3 w-64 h-64 bg-secondary/8 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "4s" }}
          />
          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="animate-fade-in-down inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-light border border-primary/20 text-primary text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Now connecting players in 50+ cities
            </div>

            {/* Headline */}
            <h1 className="animate-fade-in-up text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Never Play{" "}
              <span className="gradient-text">Alone</span>
              <br />
              Again
            </h1>

            {/* Subheadline */}
            <p className="animate-fade-in-up delay-200 text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
              ArenaLink connects you with nearby players and matches.
              Whether you need teammates or want to join a game — we&apos;ve got you covered.
            </p>

            {/* CTA Buttons */}
            <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                href="/signup"
                className="btn-primary text-lg px-8 py-4"
                id="hero-cta-signup"
              >
                Get Started Free
                <ArrowRightIcon size={20} />
              </Link>
              <a
                href="#how-it-works"
                className="btn-secondary text-lg px-8 py-4"
                id="hero-cta-learn"
              >
                See How It Works
              </a>
            </div>

            {/* Stats */}
            <div className="animate-fade-in-up delay-500 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold gradient-text">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ===================== FEATURES SECTION ===================== */}
      <section id="features" className="section-padding bg-background relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-light text-primary text-sm font-semibold mb-4">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Everything You Need to{" "}
              <span className="gradient-text">Play More</span>
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              From finding matches to building your sports network, ArenaLink
              has all the tools to get you on the field.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass-card-hover p-6 lg:p-8 group"
                id={`feature-card-${index}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-5 transition-transform group-hover:scale-110`}
                >
                  <feature.icon className={feature.color} size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== HOW IT WORKS SECTION ===================== */}
      <section
        id="how-it-works"
        className="section-padding relative overflow-hidden"
      >
        {/* Subtle Background */}
        <div className="absolute inset-0 bg-surface/50" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent-light text-accent text-sm font-semibold mb-4">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Three Steps to{" "}
              <span className="gradient-text-accent">Game Time</span>
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Getting started with ArenaLink is easy. Create, discover, and play
              — it&apos;s that simple.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={step.number} className="relative text-center group">
                {/* Connector Line (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[calc(100%-20%)] h-0.5 bg-gradient-to-r from-primary/30 to-accent/30" />
                )}

                {/* Step Circle */}
                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-surface border-2 border-border group-hover:border-primary transition-all duration-300 mb-6 mx-auto shadow-md group-hover:shadow-glow">
                  <span className="text-4xl">{step.icon}</span>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== SPORTS SECTION ===================== */}
      <section id="sports" className="section-padding bg-background relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-light text-secondary text-sm font-semibold mb-4">
              Sports
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Play Your{" "}
              <span className="gradient-text">Favorite Sport</span>
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              ArenaLink supports a wide range of sports. Pick yours and start
              finding matches today.
            </p>
          </div>

          {/* Sports Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
            {sports.map((sport) => (
              <div
                key={sport.name}
                className="glass-card-hover p-6 text-center group cursor-pointer"
                id={`sport-${sport.name.toLowerCase()}`}
              >
                <div className="flex items-center justify-center mb-4">
                  <sport.icon
                    className={`${sport.color} transition-transform group-hover:scale-125`}
                    size={40}
                  />
                </div>
                <span className="font-semibold text-sm">{sport.name}</span>
              </div>
            ))}
          </div>

          {/* Custom Sport Note */}
          <p className="text-center text-muted text-sm mt-8">
            Don&apos;t see your sport?{" "}
            <span className="text-primary font-medium">
              You can add custom sports too!
            </span>
          </p>
        </div>
      </section>

      {/* ===================== TRUST SECTION ===================== */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-surface/50" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 text-center">
              <ShieldIcon
                className="text-primary mx-auto mb-4"
                size={36}
              />
              <h3 className="text-lg font-bold mb-2">Verified Players</h3>
              <p className="text-muted text-sm leading-relaxed">
                Reliability scores and ratings help you find trustworthy
                teammates every time.
              </p>
            </div>
            <div className="glass-card p-8 text-center">
              <MapPinIcon
                className="text-accent mx-auto mb-4"
                size={36}
              />
              <h3 className="text-lg font-bold mb-2">Hyperlocal</h3>
              <p className="text-muted text-sm leading-relaxed">
                GPS-powered match discovery ensures you only see matches
                happening near you.
              </p>
            </div>
            <div className="glass-card p-8 text-center">
              <ZapIcon
                className="text-secondary mx-auto mb-4"
                size={36}
              />
              <h3 className="text-lg font-bold mb-2">Real-time Updates</h3>
              <p className="text-muted text-sm leading-relaxed">
                Live player counts, instant notifications, and real-time group
                chats keep everyone in sync.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CTA SECTION ===================== */}
      <section className="section-padding relative overflow-hidden" id="cta">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Ready to Find Your{" "}
            <span className="gradient-text">Next Match?</span>
          </h2>
          <p className="text-muted text-lg mb-10 max-w-xl mx-auto">
            Join thousands of players already using ArenaLink to find
            teammates, join matches, and play more sports.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="btn-primary text-lg px-10 py-4"
              id="cta-signup"
            >
              Create Free Account
              <ArrowRightIcon size={20} />
            </Link>
            <Link
              href="/login"
              className="btn-secondary text-lg px-10 py-4"
              id="cta-login"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="border-t border-border bg-surface/50" id="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <Image src="/arenalink_logo.svg" alt="ArenaLink Logo" width={36} height={36} className="rounded-full object-cover" />
                <span className="text-xl font-bold tracking-tight">
                  Arena
                  <span className="gradient-text">Link</span>
                </span>
              </div>
              <p className="text-muted text-sm leading-relaxed">
                Connecting sports enthusiasts. Find players, join matches, and
                build your local sports community.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
                Product
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href="#features"
                    className="text-muted hover:text-foreground text-sm transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-muted hover:text-foreground text-sm transition-colors"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#sports"
                    className="text-muted hover:text-foreground text-sm transition-colors"
                  >
                    Supported Sports
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
                Company
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/about" className="text-muted hover:text-foreground text-sm transition-colors">About Us</Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted hover:text-foreground text-sm transition-colors">Contact</Link>
                </li>
                <li>
                  <span className="text-muted text-sm">Careers</span>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
                Legal
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/privacy" className="text-muted hover:text-foreground text-sm transition-colors">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted hover:text-foreground text-sm transition-colors">Terms of Service</Link>
                </li>
                <li>
                  <Link href="/refund" className="text-muted hover:text-foreground text-sm transition-colors">Refund Policy</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} ArenaLink. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground text-sm">
                Made with ❤️ for sports lovers
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
