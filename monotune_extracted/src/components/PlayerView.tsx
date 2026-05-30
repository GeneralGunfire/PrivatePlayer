import { motion } from 'motion/react';
import { ChevronDown, MoreVertical, Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, Music2, Heart, ListMusic } from 'lucide-react';
import { Track } from '../types';

interface PlayerViewProps {
  track: Track;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onClose: () => void;
}

export default function PlayerView({ track, isPlaying, onTogglePlay, onClose }: PlayerViewProps) {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-3xl flex flex-col px-8 pt-12 pb-16 overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_60%)]" />
      </div>

      {/* Header */}
      <div className="relative flex items-center justify-between mb-8">
        <button 
          onClick={onClose}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all"
        >
          <ChevronDown size={20} />
        </button>
        <div className="text-center">
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/30 font-black mb-1">On Rotation</p>
          <h2 className="text-xs font-bold tracking-tight uppercase">{track.album}</h2>
        </div>
        <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Artwork */}
      <div className="relative flex-1 flex flex-col items-center justify-center">
        <div className="relative w-72 h-72 md:w-80 md:h-80 group">
          {/* Progress Ring Decor */}
          <div className="absolute inset-[-15px] rounded-full border border-white/5" />
          <div className="absolute inset-[-30px] rounded-full border border-white/[0.02]" />
          
          <motion.div 
             animate={{ rotate: isPlaying ? 360 : 0 }}
             transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
             className="w-full h-full relative z-10 p-1 bg-white/5 rounded-full border border-white/10 shadow-[0_0_80px_rgba(255,255,255,0.05)]"
          >
            <img 
              src={track.coverUrl} 
              alt={track.title}
              className="w-full h-full object-cover rounded-full"
            />
          </motion.div>
        </div>

        {/* Title & Artist */}
        <div className="mt-16 text-center">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2 leading-none">{track.title}</h1>
          <p className="text-sm text-white/40 font-bold uppercase tracking-[0.2em]">{track.artist}</p>
        </div>
      </div>

      {/* Controls Container */}
      <div className="relative space-y-10 glass-heavy p-8 rounded-[2.5rem] mt-auto">
        {/* Progress Bar */}
        <div className="space-y-4">
          <div className="relative h-1.5 w-full bg-white/10 rounded-full cursor-pointer">
            <div className="absolute h-full w-[65%] bg-white rounded-full">
              <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
            </div>
          </div>
          <div className="flex justify-between text-[10px] font-mono font-bold tracking-[0.2em] text-white/30 uppercase">
            <span>02:44</span>
            <span>{track.duration}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-between">
          <button className="text-white/30 hover:text-white transition-colors">
            <Shuffle size={18} />
          </button>
          
          <div className="flex items-center gap-6">
            <button className="p-3 hover:bg-white/10 rounded-full transition-all active:scale-90 text-white/60">
              <SkipBack size={28} fill="currentColor" />
            </button>
            <button 
              onClick={onTogglePlay}
              className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>
            <button className="p-3 hover:bg-white/10 rounded-full transition-all active:scale-90 text-white/60">
              <SkipForward size={28} fill="currentColor" />
            </button>
          </div>

          <button className="text-white/30 hover:text-white transition-colors">
            <Repeat size={18} />
          </button>
        </div>
        {/* Bottom Actions */}
        <div className="flex items-center justify-between text-[9px] font-black tracking-[0.2em] text-white/30 pt-4 border-t border-white/5">
          <button className="flex items-center gap-2 hover:text-white transition-colors uppercase">
            <Music2 size={14} /> Lyrics
          </button>
          <button className="flex items-center gap-2 hover:text-white transition-colors uppercase">
            <Heart size={14} /> Saved
          </button>
          <button className="flex items-center gap-2 hover:text-white transition-colors uppercase">
            <ListMusic size={14} /> Queue
          </button>
        </div>
      </div>
    </motion.div>
  );
}
