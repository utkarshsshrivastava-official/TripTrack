import React from 'react';
import { DuoId } from '../shared/types';
import { DUO_CONFIG } from '../shared/config/travellers.config';
import { UserProfile } from '../shared/types/user';
import { Wifi, WifiOff, RefreshCw, ShieldAlert, Mountain, MessageSquare, HeartPulse, Droplets } from 'lucide-react';

interface HeaderProps {
  activeDuo: DuoId | 'ALL';
  setActiveDuo: (duo: DuoId | 'ALL') => void;
  isOnline: boolean;
  queuedCount: number;
  isSyncing: boolean;
  onManualSync: () => void;
  onOpenEmergency: () => void;
  activeUser: UserProfile;
  onOpenProfile: () => void;
  onOpenChat: () => void;
  onOpenHealth?: () => void;
  onOpenHydration?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeDuo,
  setActiveDuo,
  isOnline,
  queuedCount,
  isSyncing,
  onManualSync,
  onOpenEmergency,
  activeUser,
  onOpenProfile,
  onOpenChat,
  onOpenHealth,
  onOpenHydration
}) => {
  return (
    <header className="sticky top-0 z-40 bg-alpine-950/95 backdrop-blur-md border-b border-slate-800/80 px-3 pt-safe pb-2 transition-all">
      {/* Top utility row */}
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        {/* Brand & Active Profile Avatar */}
        <div className="flex items-center gap-2">
          {/* Active User Switcher Pill */}
          <button
            onClick={onOpenProfile}
            className="tap-active flex items-center gap-1.5 p-1 pr-2.5 rounded-full bg-slate-900 border border-slate-700/80 hover:border-amber-500/60 shadow-sm transition-all"
            title={`Active device profile: ${activeUser.name}. Click to switch.`}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-inner"
              style={{ backgroundColor: activeUser.avatarColor }}
            >
              {activeUser.name.charAt(0)}
            </div>
            <div className="text-left">
              <span className="text-[11px] font-bold text-slate-200 block leading-tight max-w-[75px] truncate">
                {activeUser.name.split(' ')[0]}
              </span>
              <span className="text-[9px] text-amber-400 block leading-none font-medium">
                {activeUser.type === 'PILGRIM' ? (activeUser.duoId === 'DUO_A' ? 'Family A' : 'Family B') : 'Guest'}
              </span>
            </div>
          </button>

          <div>
            <div className="flex items-center gap-1">
              <h1 className="text-sm font-extrabold tracking-tight text-white leading-none">
                TripTrack
              </h1>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-800 text-amber-400 border border-slate-700">
                2026
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
              <Mountain className="w-2.5 h-2.5 text-sky-400 inline" />
              <span>Badrinath</span>
            </p>
          </div>
        </div>

        {/* Status Actions */}
        <div className="flex items-center gap-1.5">
          {/* Elder SpO2 & Health Button */}
          {onOpenHealth && (
            <button
              onClick={onOpenHealth}
              className="tap-active flex items-center gap-1 px-2 py-1.5 rounded-full bg-slate-900 text-rose-400 border border-rose-500/40 hover:bg-rose-950/40 shadow-sm transition-all"
              title="Elder SpO₂ & Oxygen Monitor"
            >
              <HeartPulse className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span className="text-[11px] font-bold text-slate-200">SpO₂</span>
            </button>
          )}

          {/* 90-Min Hydration & Meds Button */}
          {onOpenHydration && (
            <button
              onClick={onOpenHydration}
              className="tap-active flex items-center gap-1 px-2 py-1.5 rounded-full bg-slate-900 text-sky-400 border border-sky-500/40 hover:bg-sky-950/40 shadow-sm transition-all"
              title="90-Minute Hydration & BP Meds Cadence"
            >
              <Droplets className="w-3.5 h-3.5 text-sky-400 animate-bounce" />
              <span className="text-[11px] font-bold text-slate-200">Water</span>
            </button>
          )}

          {/* In-Family Chat Button */}
          <button
            onClick={onOpenChat}
            className="tap-active flex items-center gap-1 px-2 py-1.5 rounded-full bg-slate-900 text-amber-400 border border-amber-500/40 hover:bg-amber-950/40 shadow-sm transition-all"
            title="In-Family Chat (4-8 Group Members)"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold text-slate-200">Chat</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

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
              {isOnline ? (queuedCount > 0 ? `${queuedCount}Q` : 'Live') : 'DeadZone'}
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

      {/* Family Segmented Filter Pills */}
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
