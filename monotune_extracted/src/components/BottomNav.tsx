import { motion } from 'motion/react';
import { Home, Search, Library } from 'lucide-react';
import { ViewType } from '../types';

interface BottomNavProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function BottomNav({ currentView, onViewChange }: BottomNavProps) {
  const items = [
    { id: 'home' as ViewType, icon: Home, label: 'Home' },
    { id: 'search' as ViewType, icon: Search, label: 'Search' },
    { id: 'library' as ViewType, icon: Library, label: 'Library' }
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
      <nav className="glass rounded-full px-6 py-3 flex items-center justify-between">
        {items.map(({ id, icon: Icon, label }) => {
          const isActive = currentView === id;
          return (
            <button
              key={label}
              onClick={() => id !== 'profile' && onViewChange(id)}
              className="relative flex flex-col items-center gap-1 group"
            >
              <div className={`p-2 rounded-full transition-all duration-300 ${isActive ? 'bg-white text-black' : 'text-white/50 group-hover:text-white'}`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              {isActive && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute -bottom-1 w-1 h-1 bg-white rounded-full"
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
