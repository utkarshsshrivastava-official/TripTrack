import React from 'react';
import { DuoId } from '../shared/types';
import { DUO_CONFIG } from '../shared/config/travellers.config';
import { Wifi, WifiOff, RefreshCw, ShieldAlert, Mountain } from 'lucide-react';

interface HeaderProps {
  activeDuo: DuoId | 'ALL';
  setActiveDuo: (duo: DuoId | 'ALL') => void;
  isOnline: boolean;
  queuedCount: number;
  isSyncing: boolean;
  onManualSync: () => void;
  onOpenEmergency: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeDuo,
  setActiveDuo,
  isOnline,
  queuedCount,
  isSyncing,
  onManualSync,
  onOpenEmergency
}) => {
  return (
    <header className="sticky top-0 z-40 bg-alpine-950/95 backdrop-blur-md border-b border-slate-800/80 px-3 pt-safe pb-2 transition-all">
      {/* Top utility row */}
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        {/* Brand & Mission */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-temple-saffron to-amber-600 flex items-center justify-center shadow-lg shadow-amber-950/40 text-white font-black text-base border border-amber-400/40">
            🕉️
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-extrabold tracking-tight text-white leading-none">
                TripTrack
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700 font-semibold">
                Ut-tech
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
              <Mountain className="w-3 h-3 text-sky-400 inline" />
              <span>Badrinath Yatra '26</span>
            </p>
          </div>
        </div>

        {/* Status Actions */}
        <div className="flex items-center gap-1.5">
          {/* Offline / Online Pill */}
          <button
            onClick={onManualSync}
            disabled={isSyncing}
            className={`tap-active flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              isOnline
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/70 hover:bg-emerald-900/60'
                : 'bg-amber-950/70 text-amber-300 border-amber-700/80 animate-pulse'
            }`}
            title={isOnline ? 'Online (Connected)' : 'Offline (Dexie Local Mode)'}
          >
            {isSyncing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-400" />
            ) : isOnline ? (
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span className="text-[11px] font-mono">
              {isOnline ? (queuedCount > 0 ? `${queuedCount} Q` : 'Sync') : 'DeadZone'}
            </span>
          </button>

          {/* Elder SOS Button */}
          <button
            onClick={onOpenEmergency}
            className="tap-active flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-950/50 border border-rose-400/50 hover:bg-rose-500"
            aria-label="Elder Emergency Protocols"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="text-[11px] tracking-wide">SOS</span>
          </button>
        </div>
      </div>

      {/* Duo Segmented Filter Pills */}
      <div className="mt-2.5 max-w-md mx-auto">
        <div className="grid grid-cols-3 p-1 bg-slate-900/90 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveDuo('ALL')}
            className={`tap-active py-1.5 rounded-lg transition-all ${
              activeDuo === 'ALL'
                ? 'bg-slate-800 text-white shadow-sm font-bold border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Pilgrims (4)
          </button>
          <button
            onClick={() => setActiveDuo('DUO_A')}
            className={`tap-active py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
              activeDuo === 'DUO_A'
                ? 'bg-blue-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-blue-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>
            <span>{DUO_CONFIG.DUO_A.label}</span>
          </button>
          <button
            onClick={() => setActiveDuo('DUO_B')}
            className={`tap-active py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
              activeDuo === 'DUO_B'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
            <span>{DUO_CONFIG.DUO_B.label}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
