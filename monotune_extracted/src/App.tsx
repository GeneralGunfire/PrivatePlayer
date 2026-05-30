import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import HomeView from './components/HomeView';
import LibraryView from './components/LibraryView';
import SearchView from './components/SearchView';
import PlayerView from './components/PlayerView';
import BottomNav from './components/BottomNav';
import { ViewType, Track } from './types';
import { MOCK_TRACKS } from './data';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [currentTrack, setCurrentTrack] = useState<Track>(MOCK_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'home': return <HomeView onTrackSelect={handleTrackSelect} />;
      case 'search': return <SearchView />;
      case 'library': return <LibraryView />;
      default: return <HomeView onTrackSelect={handleTrackSelect} />;
    }
  };

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-white opacity-10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-50px] right-[100px] w-[500px] h-[500px] bg-neutral-600 opacity-20 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mini Player */}
      <AnimatePresence>
        {!isPlayerOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-40"
          >
            <div 
              onClick={() => setIsPlayerOpen(true)}
              className="glass p-2 pl-3 pr-4 flex items-center gap-4 rounded-3xl cursor-pointer hover:bg-white/10 transition-all active:scale-[0.98]"
            >
              <div className="w-12 h-12 bg-neutral-800 rounded-xl overflow-hidden shadow-lg border border-white/10">
                <img 
                  src={currentTrack.coverUrl} 
                  alt={currentTrack.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold truncate tracking-tight">{currentTrack.title}</h4>
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold truncate">
                  {currentTrack.artist}
                </p>
              </div>
              <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <SkipBack size={18} fill="currentColor" className="opacity-40" />
                </button>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                >
                  {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                </button>
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <SkipForward size={18} fill="currentColor" className="opacity-40" />
                </button>
              </div>
            </div>
            {/* Tiny Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5 rounded-b-2xl overflow-hidden">
               <motion.div 
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: isPlaying ? '100%' : '40%' }}
                transition={{ duration: isPlaying ? 240 : 0.5, ease: 'linear' }}
               />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav currentView={currentView} onViewChange={setCurrentView} />

      {/* Full Player View */}
      <AnimatePresence>
        {isPlayerOpen && (
          <PlayerView
            track={currentTrack}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            onClose={() => setIsPlayerOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

