import React from 'react';
import { Route, FolderLock, MapPin, IndianRupee, Radio } from 'lucide-react';

export type ActiveTab = 'itinerary' | 'vault' | 'tracking' | 'gullak' | 'voice';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'itinerary' as const, label: 'Itinerary', icon: Route, color: 'text-amber-400' },
    { id: 'vault' as const, label: 'Vault', icon: FolderLock, color: 'text-sky-400' },
    { id: 'tracking' as const, label: 'Tracking', icon: MapPin, color: 'text-emerald-400' },
    { id: 'gullak' as const, label: 'Gullak', icon: IndianRupee, color: 'text-yellow-400' },
    { id: 'voice' as const, label: 'Feed', icon: Radio, color: 'text-purple-400' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-alpine-950/95 backdrop-blur-xl border-t border-slate-800 shadow-mobile-dock">
      <div className="max-w-md mx-auto px-2 pb-safe pt-1.5 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tap-active flex flex-col items-center justify-center min-w-touch min-h-touch py-1 px-2 rounded-xl transition-all relative ${
                isActive
                  ? 'text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-7 h-1 rounded-full bg-gradient-to-r from-temple-saffron to-amber-400 shadow-sm shadow-amber-500/50" />
              )}
              <div className={`p-1 rounded-lg transition-transform ${isActive ? 'scale-110 bg-slate-800/80 shadow-inner' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? tab.color : 'text-slate-400'}`} />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 leading-none">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
