import React, { useEffect } from 'react';
import { UserProfile } from '../shared/types/user';
import {
  X,
  Mountain,
  HeartPulse,
  Droplets,
  PhoneCall,
  ShieldAlert,
  BookOpen,
  CheckSquare,
  Music,
  Award,
  RefreshCw,
  Wifi,
  WifiOff,
  UserCheck,
  ChevronRight,
  Sparkles,
  MessageSquareShare,
  Smartphone,
  Download,
  CheckCircle2,
  Mail
} from 'lucide-react';
import { usePwaInstall } from '../shared/hooks/usePwaInstall';

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeUser: UserProfile;
  onOpenProfile: () => void;
  onOpenHealth: () => void;
  onOpenHydration: () => void;
  onOpenMedicalDirectory: () => void;
  onOpenOfflineSms: () => void;
  onOpenBrahmaKapal: () => void;
  onOpenPackingChecklist: () => void;
  onOpenSacredChants: () => void;
  onOpenMemorial: () => void;
  onOpenEmailAlerts: () => void;
  isOnline: boolean;
  queuedCount: number;
  isSyncing: boolean;
  onManualSync: () => void;
  onOpenEmergency: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  isOpen,
  onClose,
  activeUser,
  onOpenProfile,
  onOpenHealth,
  onOpenHydration,
  onOpenMedicalDirectory,
  onOpenOfflineSms,
  onOpenBrahmaKapal,
  onOpenPackingChecklist,
  onOpenSacredChants,
  onOpenMemorial,
  onOpenEmailAlerts,
  isOnline,
  queuedCount,
  isSyncing,
  onManualSync,
  onOpenEmergency
}) => {
  const { isInstallable, isInstalled, triggerInstall } = usePwaInstall();

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleAction = (callback: () => void) => {
    onClose();
    setTimeout(callback, 150);
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!isOpen}
    >
      {/* Frosted Backdrop Scrim */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel */}
      <aside
        className={`relative w-80 max-w-[85vw] h-full bg-slate-950/95 backdrop-blur-2xl border-r border-slate-800/80 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header & Active Profile Card */}
        <div className="pt-safe px-4 pb-4 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/80 to-transparent">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-sm shadow-amber-500/30">
                <Mountain className="w-3.5 h-3.5 text-slate-950" />
              </div>
              <span className="font-extrabold text-sm tracking-tight text-white">TripTrack</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                2026
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 tap-active"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Pilgrim Profile Card */}
          <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-md shrink-0"
                style={{ backgroundColor: activeUser.avatarColor }}
              >
                {activeUser.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white truncate">{activeUser.name}</h4>
                  {activeUser.isElder && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-rose-950 text-rose-300 border border-rose-800/60 shrink-0">
                      Elder
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-amber-400 font-medium">
                  {activeUser.type === 'PILGRIM'
                    ? activeUser.duoId === 'DUO_A'
                      ? 'Family A • Coordinator'
                      : 'Family B • Coordinator'
                    : 'Home Observer'}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleAction(onOpenProfile)}
              className="tap-active p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-amber-400 hover:bg-slate-700/80 transition-all shrink-0"
              title="Switch pilgrim profile"
            >
              <UserCheck className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {/* Section 1: Elder Care & Mountain Health */}
          <div>
            <div className="px-2 mb-1.5 flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Elder Care & Health
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => handleAction(onOpenHealth)}
                className="w-full tap-active flex items-center justify-between p-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800/60 transition-all text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-950/60 border border-rose-800/60 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
                    <HeartPulse className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Pulse Oximeter & SpO₂</span>
                    <span className="text-[10px] text-slate-400">Altitude oxygen monitor</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
              </button>

              <button
                onClick={() => handleAction(onOpenHydration)}
                className="w-full tap-active flex items-center justify-between p-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800/60 transition-all text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-950/60 border border-sky-800/60 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Hydration & BP Meds</span>
                    <span className="text-[10px] text-slate-400">90-min acclimatization cadence</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
              </button>

              <button
                onClick={() => handleAction(onOpenMedicalDirectory)}
                className="w-full tap-active flex items-center justify-between p-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800/60 transition-all text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">NH-7 Medical Directory</span>
                    <span className="text-[10px] text-slate-400">CHC & Army base relief posts</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
              </button>

              <button
                onClick={() => handleAction(onOpenOfflineSms)}
                className="w-full tap-active flex items-center justify-between p-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800/60 transition-all text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                    <MessageSquareShare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Zero-Signal 2G SMS</span>
                    <span className="text-[10px] text-slate-400">Dead-zone reassuring texts</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
              </button>
            </div>
          </div>

          {/* Section 2: Sacred Liturgy & Pilgrimage Preparation */}
          <div>
            <div className="px-2 mb-1.5 flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Sacred Liturgy & Prep
              </span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </div>
            <div className="space-y-1">
              <button
                onClick={() => handleAction(onOpenBrahmaKapal)}
                className="w-full tap-active flex items-center justify-between p-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800/60 transition-all text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Brahma Kapal Tarpan</span>
                    <span className="text-[10px] text-slate-400">Step-by-step ritual guide</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
              </button>

              <button
                onClick={() => handleAction(onOpenPackingChecklist)}
                className="w-full tap-active flex items-center justify-between p-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800/60 transition-all text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-950/60 border border-sky-800/60 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Packing Checklist</span>
                    <span className="text-[10px] text-slate-400">Segment woollens & first aid</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
              </button>

              <button
                onClick={() => handleAction(onOpenSacredChants)}
                className="w-full tap-active flex items-center justify-between p-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800/60 transition-all text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-800/60 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Stotras & Tanpura Drone</span>
                    <span className="text-[10px] text-slate-400">Offline chants & 108 japa</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
              </button>

              <button
                onClick={() => handleAction(onOpenMemorial)}
                className="w-full tap-active flex items-center justify-between p-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800/60 transition-all text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-yellow-950/60 border border-yellow-800/60 flex items-center justify-center text-yellow-400 group-hover:scale-105 transition-transform">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Yatra Memorial Certificate</span>
                    <span className="text-[10px] text-slate-400">Keepsake & 50/50 split</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
              </button>

              <button
                onClick={() => handleAction(onOpenEmailAlerts)}
                className="w-full tap-active flex items-center justify-between p-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800/60 transition-all text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Family Email Alerts</span>
                    <span className="text-[10px] text-slate-400">Briefings, geofencing & digest</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
              </button>
            </div>
          </div>

          {/* Section: Standalone WebAPK App Installation */}
          {!isInstalled && (
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/15 via-slate-900/60 to-slate-900/80 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-100">Install Native App</h4>
                  <p className="text-[10px] text-stone-400">Standalone WebAPK • No Browser Bar</p>
                </div>
              </div>

              <p className="text-[11px] text-stone-300 leading-relaxed">
                Install TripTrack to launch directly from your home screen with zero URL bar and full offline Himalayan caching.
              </p>

              {isInstallable ? (
                <button
                  onClick={() => triggerInstall()}
                  className="w-full tap-active py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
                >
                  <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Install App on Phone</span>
                </button>
              ) : (
                <div className="text-[10px] text-amber-300/90 bg-amber-950/40 border border-amber-800/40 p-2 rounded-lg leading-snug">
                  💡 In Chrome menu (⋮), tap <strong>"Install app"</strong> to get the standalone APK.
                </div>
              )}
            </div>
          )}

          {isInstalled && (
            <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Running as Standalone Mobile App</span>
            </div>
          )}

          {/* Section 3: Telemetry & Cloud Storage Diagnostics */}
          <div>
            <div className="px-2 mb-1.5 flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Diagnostics & Sync
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Network State</span>
                <span className="font-mono font-bold flex items-center gap-1">
                  {isOnline ? (
                    <>
                      <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Live Connected</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-amber-400">Dead-Zone (Dexie)</span>
                    </>
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Offline Queued Items</span>
                <span className="font-mono font-bold text-amber-300">{queuedCount} records</span>
              </div>

              <button
                onClick={onManualSync}
                disabled={isSyncing}
                className="w-full tap-active mt-1 py-2.5 px-3 min-h-touch rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-slate-700"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing with Atlas...' : 'Force Cloud Sync'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Drawer Sticky Footer: Emergency SOS Speed Dialers */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950 pb-safe">
          <button
            onClick={() => handleAction(onOpenEmergency)}
            className="w-full tap-active py-2.5 px-3 min-h-touch rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-950/60 border border-rose-500 transition-all"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Open Emergency SOS Protocols</span>
          </button>
          <div className="flex items-center justify-around gap-2 mt-2 pt-1 text-[11px] text-slate-400 font-mono">
            <a href="tel:108" className="hover:text-rose-400 p-1 font-bold">🚑 108</a>
            <span>•</span>
            <a href="tel:112" className="hover:text-sky-400 p-1 font-bold">👮 112</a>
            <span>•</span>
            <a href="tel:1364" className="hover:text-amber-400 p-1 font-bold">🏔️ 1364</a>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default AppSidebar;
