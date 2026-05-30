import { motion } from 'motion/react';
import { Search as SearchIcon } from 'lucide-react';

export default function SearchView() {
  const tags = ['Techno', 'Jazz', 'Lo-fi', 'Ambient', 'Classical', 'Synthwave'];

  return (
    <div className="pb-32 pt-8 px-6 space-y-10 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tight uppercase italic tracking-tighter">Search</h1>
      
      {/* Search Bar */}
      <div className="relative group">
        <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Artist, tracks, or albums"
          className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 font-medium placeholder:text-white/20 focus:outline-none focus:bg-white/10 focus:border-white/30 backdrop-blur-md transition-all"
        />
      </div>
    </div>
  );
}
