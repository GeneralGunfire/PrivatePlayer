"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Library, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import PlayerBar from "@/components/player-bar";
import { PLAYLISTS } from "@/lib/playlists";

// ── Sidebar nav item ─────────────────────────────────────
const SideLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) => {
  const path = usePathname();
  const active = href === "/" ? path === "/" : path.startsWith(href);
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-100",
        active ? "bg-white/10 text-white" : "text-white/50 hover:text-white hover:bg-white/5"
      )}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {label}
    </Link>
  );
};

// ── Mobile bottom tab ─────────────────────────────────────
const TabLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) => {
  const path = usePathname();
  const active = href === "/" ? path === "/" : path.startsWith(href);
  return (
    <Link href={href} className="flex flex-col items-center gap-1 flex-1 py-2">
      <Icon className={cn("w-5 h-5 transition-colors", active ? "text-white" : "text-white/40")} />
      <span className={cn("text-[10px] font-medium transition-colors", active ? "text-white" : "text-white/40")}>
        {label}
      </span>
    </Link>
  );
};

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">

      {/* ── Sidebar (desktop only) ── */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 bg-black h-full overflow-y-auto">
        {/* Logo */}
        <div className="px-5 py-6">
          <span className="text-lg font-black tracking-tight text-white">Private<span className="text-[#1ed760]">Player</span></span>
        </div>

        {/* Nav */}
        <nav className="px-2 space-y-0.5">
          <SideLink href="/"         label="Home"    icon={Home}    />
          <SideLink href="/search"   label="Search"  icon={Search}  />
          <SideLink href="/library"  label="Library" icon={Library} />
        </nav>

        {/* Playlists */}
        <div className="mt-6 px-5 pb-2">
          <p className="text-[10px] uppercase tracking-[0.15em] text-white/30 mb-3 font-semibold">Playlists</p>
          <ul className="space-y-0.5">
            {PLAYLISTS.map(pl => (
              <li key={pl.id}>
                <Link
                  href={`/playlist/${pl.id}`}
                  className="block text-[13px] text-white/50 hover:text-white py-1.5 px-2 rounded-md hover:bg-white/5 transition-colors truncate"
                >
                  {pl.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* ── Main scrollable area ── */}
      <main className="flex-1 overflow-y-auto bg-[#0a0a0a]" id="main-scroll">
        {children}
      </main>

      {/* ── Player bar ── */}
      <PlayerBar />

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0a0a0a] border-t border-white/[0.07] flex items-center safe-area-inset-bottom">
        <TabLink href="/"        label="Home"    icon={Home}    />
        <TabLink href="/search"  label="Search"  icon={Search}  />
        <TabLink href="/library" label="Library" icon={Library} />
      </nav>

    </div>
  );
}
