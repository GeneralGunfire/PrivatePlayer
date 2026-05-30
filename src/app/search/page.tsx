import Link from "next/link";
import { PLAYLISTS } from "@/lib/playlists";

export default function Search() {
  return (
    <div className="px-5 md:px-8 pt-8 pb-32 md:pb-10 max-w-5xl mx-auto">
      <h1 className="text-2xl font-black text-white mb-6">Browse</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {PLAYLISTS.map(pl => (
          <Link key={pl.id} href={`/playlist/${pl.id}`}
            className="relative rounded-lg overflow-hidden aspect-square"
            style={{ background: `linear-gradient(135deg, ${pl.color}, ${pl.color}66)` }}
          >
            <img src={pl.cover} alt={pl.name} className="absolute bottom-0 right-0 w-3/4 h-3/4 object-cover rounded-tl-md opacity-70 translate-x-2 translate-y-2" />
            <span className="absolute top-3 left-3 font-bold text-white text-[15px] leading-tight">{pl.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
