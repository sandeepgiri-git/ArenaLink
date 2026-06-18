import Navbar from "@/components/ui/Navbar";
import Link from "next/link";
import { UsersIcon, ZapIcon, ShieldIcon } from "@/components/icons/SportIcons";

export default function AboutUs() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              About <span className="gradient-text">ArenaLink</span>
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              We&apos;re building the ultimate sports community. Our mission is to connect players, teams, and sports enthusiasts everywhere.
            </p>
          </div>

          <div className="glass-card p-8 sm:p-12 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Our Story</h2>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-muted-foreground space-y-4">
              <p>
                ArenaLink was founded with a simple idea: it should be easy to find people to play sports with. Whether you&apos;re looking for a quick pick-up game of basketball, a tennis partner, or enough players to field a full football team, we saw that organizing local sports was harder than it needed to be.
              </p>
              <p>
                Created by Sandeep Giri, ArenaLink bridges the gap between digital convenience and physical activity. We provide a platform where you can instantly discover matches happening near you, join teams, and build your reputation on the field.
              </p>
              <p>
                We believe that sports have the power to bring communities together, foster friendships, and promote a healthier lifestyle. ArenaLink is here to make that happen, one match at a time.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
                <UsersIcon size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Community First</h3>
              <p className="text-sm text-muted-foreground">
                We prioritize building local, active, and welcoming sports communities everywhere we go.
              </p>
            </div>

            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 mx-auto bg-accent/10 rounded-xl flex items-center justify-center mb-4 text-accent">
                <ZapIcon size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Instant Play</h3>
              <p className="text-sm text-muted-foreground">
                No more waiting around. Find a match, send a request, and get on the field faster.
              </p>
            </div>

            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 mx-auto bg-secondary/10 rounded-xl flex items-center justify-center mb-4 text-secondary">
                <ShieldIcon size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Safe &amp; Verified</h3>
              <p className="text-sm text-muted-foreground">
                With real user ratings and verified profiles, you can play with confidence.
              </p>
            </div>
          </div>

          <div className="text-center mt-12 pt-8 border-t border-border">
            <Link href="/" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
              Join the Community
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
