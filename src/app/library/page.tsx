import Link from "next/link";
import { PLAYLISTS } from "@/lib/playlists";

export default function Library() {
  return (
    <div className="px-5 md:px-8 pt-8 pb-32 md:pb-10 max-w-5xl mx-auto">
      <h1 className="text-2xl font-black text-white mb-6">Your Library</h1>
      <div className="space-y-1">
        {PLAYLISTS.map(pl => (
          <Link key={pl.id} href={`/playlist/${pl.id}`}
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/5 transition-colors"
          >
            <img src={pl.cover} alt={pl.name} className="w-12 h-12 rounded object-cover shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{pl.name}</p>
              <p className="text-xs text-white/40 truncate mt-0.5">{pl.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
