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

export default function BottomNav() {
  const path = usePathname();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md" style={{ zIndex: 60 }}>
      <nav className="glass rounded-full px-6 py-3 flex items-center justify-between">
        {ITEMS.map(({ href, icon: Icon, label }) => {
          const active = href === "/" ? path === "/" : path.startsWith(href);
          return (
            <Link key={href} href={href} className="relative flex flex-col items-center gap-1 group">
              <div className={cn(
                "p-2 rounded-full transition-all duration-300",
                active ? "bg-white text-black" : "text-white/50 group-hover:text-white"
              )}>
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              </div>
              {active && (
                <motion.div
                  layoutId="active-dot"
                  className="absolute -bottom-1 w-1 h-1 bg-white rounded-full"
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
