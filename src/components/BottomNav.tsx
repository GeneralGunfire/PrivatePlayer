"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Library } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/",        icon: Home,    label: "Home"    },
  { href: "/search",  icon: Search,  label: "Search"  },
  { href: "/library", icon: Library, label: "Library" },
];

const TAP = { type: "spring" as const, damping: 14, stiffness: 500, mass: 0.4 };

export default function BottomNav() {
  const path = usePathname();

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 w-[90%] max-w-md"
      style={{ zIndex: 60, bottom: "calc(16px + env(safe-area-inset-bottom, 0px))" }}
    >
      <nav className="glass rounded-full px-6 py-3 flex items-center justify-between">
        {ITEMS.map(({ href, icon: Icon, label }) => {
          const active = href === "/" ? path === "/" : path.startsWith(href);
          return (
            <motion.div key={href} whileTap={{ scale: 0.84 }} transition={TAP}>
              <Link href={href} className="relative flex flex-col items-center gap-1 group">
                <div className={cn(
                  "p-2.5 rounded-full transition-all duration-200",
                  active
                    ? "bg-white text-black shadow-[0_0_16px_rgba(255,255,255,0.2)]"
                    : "text-white/40 group-hover:text-white/70 group-hover:bg-white/8"
                )}>
                  <Icon size={19} strokeWidth={active ? 2.5 : 2} />
                </div>
                {active && (
                  <motion.div
                    layoutId="nav-dot"
                    className="absolute -bottom-0.5 w-1 h-1 bg-white rounded-full"
                    transition={{ type: "spring", damping: 20, stiffness: 400 }}
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </div>
  );
}
