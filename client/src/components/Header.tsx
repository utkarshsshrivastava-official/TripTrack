import React from 'react';
import { DuoId } from '../shared/types';
import { DUO_CONFIG } from '../shared/config/travellers.config';
import { UserProfile } from '../shared/types/user';
import { Menu, Mountain, Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onOpenSidebar: () => void;
  activeDuo: DuoId | 'ALL';
  setActiveDuo: (duo: DuoId | 'ALL') => void;
  isOnline: boolean;
  queuedCount: number;
  isSyncing: boolean;
  onManualSync: () => void;
  onOpenEmergency?: () => void;
  activeUser: UserProfile;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSidebar,
  activeDuo,
  setActiveDuo,
  isOnline,
  queuedCount,
  isSyncing,
  onManualSync,
  activeUser
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-2.5 sm:px-3.5 pt-safe pb-2 transition-all">
      <div className="flex items-center justify-between gap-1.5 sm:gap-2 max-w-md mx-auto h-12">
        {/* Left: Hamburger Menu & Brand Crest */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1 mr-1">
          {/* Hamburger Drawer Button with Active User Badge */}
          <button
            onClick={onOpenSidebar}
            className="tap-active relative w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-slate-200 hover:text-white hover:border-slate-700 shadow-sm shrink-0 transition-all"
            aria-label="Open Navigation Drawer"
            title={`Active profile: ${activeUser.name}. Tap to open menu & tools.`}
          >
            <Menu className="w-5 h-5 text-slate-300" />
            <span
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-950 flex items-center justify-center text-[9px] font-black text-white shadow-xs"
              style={{ backgroundColor: activeUser.avatarColor }}
            >
              {activeUser.name.charAt(0)}
            </span>
          </button>

          {/* Brand Crest */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-sm shadow-amber-500/20 shrink-0">
              <Mountain className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <h1 className="text-[13px] sm:text-sm font-black tracking-tight text-white leading-none whitespace-nowrap">
                  TripTrack
                </h1>
                <span className="text-[8.5px] sm:text-[9px] font-mono px-0.5 sm:px-1 py-0.2 sm:py-0.5 rounded bg-slate-800/90 text-amber-400 border border-slate-700/80 font-bold leading-none shrink-0">
                  '26
                </span>
              </div>
              <span className="text-[9.5px] sm:text-[10px] text-slate-400 block leading-tight font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                Badrinath Dham
              </span>
            </div>
          </div>
        </div>

        {/* Right: Family Duo Filter & Live Connection Status */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Compact Duo Filter Pill */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[10px] sm:text-[11px] font-bold shadow-xs">
            <button
              onClick={() => setActiveDuo('ALL')}
              className={`tap-active px-1.5 sm:px-2 py-1 rounded-md transition-all ${
                activeDuo === 'ALL'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Show all 4 pilgrims"
            >
              All
            </button>
            <button
              onClick={() => setActiveDuo('DUO_A')}
              className={`tap-active px-1.5 sm:px-2 py-1 rounded-md transition-all flex items-center gap-0.5 sm:gap-1 ${
                activeDuo === 'DUO_A'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-blue-300'
              }`}
              title={DUO_CONFIG.DUO_A.label}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <span>A</span>
            </button>
            <button
              onClick={() => setActiveDuo('DUO_B')}
              className={`tap-active px-1.5 sm:px-2 py-1 rounded-md transition-all flex items-center gap-0.5 sm:gap-1 ${
                activeDuo === 'DUO_B'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-emerald-300'
              }`}
              title={DUO_CONFIG.DUO_B.label}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>B</span>
            </button>
          </div>

          {/* Connectivity Status Button / Trigger */}
          <button
            onClick={onManualSync}
            disabled={isSyncing}
            className={`tap-active h-8 px-1.5 sm:px-2 rounded-lg flex items-center justify-center gap-1 border text-xs font-semibold transition-all shrink-0 ${
              isOnline
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50 hover:bg-emerald-900/40'
                : 'bg-amber-950/60 text-amber-400 border-amber-700/60 animate-pulse'
            }`}
            title={
              isSyncing
                ? 'Syncing with MongoDB Atlas...'
                : isOnline
                ? queuedCount > 0
                  ? `${queuedCount} queued locally. Tap to sync.`
                  : 'Online & Live Synced'
                : 'Offline Dead Zone (Dexie Local Mode)'
            }
            aria-label="Network Connectivity & Sync Status"
          >
            {isSyncing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-400" />
            ) : isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                {queuedCount > 0 && (
                  <span className="text-[10px] font-mono font-bold px-1 rounded bg-amber-500/20 text-amber-300">
                    {queuedCount}
                  </span>
                )}
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] font-mono font-bold">2G</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
