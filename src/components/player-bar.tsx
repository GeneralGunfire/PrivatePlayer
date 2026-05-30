"use client";

import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, VolumeX } from "lucide-react";
import { usePlayer } from "@/lib/player-context";
import { cn } from "@/lib/utils";

const fmt = (s = 0) => isFinite(s)
  ? `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`
  : "0:00";

const Rail = ({ value, onChange, accent }: { value: number; onChange: (v: number) => void; accent?: boolean }) => (
  <div
    className="relative h-1 w-full rounded-full cursor-pointer group"
    style={{ background: "rgba(255,255,255,0.1)" }}
    onClick={e => {
      const r = e.currentTarget.getBoundingClientRect();
      onChange(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)));
    }}
  >
    <div
      className="absolute inset-y-0 left-0 rounded-full transition-colors group-hover:brightness-110"
      style={{ width: `${value}%`, background: accent ? "#1ed760" : "rgba(255,255,255,0.6)" }}
    />
    <div
      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
      style={{ left: `calc(${value}% - 6px)` }}
    />
  </div>
);

const Btn = ({
  onClick, title, active, accent, lg, children, className,
}: {
  onClick: () => void; title?: string; active?: boolean; accent?: boolean; lg?: boolean; children: React.ReactNode; className?: string;
}) => (
  <button
    onClick={onClick}
    title={title}
    className={cn(
      "flex items-center justify-center rounded-full transition-all shrink-0 active:scale-90",
      lg  ? "w-10 h-10" : "w-7 h-7",
      accent
        ? "bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-105"
        : active
          ? "text-[#1ed760] hover:text-[#23ff6e]"
          : "text-white/50 hover:text-white"
    )}
  >
    {children}
  </button>
);

export default function PlayerBar() {
  const {
    activeTrack, playing, toggle, next, prev,
    shuffle, toggleShuffle, repeat, toggleRepeat,
    progress, currentTime, duration,
    seekTo, volume, setVolume, muted, toggleMute,
  } = usePlayer();

  if (!activeTrack) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 md:bottom-0
                    md:border-t md:border-white/[0.07] bg-[#181818]
                    mb-14 md:mb-0">

      {/* Hairline progress at very top */}
      <Rail value={progress} onChange={seekTo} accent />

      <div className="flex items-center gap-2 px-3 md:px-5 py-2.5 md:py-3">

        {/* Track info */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1 md:w-55 md:flex-none">
          {activeTrack.image && (
            <img
              src={activeTrack.image}
              alt={activeTrack.album}
              className="w-10 h-10 rounded shrink-0 object-cover"
            />
          )}
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-white truncate leading-snug">{activeTrack.album}</p>
            <p className="text-[11px] text-white/45 truncate mt-px">{activeTrack.artist}</p>
          </div>
        </div>

        {/* Transport — centred */}
        <div className="flex flex-col items-center gap-1.5 flex-1">
          <div className="flex items-center gap-1.5 md:gap-2">
            <Btn onClick={toggleShuffle} active={shuffle} title="Shuffle" className="hidden md:flex">
              <Shuffle className="w-3.5 h-3.5" />
            </Btn>
            <Btn onClick={prev} title="Previous">
              <SkipBack className="w-4 h-4 fill-current" />
            </Btn>
            <Btn onClick={toggle} accent lg title={playing ? "Pause" : "Play"}>
              {playing
                ? <Pause className="w-5 h-5 text-black fill-black" />
                : <Play  className="w-5 h-5 text-black fill-black translate-x-px" />
              }
            </Btn>
            <Btn onClick={next} title="Next">
              <SkipForward className="w-4 h-4 fill-current" />
            </Btn>
            <Btn onClick={toggleRepeat} active={repeat} title="Repeat" className="hidden md:flex">
              <Repeat className="w-3.5 h-3.5" />
            </Btn>
          </div>

          {/* Scrub with timestamps — desktop only */}
          <div className="hidden md:flex items-center gap-2.5 w-full max-w-xs">
            <span className="text-[10px] text-white/35 tabular-nums w-8 text-right shrink-0">{fmt(currentTime)}</span>
            <Rail value={progress} onChange={seekTo} />
            <span className="text-[10px] text-white/35 tabular-nums w-8 shrink-0">{fmt(duration)}</span>
          </div>
        </div>

        {/* Volume — desktop only */}
        <div className="hidden md:flex items-center gap-2 w-55 justify-end shrink-0">
          <Btn onClick={toggleMute}>
            {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </Btn>
          <Rail value={muted ? 0 : volume * 100} onChange={v => setVolume(v / 100)} />
        </div>

      </div>
    </div>
  );
}
