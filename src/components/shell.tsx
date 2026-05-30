"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Music2, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlayer } from "@/lib/player-context";
import { PLAYLISTS } from "@/lib/playlists";
import MiniPlayer from "@/components/mini-player";

/* Image 2 bottom nav: 4 icons, no labels, active = white */
const TABS = [
  { href: "/",        icon: Home,   activeIcon: Home   },
  { href: "/browse",  icon: Music2, activeIcon: Music2 },
  { href: "/liked",   icon: Heart,  activeIcon: Heart  },
  { href: "/profile", icon: User,   activeIcon: User   },
];

function SideLink({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
  const path = usePathname();
  const active = href === "/" ? path === "/" : path.startsWith(href);
  return (
    <Link href={href} className={cn(
      "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
      active ? "bg-white/10 text-white" : "text-white/35 hover:text-white/70 hover:bg-white/5"
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
    <div className="flex h-[100dvh] overflow-hidden bg-[#080c14]">

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 bg-black/50 border-r border-white/[0.05] h-full">
        <div className="px-6 py-7">
          <span className="text-[17px] font-black tracking-tight">
            Private<span className="text-[#6c8fff]">Player</span>
          </span>
        </div>
        <nav className="px-3 space-y-0.5">
          {TABS.map(t => <SideLink key={t.href} href={t.href} icon={t.icon} label={t.href === "/" ? "Home" : t.href.slice(1).charAt(0).toUpperCase() + t.href.slice(2)} />)}
        </nav>
        <div className="mt-6 px-5 flex-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/20 mb-3 font-semibold">Playlists</p>
          <ul className="space-y-0.5">
            {PLAYLISTS.map(pl => (
              <li key={pl.id}>
                <Link href={`/playlist/${pl.id}`} className={cn(
                  "block text-[13px] py-1.5 px-2 rounded-lg truncate transition-colors",
                  path === `/playlist/${pl.id}` ? "text-white font-medium" : "text-white/30 hover:text-white/65"
                )}>
                  {pl.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto" id="main-scroll">
          {children}
        </main>

        {/* Mini player sits above bottom nav */}
        {activeTrack && !isNowPlaying && <MiniPlayer />}

        {/* ── Bottom nav — image 2 exact ── */}
        {!isNowPlaying && (
          <nav className="md:hidden flex items-center justify-around bg-[#0d1120] border-t border-white/[0.06] pb-safe">
            {TABS.map(({ href, icon: Icon }) => {
              const active = href === "/" ? path === "/" : path.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-center flex-1 py-4"
                >
                  <Icon
                    className={cn(
                      "w-6 h-6 transition-all",
                      active
                        ? "text-white fill-white stroke-white"
                        : "text-white/30 fill-none"
                    )}
                    strokeWidth={active ? 2.5 : 1.8}
                  />
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
}
