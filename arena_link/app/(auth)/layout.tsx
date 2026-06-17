import Link from "next/link";
import {
  FootballIcon,
  BasketballIcon,
  TennisIcon,
} from "@/components/icons/SportIcons";
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
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-gradient-to-br from-[#0a0f1a] via-[#111827] to-[#0a0f1a]">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-accent/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-2/3 left-1/3 w-48 h-48 bg-secondary/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        />

        {/* Floating Sport Icons */}
        <div
          className="absolute top-[20%] left-[15%] opacity-10 animate-float"
          style={{ animationDelay: "1s" }}
        >
          <FootballIcon size={64} className="text-white" />
        </div>
        <div
          className="absolute bottom-[25%] right-[15%] opacity-10 animate-float"
          style={{ animationDelay: "3s" }}
        >
          <BasketballIcon size={56} className="text-white" />
        </div>
        <div
          className="absolute top-[60%] left-[70%] opacity-10 animate-float"
          style={{ animationDelay: "5s" }}
        >
          <TennisIcon size={48} className="text-white" />
        </div>

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-12 max-w-lg text-center">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2.5 mb-10 group">
            <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="text-primary-foreground font-bold text-xl">
                A
              </span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Arena
              <span className="text-primary">Link</span>
            </span>
          </Link>

          <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-4">
            Never Play{" "}
            <span className="text-primary">Alone</span>{" "}
            Again
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            Connect with nearby players, join exciting matches, and build your
            sports community — all in one place.
          </p>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div>
              <span className="block text-2xl font-bold text-white">10K+</span>
              Players
            </div>
            <div className="w-px h-10 bg-gray-700" />
            <div>
              <span className="block text-2xl font-bold text-white">5K+</span>
              Matches
            </div>
            <div className="w-px h-10 bg-gray-700" />
            <div>
              <span className="block text-2xl font-bold text-white">50+</span>
              Cities
            </div>
          </div>
        </div>
      </div>

      {/* Right Side — Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Mobile Logo (visible on small screens) */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  A
                </span>
              </div>
              <span className="text-xl font-bold tracking-tight">
                Arena
                <span className="gradient-text">Link</span>
              </span>
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
