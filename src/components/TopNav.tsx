"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Library, Disc3 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/search",  icon: Search,  label: "Search"  },
  { href: "/library", icon: Library, label: "Library" },
  { href: "/dj",       icon: Disc3,   label: "DJ"       },
];

const TAP = { type: "spring" as const, damping: 14, stiffness: 500, mass: 0.4 };

/**
 * Fixed top strip — brand mark on the left, tabs on the right. Replaces
 * the old floating bottom pill (glass, centered, all 4 destinations as
 * equal icons) per explicit direction that its shape/position, not just
 * its color, needed to change. A top strip is also the one nav shape
 * that doesn't compete for space with the mini-player, which already
 * anchors the bottom of the screen.
 *
 * Home isn't a tab here — the brand mark itself is the way back to Home,
 * same pattern as most single-purpose apps' logo-as-home convention,
 * which trims the tab row to the 3 destinations that actually need
 * discovery (you already know how to get back to the start).
 */
export default function TopNav() {
  const path = usePathname();

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 border-b border-white/8 bg-ink/90 backdrop-blur-sm"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="max-w-2xl mx-auto px-6 h-14 md:h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-white" />
          <span className="text-xs font-black uppercase tracking-[0.3em] text-white/90">Player</span>
        </Link>

        <nav className="flex items-center gap-1">
          {ITEMS.map(({ href, icon: Icon, label }) => {
            const active = path.startsWith(href);
            return (
              <Link key={href} href={href} className="relative">
                <motion.div
                  whileTap={{ scale: 0.88 }}
                  transition={TAP}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-colors",
                    active ? "text-white" : "text-white/40 hover:text-white/70",
                  )}
                >
                  <Icon size={15} strokeWidth={active ? 2.4 : 2} />
                  <span className="hidden sm:inline">{label}</span>
                </motion.div>
                {active && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute left-3 right-3 -bottom-[1px] h-[2px] rounded-full bg-white"
                    transition={{ type: "spring", damping: 22, stiffness: 380 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
