"use client";

import { motion, AnimatePresence, Reorder } from "framer-motion";
import { X, GripVertical, Play, Trash2 } from "lucide-react";
import { usePlayer } from "@/lib/player-context";
import type { Track } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function QueueDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { queue, currentTrack, playAt, reorderQueue, removeFromQueue } = usePlayer();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-110 bg-black/85 backdrop-blur-2xl flex flex-col px-6 pt-10 pb-8"
          onClick={onClose}
        >
          <div className="flex items-center justify-between mb-6 shrink-0" onClick={e => e.stopPropagation()}>
            <div>
              <p className="text-[9px] uppercase tracking-[0.45em] text-white/25 font-black mb-0.5">Up Next</p>
              <p className="text-[13px] font-bold tracking-tight">{queue.length} tracks</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/8 hover:bg-white/14 border border-white/10 transition-colors"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>

          <Reorder.Group
            axis="y"
            values={queue}
            onReorder={(newOrder: Track[]) => {
              const oldIds = queue.map(t => t.id);
              const newIds = newOrder.map(t => t.id);
              const fromIndex = oldIds.findIndex((id, i) => id !== newIds[i]);
              if (fromIndex === -1) return;
              const toIndex = newIds.indexOf(oldIds[fromIndex]);
              reorderQueue(fromIndex, toIndex);
            }}
            className="flex-1 overflow-y-auto scrollbar-none space-y-1 touch-pan-y"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {queue.map((track, i) => {
              const isCurrent = track.id === currentTrack?.id;
              return (
                <Reorder.Item
                  key={track.id}
                  value={track}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-2xl group",
                    isCurrent ? "bg-white/10 border border-white/15" : "hover:bg-white/5"
                  )}
                >
                  <GripVertical size={16} className="text-white/25 shrink-0 cursor-grab active:cursor-grabbing" />

                  <button
                    onClick={() => playAt(i)}
                    className="flex items-center gap-3 flex-1 min-w-0 text-left"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-white/5 relative">
                      <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                      {isCurrent && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Play size={14} fill="white" className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className={cn("text-sm font-bold truncate", isCurrent ? "text-white" : "text-white/85")}>
                        {track.title}
                      </p>
                      <p className="text-[11px] text-white/35 font-medium truncate">{track.artist}</p>
                    </div>
                  </button>

                  <button
                    onClick={() => removeFromQueue(i)}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-white/25 hover:text-white/70 hover:bg-white/10 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
