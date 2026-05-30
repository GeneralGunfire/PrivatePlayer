import { PLAYLISTS } from "@/lib/playlists";
import Link from "next/link";

export default function Profile() {
  return (
    <div className="px-5 pt-8 pb-6 max-w-xl mx-auto">
      {/* Avatar + name */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] flex items-center justify-center text-2xl font-black text-white shrink-0">
          P
        </div>
        <div>
          <p className="text-[20px] font-bold text-white">PrivatePlayer</p>
          <p className="text-[12px] text-white/40 mt-0.5">Personal collection</p>
        </div>
      </div>

      {/* Favourite playlists */}
      <h2 className="text-[15px] font-bold text-white mb-3">Playlists</h2>
      <div className="grid grid-cols-3 gap-2 mb-8">
        {PLAYLISTS.slice(0, 6).map(pl => (
          <Link key={pl.id} href={`/playlist/${pl.id}`} className="flex flex-col gap-1.5">
            <div className="aspect-square rounded-xl overflow-hidden bg-white/5">
              <img src={pl.cover} alt={pl.name} className="w-full h-full object-cover" />
            </div>
            <p className="text-[11px] text-white/60 truncate text-center">{pl.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
