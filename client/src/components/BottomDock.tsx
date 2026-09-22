import React from 'react';
import { Route, FolderLock, MapPin, IndianRupee, Radio } from 'lucide-react';

export type ActiveTab = 'itinerary' | 'vault' | 'tracking' | 'gullak' | 'voice';

interface BottomDockProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'itinerary' as const, label: 'Itinerary', icon: Route, color: 'text-amber-400' },
    { id: 'vault' as const, label: 'Vault', icon: FolderLock, color: 'text-sky-400' },
    { id: 'tracking' as const, label: 'Map', icon: MapPin, color: 'text-emerald-400' },
    { id: 'gullak' as const, label: 'Gullak', icon: IndianRupee, color: 'text-yellow-400' },
    { id: 'voice' as const, label: 'Feed', icon: Radio, color: 'text-purple-400' },
  ];

  return (
    <nav className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom,0px))] left-3 right-3 max-w-md mx-auto z-40 pointer-events-none">
      <div className="glass-dock p-1.5 rounded-2xl flex items-center justify-between pointer-events-auto transition-all shadow-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tap-active flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-xl transition-all relative ${
                isActive
                  ? 'text-white font-bold bg-white/[0.08] shadow-sm border border-white/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-6 h-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 shadow-sm shadow-amber-500/80" />
              )}
              <div
                className={`p-1 rounded-lg transition-transform ${
                  isActive ? 'scale-110' : 'group-hover:scale-105'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? tab.color : 'text-slate-400'}`} />
              </div>
              <span
                className={`text-[10px] tracking-tight leading-none mt-0.5 ${
                  isActive ? 'text-slate-100 font-bold' : 'text-slate-400 font-medium'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomDock;
