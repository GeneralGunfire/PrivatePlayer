import Link from "next/link";
import { PLAYLISTS } from "@/lib/playlists";

export default function Browse() {
  return (
    <div className="px-5 pt-8 pb-6 max-w-xl mx-auto">
      <h1 className="text-[26px] font-black text-white mb-6">Browse</h1>
      <div className="grid grid-cols-2 gap-3">
        {PLAYLISTS.map(pl => (
          <Link
            key={pl.id}
            href={`/playlist/${pl.id}`}
            className="relative rounded-2xl overflow-hidden aspect-square"
            style={{ background: `linear-gradient(135deg, ${pl.color}cc, ${pl.color}44)` }}
          >
            <img
              src={pl.cover}
              alt={pl.name}
              className="absolute bottom-0 right-0 w-2/3 h-2/3 object-cover rounded-tl-2xl opacity-60"
            />
            <div className="absolute inset-0 p-4 flex flex-col justify-start">
              <span className="text-[16px] font-bold text-white leading-tight">{pl.name}</span>
              <span className="text-[11px] text-white/60 mt-1">{pl.description}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
