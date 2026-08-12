import { getUserProfile, getUserStats } from "@/lib/actions/user";
import { redirect } from "next/navigation";
import Link from "next/link";

const SPORT_EMOJIS: Record<string, string> = {
  football: "⚽",
  cricket: "🏏",
  basketball: "🏀",
  volleyball: "🏐",
  tennis: "🎾",
  badminton: "🏸",
};

export default async function ProfilePage() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect("/login");
  }

  const userStats = await getUserStats(profile.id);

  const joinedDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  
  const rating = profile.rating > 0 ? profile.rating.toFixed(1) : "—";
  const reliability = profile.reliabilityScore;

  return (
    <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center animate-fade-in-up pb-12 pt-8">
      {/* Avatar Section */}
      <div className="relative mb-6">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 glow-green border-[3px] border-secondary bg-surface-container-low overflow-hidden">
          {profile.image ? (
            <img 
              className="w-full h-full object-cover rounded-full" 
              alt={profile.name} 
              src={profile.image} 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold text-5xl bg-surface text-primary rounded-full">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-secondary text-on-secondary px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-lg whitespace-nowrap">
          {profile.skillLevel || "Available"}
        </div>
      </div>
      
      {/* Identity Section */}
      <div className="text-center mb-8">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1 uppercase">{profile.name}</h2>
        <p className="font-body-md text-on-surface-variant opacity-80">
          {profile.username ? `@${profile.username}` : `Joined ${joinedDate}`}
        </p>
        {profile.city && (
          <div className="flex items-center justify-center gap-1 mt-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">location_on</span>
            <span className="font-label-sm">{profile.city}</span>
          </div>
        )}
      </div>

      {/* Bio */}
      {profile.bio && (
        <p className="text-center text-on-surface-variant mb-8 max-w-md px-4 leading-relaxed">
          {profile.bio}
        </p>
      )}

      {/* Tags Section */}
      {profile.sportsInterests.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {profile.sportsInterests.map((sport) => (
            <span key={sport} className="px-4 py-1.5 bg-surface-container-high text-on-surface rounded-full font-label-md text-label-md border border-outline-variant/30 flex items-center gap-2">
              {SPORT_EMOJIS[sport.toLowerCase()] || "🎯"}
              {sport.charAt(0).toUpperCase() + sport.slice(1)}
            </span>
          ))}
        </div>
      )}

      {/* Stats Row */}
      <div className="glass-panel w-full rounded-2xl p-6 flex justify-around items-center mb-10">
        <div className="text-center">
          <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1">Match Rating</p>
          <div className="flex items-center justify-center gap-1">
            <span className="font-headline-md text-headline-md text-secondary">{rating}</span>
            <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          </div>
        </div>
        
        <div className="w-[1px] h-10 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
        
        <div className="text-center">
          <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1">Reliability</p>
          <p className="font-headline-md text-headline-md text-primary">{reliability}%</p>
        </div>
        
        <div className="w-[1px] h-10 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
        
        <div className="text-center">
          <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1">Matches</p>
          <p className="font-headline-md text-headline-md text-on-surface">{userStats?.totalMatchesPlayed || 0}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col gap-4">
        <Link href="/profile/edit" className="w-full py-4 bg-primary-container text-white font-label-md text-label-md uppercase tracking-widest rounded-xl glow-purple text-center active:scale-95 transition-all duration-150">
          Edit Profile
        </Link>
        <button className="w-full py-4 bg-transparent border-2 border-outline-variant/30 text-on-surface font-label-md text-label-md uppercase tracking-widest rounded-xl hover:bg-surface-bright active:scale-95 transition-all duration-150">
          Settings
        </button>
      </div>

      {/* Recent Highlights (Bento Grid Style) */}
      <div className="w-full mt-12 mb-8">
        <h3 className="font-headline-md text-headline-md text-on-surface mb-6 px-2">RECENT ACTIVITY</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 h-40 glass-panel rounded-2xl relative overflow-hidden group">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAeHieROdIW8epH7NXm1JIThPJALghXUOCBfXhg119R42_v42F1AkPvcqLcg_dlzhtR95c5_QkWbu16VpK4mdcrXZJwu_R9yktR3TBHX87DMyPorPIJ7xIFN8XB9_U2_jOfQg6yr-g_iKSmew8cBxiWzyTJUEMMq6jfxbGjXYgjkwSBOegjqZi2BSXkP2m8FeZDw7N96sNdJfQtg1FXcF4y-Emj24gOmWg6uTb6xZ6YudZVeQCcxw2i5U-Nf8qYErkTGYVnpxDw2cti')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-80"></div>
            <div className="absolute bottom-4 left-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1 block">Last Match</span>
              <p className="font-body-md font-bold text-white">Sunday Night League • Won 3-1</p>
            </div>
          </div>
          
          <div className="h-40 glass-panel rounded-2xl flex flex-col items-center justify-center p-4 text-center">
            <span className="material-symbols-outlined text-primary text-3xl mb-2">emoji_events</span>
            <p className="font-label-sm text-outline uppercase mb-1">MVP Count</p>
            <p className="font-headline-md text-on-surface">12</p>
          </div>
          
          <div className="h-40 glass-panel rounded-2xl flex flex-col items-center justify-center p-4 text-center">
            <span className="material-symbols-outlined text-secondary text-3xl mb-2">trending_up</span>
            <p className="font-label-sm text-outline uppercase mb-1">Win Streak</p>
            <p className="font-headline-md text-on-surface">5</p>
          </div>
        </div>
      </div>
    </div>
  );
}
