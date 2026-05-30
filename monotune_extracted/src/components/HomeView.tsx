import { motion } from 'motion/react';
import { Play, Clock } from 'lucide-react';
import { MOCK_TRACKS, MOCK_PLAYLISTS } from '../data';
import { Track } from '../types';

interface HomeViewProps {
  onTrackSelect: (track: Track) => void;
}

export default function HomeView({ onTrackSelect }: HomeViewProps) {
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="pb-32 pt-8 px-6 space-y-10 max-w-2xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 uppercase italic tracking-tighter">{getTimeGreeting()}</h1>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Ready to dive into your next audio journey?</p>
        </div>
      </header>

      {/* Featured Banner */}
      <section className="relative h-64 rounded-3xl overflow-hidden group glass">
        <div className="absolute inset-0 bg-neutral-900 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80" alt="Billboard" className="w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent z-10" />
        <div className="absolute bottom-8 left-8 z-20">
          <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] uppercase tracking-[0.2em] mb-4 inline-block font-bold">New Release</span>
          <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-2 leading-none">Abstract Rituals</h1>
          <p className="text-white/60 text-sm font-medium tracking-tight">By Spectral Frequency • 12 Tracks • 44 Min</p>
        </div>
        <div className="absolute right-[-20px] top-[-20px] w-80 h-80 bg-white/10 rounded-full blur-[60px]" />
      </section>

      {/* Suggested for You */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xl font-bold uppercase tracking-tight">Quick Queue</h2>
          <span className="text-[10px] text-white/40 uppercase tracking-widest cursor-pointer hover:text-white transition-colors font-bold">View All</span>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar">
          {MOCK_PLAYLISTS.map((playlist, idx) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex-shrink-0 w-48 group cursor-pointer"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 glass border-white/10 overflow-hidden">
                <img src={playlist.coverUrl} alt={playlist.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                    <Play size={24} fill="currentColor" className="ml-1" />
                   </button>
                </div>
              </div>
              <h3 className="font-bold tracking-tight truncate uppercase text-sm">{playlist.name}</h3>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1 truncate">
                {playlist.description?.split(' ')[0] || 'Originals'}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recently Played */}
      <section>
        <h2 className="text-xl font-bold uppercase tracking-tight mb-6">Recently Played</h2>
        <div className="space-y-2">
          {MOCK_TRACKS.map((track, idx) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onTrackSelect(track)}
              className="group p-3 bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 rounded-2xl flex items-center gap-4 cursor-pointer transition-all"
            >
              <span className="text-[10px] font-mono text-white/30 hidden md:block">{String(idx + 1).padStart(2, '0')}</span>
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 glass border-white/5">
                <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm truncate uppercase tracking-tight">{track.title}</h4>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest truncate">{track.artist}</p>
              </div>
              <div className="flex items-center gap-3 text-white/40 group-hover:text-white transition-colors">
                <span className="text-[10px] font-mono tracking-widest">{track.duration}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
