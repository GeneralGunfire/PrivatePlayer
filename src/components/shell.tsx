"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Music2, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlayer } from "@/lib/player-context";
import { PLAYLISTS } from "@/lib/playlists";
import MiniPlayer from "@/components/mini-player";

/* ── Bottom tab definition ── */
const TABS = [
  { href: "/",        icon: Home,   label: "Home"    },
  { href: "/browse",  icon: Music2, label: "Browse"  },
  { href: "/liked",   icon: Heart,  label: "Liked"   },
  { href: "/profile", icon: User,   label: "Profile" },
];

/* ── Sidebar link (desktop) ── */
function SideLink({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
  const path = usePathname();
  const active = href === "/" ? path === "/" : path.startsWith(href);
  return (
    <Link href={href} className={cn(
      "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
      active ? "bg-white/10 text-white" : "text-white/40 hover:text-white/80 hover:bg-white/5"
    )}>
      <Icon className="w-4 h-4 shrink-0" />
      {label}
    </Link>
  );
}

export default function Shell({ children }: { children: React.ReactNode }) {
  const { activeTrack } = usePlayer();
  const path = usePathname();
  const isNowPlaying = path === "/now-playing";

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[#0d0d0d]">

      {/* ══ Desktop sidebar ══ */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 bg-black/60 border-r border-white/[0.06] h-full">
        {/* Wordmark */}
        <div className="px-6 py-7">
          <span className="text-[17px] font-black tracking-tight">
            Private<span className="text-[#a78bfa]">Player</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="px-3 space-y-0.5">
          {TABS.map(t => <SideLink key={t.href} {...t} />)}
        </nav>

        {/* Playlist list */}
        <div className="mt-6 px-6 flex-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/25 mb-3 font-semibold">
            Playlists
          </p>
          <PlaylistLinks />
        </div>
      </aside>

      {/* ══ Main content ══ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto" id="main-scroll">
          {children}
        </main>

        {/* Mini player — shown when a track is active, hidden on now-playing page */}
        {activeTrack && !isNowPlaying && <MiniPlayer />}

        {/* ══ Mobile bottom nav ══ */}
        <nav className={cn(
          "md:hidden flex items-center bg-[#0d0d0d] border-t border-white/[0.06] pb-safe",
          isNowPlaying && "hidden"
        )}>
          {TABS.map(({ href, icon: Icon, label }) => {
            const active = href === "/" ? path === "/" : path.startsWith(href);
            return (
              <Link key={href} href={href} className="flex flex-col items-center justify-center flex-1 pt-3 pb-1 gap-1">
                <Icon className={cn("w-5 h-5 transition-colors", active ? "text-white" : "text-white/30")} />
                <span className={cn("text-[9px] font-medium tracking-wide transition-colors", active ? "text-white" : "text-white/30")}>
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

    </div>
  );
}

/* ── Playlist links for sidebar ── */
function PlaylistLinks() {
  const path = usePathname();
  return (
    <ul className="space-y-0.5">
      {PLAYLISTS.map((pl) => (
        <li key={pl.id}>
          <Link href={`/playlist/${pl.id}`} className={cn(
            "block text-[13px] py-1.5 px-2 rounded-lg truncate transition-colors",
            path === `/playlist/${pl.id}` ? "text-white font-medium" : "text-white/35 hover:text-white/70"
          )}>
            {pl.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
