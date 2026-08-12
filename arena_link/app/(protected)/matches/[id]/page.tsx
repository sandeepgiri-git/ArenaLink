import { notFound } from "next/navigation";
import { getMatchById } from "@/lib/actions/match";
import { getMatchRequests, getUserRequestForMatch } from "@/lib/actions/joinRequest";
import { auth } from "@/auth";
import Link from "next/link";
import HostRequestManager from "@/components/matches/HostRequestManager";
import JoinMatchButton from "@/components/matches/JoinMatchButton";
import MatchChat from "@/components/matches/MatchChat";
import { getMatchMessages } from "@/lib/actions/chat";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const match = await getMatchById(id);

  if (!match) {
    return { title: "Match Not Found - ArenaLink" };
  }

  return {
    title: `${match.title} | ArenaLink`,
    description: `Join ${match.host.name}'s ${match.sport} match on ${match.date} at ${match.time}.`,
  };
}

export default async function MatchDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const userId = session?.user?.id;

  const match = await getMatchById(id);

  if (!match) {
    notFound();
  }

  const isHost = userId === match.host.id;
  const isJoined = match.playersJoined.some((p) => p.id === userId);
  const spotsLeft = match.playersNeeded - match.playersJoinedCount;
  const isFull = spotsLeft <= 0;

  let hostRequests: any[] = [];
  let userRequestStatus = null;

  if (isHost) {
    hostRequests = await getMatchRequests(id);
  } else if (userId && !isJoined) {
    const userRequest = await getUserRequestForMatch(id);
    userRequestStatus = userRequest?.status || null;
  } else if (isJoined) {
    userRequestStatus = "accepted";
  }

  let initialMessages: any[] = [];
  if ((isHost || isJoined) && userId) {
    initialMessages = await getMatchMessages(id);
  }

  const matchDate = new Date(match.date);
  const formattedDate = matchDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 animate-fade-in-up">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:items-start">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Match Title */}
            <section>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-primary-container text-on-primary-container font-label-sm text-label-sm px-3 py-1 rounded-full uppercase tracking-wider">
                  {match.sport}
                </span>
                <span className="bg-secondary-container text-on-secondary-container font-label-sm text-label-sm px-3 py-1 rounded-full uppercase tracking-wider">
                  {match.skillLevelRequired === "any" ? "Casual" : match.skillLevelRequired} Level
                </span>
              </div>
              <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary uppercase leading-none mb-4">
                {match.title}
              </h1>
              <div className="flex items-center gap-4 text-outline">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">groups</span>
                  <span className="font-label-md text-label-md uppercase">{match.playersNeeded} Players Max</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  <span className="font-label-md text-label-md uppercase">{match.location}</span>
                </div>
              </div>
            </section>

            {/* Stylized Dark Map Placeholder */}
            {match.coordinates && match.coordinates.length === 2 && (
              <section className="relative rounded-xl overflow-hidden aspect-video group">
                <div className="absolute inset-0 bg-gradient-to-t from-surface-dim to-transparent z-10 pointer-events-none"></div>
                <div 
                  className="w-full h-full bg-surface-container-high transition-transform duration-700 group-hover:scale-105 bg-cover bg-center" 
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDN6CcfSVaVQxC6cYELM9n_BR8u8nFc9d20W4BuqdpHGuB6YHRWhtuUBO0UdpgN6No0-vKFTOsD8TEwwypEg5C-bOzwuOUmtUspOEExTTPIoQ7TJnFFvG8Gt16Q7nstTbKFPLV47vyfnPEIVnJ70zOGsck9_vS8-TU6kz3zzyoHw_fnLC1HJ3octbaoCR8vYox2on-GJYAlKLUochwAoYS6yuYAA8whe7A-Zqp1v8P6Ym_JiktcgMuFJItXXNkODeFnPfNAUt_rpyuK')" }}
                ></div>
                <div className="absolute bottom-6 left-6 z-20">
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${match.coordinates[1]},${match.coordinates[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-surface-bright/90 backdrop-blur-md text-on-surface font-label-md text-label-md px-6 py-3 rounded-full border border-white/10 hover:bg-primary hover:text-on-primary transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">directions_run</span>
                    GET DIRECTIONS
                  </a>
                </div>
              </section>
            )}

            {/* Description */}
            <section className="space-y-4">
              <h3 className="font-headline-md text-headline-md text-on-surface border-b border-outline-variant pb-2">MATCH DESCRIPTION</h3>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                {match.description || "No description provided by the host."}
              </p>
            </section>

            {/* Roster */}
            <section className="space-y-6">
              <div className="flex justify-between items-end border-b border-outline-variant pb-2">
                <h3 className="font-headline-md text-headline-md text-on-surface">ROSTER ({match.playersJoinedCount}/{match.playersNeeded})</h3>
                <span className="font-label-md text-label-md text-primary">{spotsLeft > 0 ? `${spotsLeft} SPOTS REMAINING` : "MATCH FULL"}</span>
              </div>
              
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {match.playersJoined.map((player) => (
                  <Link href={`/profile/${player.id}`} key={player.id} className="flex flex-col items-center gap-2 group">
                    <div className="w-16 h-16 rounded-full border border-outline-variant overflow-hidden bg-surface-container group-hover:border-primary transition-colors">
                      {player.image ? (
                        <img className="w-full h-full object-cover" src={player.image} alt={player.name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-xl">{player.name.charAt(0)}</div>
                      )}
                    </div>
                    <span className="font-label-sm text-label-sm text-center truncate w-full group-hover:text-primary transition-colors">{player.name.split(" ")[0]}</span>
                  </Link>
                ))}
                
                {Array.from({ length: Math.min(10, spotsLeft) }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-outline-variant flex items-center justify-center bg-surface-container-low">
                      <span className="material-symbols-outlined text-outline">add</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-outline">Open</span>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Host Section */}
            <section className="space-y-4 pt-4 border-t border-outline-variant">
              <h3 className="font-headline-md text-headline-md text-on-surface">MATCH HOST</h3>
              <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  {match.host.image ? (
                    <img className="w-full h-full object-cover" src={match.host.image} alt={match.host.name} />
                  ) : (
                    <div className="w-full h-full bg-surface-container-high flex items-center justify-center font-bold text-xl text-primary">{match.host.name.charAt(0)}</div>
                  )}
                </div>
                <div>
                  <h4 className="font-headline-md text-on-surface">{match.host.name}</h4>
                  <Link href={`/profile/${match.host.id}`} className="text-primary font-label-sm text-label-sm hover:underline">View Profile</Link>
                </div>
              </div>
            </section>

            {/* Group Chat */}
            {(isHost || isJoined) && userId && (
              <div className="mt-8 pt-8 border-t border-outline-variant">
                <MatchChat matchId={id} initialMessages={initialMessages} currentUserId={userId} isCompleted={match.status === "completed"} />
              </div>
            )}
          </div>

          {/* Right Column: Sticky Action Panel */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="glass-panel p-6 rounded-2xl space-y-6 shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary border border-white/5 transition-transform group-hover:scale-110">
                    <span className="material-symbols-outlined">calendar_today</span>
                  </div>
                  <div>
                    <p className="font-label-sm text-label-sm text-outline uppercase tracking-widest">Date</p>
                    <p className="font-headline-md text-headline-md">{formattedDate}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary border border-white/5 transition-transform group-hover:scale-110">
                    <span className="material-symbols-outlined">schedule</span>
                  </div>
                  <div>
                    <p className="font-label-sm text-label-sm text-outline uppercase tracking-widest">Time</p>
                    <p className="font-headline-md text-headline-md">{match.time}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-secondary border border-white/5 transition-transform group-hover:scale-110">
                    <span className="material-symbols-outlined">payments</span>
                  </div>
                  <div>
                    <p className="font-label-sm text-label-sm text-outline uppercase tracking-widest">Cost</p>
                    <p className="font-headline-lg text-headline-lg text-secondary">
                      {match.costPerPlayer === 0 ? "Free" : `₹${match.costPerPlayer}`}
                    </p>
                  </div>
                </div>
              </div>
              
              {isHost && (
                <div className="pt-4 border-t border-outline-variant space-y-4">
                  <h4 className="font-bold text-primary mb-2 uppercase text-sm tracking-widest">Host Controls</h4>
                  <HostRequestManager matchId={id} initialRequests={hostRequests} />
                </div>
              )}
            </div>
          </aside>
          
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      {!isHost && match.status !== "completed" && (
        <JoinMatchButton 
          matchId={id} 
          initialStatus={userRequestStatus as "pending" | "accepted" | "rejected" | null}
          isFull={isFull}
        />
      )}
    </>
  );
}
