import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Clock, 
  ExternalLink, 
  PhoneCall, 
  RefreshCw, 
  PlusCircle, 
  CheckCircle2, 
  Waves, 
  Mountain, 
  Car, 
  CloudFog, 
  Share2,
  Trash2,
  Wifi,
  WifiOff,
  Sparkles
} from 'lucide-react';
import { 
  RouteAlert, 
  CorridorStretchHealth, 
  CORRIDOR_STRETCHES, 
  fetchLiveRouteAlerts,
  triggerLiveGeminiScan,
  deleteSpotterReport
} from '../services/routeAlertStorage';
import { localDB } from '../../../shared/db/dexie';
import { ReportObstructionModal } from './ReportObstructionModal';

export const RouteGuardTab: React.FC = () => {
  const [alerts, setAlerts] = useState<RouteAlert[]>([]);
  const [stretches, setStretches] = useState<CorridorStretchHealth[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isScanningGemini, setIsScanningGemini] = useState<boolean>(false);
  const [lastScannedTime, setLastScannedTime] = useState<string>('Just now');
  const [selectedStretchFilter, setSelectedStretchFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'LANDSLIDE' | 'WEATHER' | 'TEMPLE' | 'TRAFFIC'>('ALL');
  const [isSpotterModalOpen, setIsSpotterModalOpen] = useState<boolean>(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const loadAlerts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchLiveRouteAlerts();
      setAlerts(data.alerts);
      setStretches(data.stretches);
      setIsOnline(data.isOnline);
      setLastScannedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.warn('Failed to load route alerts', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerGeminiScan = async () => {
    setIsScanningGemini(true);
    setFeedbackToast('✨ Gemini AI is fetching live Google News RSS & NH-7 highway bulletins...');
    try {
      const data = await triggerLiveGeminiScan();
      setAlerts(data.alerts);
      setStretches(data.stretches);
      setIsOnline(data.isOnline);
      setLastScannedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setFeedbackToast(`✅ Gemini AI Scan Complete: ${data.alerts.length} ground updates verified!`);
      setTimeout(() => setFeedbackToast(null), 4000);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([40, 50, 40]);
      }
    } catch (err) {
      console.error('Gemini scan failed', err);
      setFeedbackToast('⚠️ Gemini route scan failed. Displaying offline Dexie cache.');
      setTimeout(() => setFeedbackToast(null), 3000);
    } finally {
      setIsScanningGemini(false);
    }
  };

  useEffect(() => {
    // Purge test spotters or stale alerts from prior years to keep only fresh real-time feeds
    localDB.offlineRouteAlerts.toArray().then(async items => {
      const now = Date.now();
      const staleItems = items.filter(i => {
        const itemTime = new Date(i.timestamp).getTime();
        const diffHours = (now - itemTime) / (1000 * 60 * 60);
        return isNaN(diffHours) || diffHours > 48; // Older than 48h or from previous year
      });
      if (staleItems.length > 0) {
        await localDB.offlineRouteAlerts.bulkDelete(staleItems.map(t => t.id));
      }
      loadAlerts();
    });
  }, []);

  const handleSpotterReportSubmitted = (newReport: RouteAlert) => {
    setAlerts(prev => [newReport, ...prev]);
    setFeedbackToast('✅ Obstruction logged & shared with family!');
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const handleDeleteReport = async (id: string) => {
    await deleteSpotterReport(id);
    setAlerts(prev => prev.filter(a => a.id !== id));
    setFeedbackToast('🗑️ Report dismissed');
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const filteredAlerts = alerts.filter(a => {
    if (selectedStretchFilter !== 'ALL' && a.stretch !== selectedStretchFilter) return false;
    if (categoryFilter === 'LANDSLIDE') {
      return a.eventType === 'LANDSLIDE' || a.eventType === 'ROAD_BLOCKED';
    }
    if (categoryFilter === 'WEATHER') {
      return a.eventType === 'WEATHER_WARNING' || a.eventType === 'FLASH_FLOOD';
    }
    if (categoryFilter === 'TEMPLE') {
      const text = (a.headline + ' ' + a.summary + ' ' + a.location).toLowerCase();
      return text.includes('temple') || text.includes('darshan') || text.includes('dham') || text.includes('badrinath');
    }
    if (categoryFilter === 'TRAFFIC') {
      return a.eventType === 'CLEAR' || a.eventType === 'HEAVY_JAM' || a.eventType === 'ONE_WAY_TRAFFIC';
    }
    return true;
  });

  const getEventIcon = (eventType: RouteAlert['eventType']) => {
    switch (eventType) {
      case 'LANDSLIDE':
        return <Mountain className="w-4 h-4 text-amber-400" />;
      case 'FLASH_FLOOD':
        return <Waves className="w-4 h-4 text-sky-400" />;
      case 'HEAVY_JAM':
        return <Car className="w-4 h-4 text-orange-400" />;
      case 'WEATHER_WARNING':
        return <CloudFog className="w-4 h-4 text-slate-300" />;
      case 'CLEAR':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-amber-400" />;
    }
  };

  const getSeverityBadge = (severity: RouteAlert['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 rounded-full bg-rose-950/80 border border-rose-700 text-rose-300 text-[10px] font-black uppercase tracking-wider animate-pulse">
            🔴 Blocked / Critical
          </span>
        );
      case 'MODERATE':
        return (
          <span className="px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-700 text-amber-300 text-[10px] font-black uppercase tracking-wider">
            🟡 Caution / Slow
          </span>
        );
      case 'ADVISORY':
        return (
          <span className="px-2 py-0.5 rounded-full bg-sky-950/80 border border-sky-700 text-sky-300 text-[10px] font-black uppercase tracking-wider">
            🔵 Advisory
          </span>
        );
      case 'NORMAL':
        return (
          <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
            🟢 All Clear
          </span>
        );
    }
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const alertTime = new Date(isoString).getTime();
      const now = Date.now();
      const diffMinutes = Math.floor((now - alertTime) / (60 * 1000));
      if (isNaN(diffMinutes) || diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      const hours = Math.floor(diffMinutes / 60);
      if (hours < 24) return `${hours}h ${diffMinutes % 60}m ago`;
      const days = Math.floor(hours / 24);
      if (days <= 3) return `${days}d ago`;
      return 'Recent Intel';
    } catch {
      return 'Recent Intel';
    }
  };

  const handleShareAlert = (alert: RouteAlert) => {
    const text = `🚨 *TripTrack Road Alert — NH-7 Badrinath Corridor*\n\n📍 *Stretch:* ${alert.stretch}\n📌 *Location:* ${alert.location}\n⚠️ *Notice:* ${alert.headline}\n📝 *Details:* ${alert.summary}\n⏱️ *Status:* ${alert.broClearanceETA || 'Active'}\n\n_Shared from TripTrack Family Yatra App_`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="p-3 rounded-2xl bg-amber-950/90 border border-amber-500 text-amber-100 font-bold text-xs text-center shadow-2xl animate-in fade-in">
          {feedbackToast}
        </div>
      )}

      {/* Corridor Status Hero Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/40 border border-amber-600/30 shadow-2xl space-y-3.5 backdrop-blur-xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                <span>NH-7 Highway & Pilgrimage News</span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Haridwar ➔ Dham
                </span>
              </h3>
              <p className="text-[11px] text-slate-300">
                Live Gemini AI news scanner & highway bulletins
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
              isOnline
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                : 'bg-amber-950/80 text-amber-300 border-amber-700'
            }`}>
              {isOnline ? <Wifi className="w-2.5 h-2.5" /> : <WifiOff className="w-2.5 h-2.5" />}
              <span>{isOnline ? 'Online' : 'Dexie Blob'}</span>
            </span>

            <button
              type="button"
              onClick={loadAlerts}
              disabled={isLoading || isScanningGemini}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 tap-active disabled:opacity-50"
              aria-label="Refresh route alerts"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading || isScanningGemini ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 1-Tap Gemini AI Live Scanner Trigger Button */}
        <button
          type="button"
          onClick={handleTriggerGeminiScan}
          disabled={isScanningGemini}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-black text-xs flex items-center justify-center gap-2.5 shadow-xl shadow-purple-950/80 transition-all tap-active min-h-[48px] border border-white/20 disabled:opacity-50 relative overflow-hidden group"
        >
          {isScanningGemini ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
              <span>Scanning NH-7 Live with Gemini 2.5 Flash...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Scan Live Route Intel (Gemini AI)</span>
              <span className="text-[10px] font-mono font-normal opacity-80 ml-auto">
                {lastScannedTime}
              </span>
            </>
          )}
        </button>

        {/* 6-Stretch Visual Health Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
            <span>Route Segment Health</span>
            <span className="text-amber-400 font-mono">300 km Ascent</span>
          </div>

          <div className="grid grid-cols-6 gap-1 p-1 bg-slate-950/80 rounded-2xl border border-white/10">
            {stretches.map(s => {
              const isSelected = selectedStretchFilter === s.stretch;
              let dotBg = 'bg-emerald-500';
              let badgeText = 'Clear';
              if (s.status === 'BLOCKED') {
                dotBg = 'bg-rose-500 animate-pulse';
                badgeText = 'Blocked';
              } else if (s.status === 'CAUTION') {
                dotBg = 'bg-amber-400 animate-pulse';
                badgeText = 'Caution';
              }

              const shortName = s.stretch
                .replace('Haridwar - Rishikesh', 'HW-RSH')
                .replace('Rishikesh - Devprayag', 'RSH-DEV')
                .replace('Devprayag - Rudraprayag', 'DEV-RUD')
                .replace('Rudraprayag - Chamoli', 'RUD-CHM')
                .replace('Chamoli - Joshimath', 'CHM-JSH')
                .replace('Joshimath - Badrinath', 'JSH-BDR');

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedStretchFilter(isSelected ? 'ALL' : s.stretch)}
                  className={`p-1.5 rounded-xl text-center transition-all tap-active flex flex-col items-center gap-1 ${
                    isSelected
                      ? 'bg-amber-500/20 border border-amber-400'
                      : 'hover:bg-white/5'
                  }`}
                  title={`${s.stretch}: ${badgeText}`}
                >
                  <span className={`w-2 h-2 rounded-full ${dotBg} shadow-sm`} />
                  <span className="text-[9px] font-bold text-slate-300 font-mono tracking-tighter">
                    {shortName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button: Family Spotter Report */}
        <button
          type="button"
          onClick={() => setIsSpotterModalOpen(true)}
          className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/60 transition-all tap-active min-h-[46px]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Spot Road Obstruction / Landslide</span>
        </button>
      </div>

      {/* News Category Filter Chips */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Topic Filter</span>
          <span className="text-amber-400 font-mono text-[10px]">{filteredAlerts.length} reports</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          <button
            type="button"
            onClick={() => setCategoryFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all tap-active ${
              categoryFilter === 'ALL'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-900 border border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            All Route Intel ({alerts.length})
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('LANDSLIDE')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all tap-active ${
              categoryFilter === 'LANDSLIDE'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-900 border border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            🚨 Landslides & Blocks
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('WEATHER')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all tap-active ${
              categoryFilter === 'WEATHER'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-slate-900 border border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            🌧️ Weather & Rain
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('TEMPLE')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all tap-active ${
              categoryFilter === 'TEMPLE'
                ? 'bg-yellow-500 text-slate-950 shadow-sm'
                : 'bg-slate-900 border border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            🛕 Temple & Yatra
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('TRAFFIC')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all tap-active ${
              categoryFilter === 'TRAFFIC'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-900 border border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            🚗 Highway Transit
          </button>
        </div>
      </div>

      {/* Stretch Filter Pills Strip */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Filter by Highway Stretch</span>
          {selectedStretchFilter !== 'ALL' && (
            <button
              type="button"
              onClick={() => setSelectedStretchFilter('ALL')}
              className="text-amber-400 font-bold hover:underline"
            >
              Reset to All
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedStretchFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all tap-active ${
              selectedStretchFilter === 'ALL'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-900 border border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            All Corridors ({alerts.length})
          </button>

          {CORRIDOR_STRETCHES.map(stretch => {
            const count = alerts.filter(a => a.stretch === stretch).length;
            const isSelected = selectedStretchFilter === stretch;
            return (
              <button
                key={stretch}
                type="button"
                onClick={() => setSelectedStretchFilter(stretch)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all tap-active flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-900 border border-white/10 text-slate-300 hover:text-white'
                }`}
              >
                <span>{stretch}</span>
                {count > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono ${
                    isSelected ? 'bg-slate-950 text-amber-300' : 'bg-white/10 text-slate-300'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Disruption Alert Cards Feed */}
      <div className="space-y-3">
        {filteredAlerts.map(alert => (
          <div
            key={alert.id}
            className={`p-4 rounded-3xl bg-slate-900/90 border transition-all shadow-xl space-y-3 backdrop-blur-md ${
              alert.severity === 'CRITICAL'
                ? 'border-rose-700/60 shadow-rose-950/30'
                : alert.severity === 'MODERATE'
                ? 'border-amber-600/50 shadow-amber-950/20'
                : alert.status === 'ALL_CLEAR'
                ? 'border-emerald-600/50 shadow-emerald-950/20'
                : 'border-white/10'
            }`}
          >
            {/* Top Badge & Time */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-2 rounded-xl bg-slate-950 border border-white/10 shrink-0">
                  {getEventIcon(alert.eventType)}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono font-bold text-amber-300 block truncate">
                    {alert.stretch}
                  </span>
                  <span className="text-xs font-black text-slate-200 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">{alert.location}</span>
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                {getSeverityBadge(alert.severity)}
                <span className="text-[10px] text-slate-400 font-mono mt-1 flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{formatRelativeTime(alert.timestamp)}</span>
                </span>
              </div>
            </div>

            {/* Headline */}
            <h4 className="text-xs sm:text-sm font-black text-white leading-snug">
              {alert.headline}
            </h4>

            {/* Actionable Summary */}
            <p className="text-xs text-slate-300 leading-relaxed font-normal bg-slate-950/60 p-3 rounded-2xl border border-white/5">
              {alert.summary}
            </p>

            {/* Status & Clearance ETA */}
            {alert.broClearanceETA && (
              <div className={`flex items-center justify-between text-[11px] px-3 py-2 rounded-xl border ${
                alert.status === 'ALL_CLEAR'
                  ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-200'
                  : 'bg-amber-950/40 border-amber-800/40 text-amber-200'
              }`}>
                <span className="font-bold flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Clearance & Traffic State:</span>
                </span>
                <span className={`font-mono font-black ${alert.status === 'ALL_CLEAR' ? 'text-emerald-300' : 'text-amber-300'}`}>
                  {alert.broClearanceETA}
                </span>
              </div>
            )}

            {/* Footer Attribution & Action */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
              <div className="flex items-center gap-1 truncate max-w-[60%]">
                <span className="text-slate-500">Source:</span>
                <span className="font-medium text-slate-300 truncate">{alert.source}</span>
                {alert.isFamilyReport && (
                  <span className="px-1.5 py-0.2 rounded bg-purple-900/60 text-purple-200 border border-purple-700 text-[9px] font-bold">
                    Family Spotter
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleShareAlert(alert)}
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 font-bold text-[10px] flex items-center gap-1 tap-active"
                  title="Forward to WhatsApp"
                >
                  <Share2 className="w-3 h-3" />
                  <span>WhatsApp</span>
                </button>

                {alert.isFamilyReport && (
                  <button
                    type="button"
                    onClick={() => handleDeleteReport(alert.id)}
                    className="p-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-700 text-rose-300 tap-active"
                    title="Dismiss / Delete Spotter Alert"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}

                {alert.sourceUrl && (
                  <a
                    href={alert.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 tap-active"
                    aria-label="Open source report"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="p-8 text-center rounded-3xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="font-bold text-slate-200">No disruptions reported on this stretch!</p>
            <p className="text-[11px] text-slate-400">NH-7 double lane moving smoothly. Safe travels to Badrinath Dham 🙏</p>
          </div>
        )}
      </div>

      {/* Emergency Highway Control Room Quick Dialers */}
      <div className="p-4 rounded-3xl bg-slate-950 border border-white/10 space-y-2.5">
        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Highway Emergency Helplines</span>
          <span className="text-emerald-400 font-mono">Toll-Free 24x7</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <a
            href="tel:112"
            className="p-3 rounded-2xl bg-rose-950/40 border border-rose-800/60 hover:border-rose-600 text-center flex flex-col items-center justify-center gap-1 tap-active min-h-[56px]"
          >
            <PhoneCall className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-black text-rose-200">112 Police</span>
            <span className="text-[9px] text-rose-400/80">Highway Control</span>
          </a>

          <a
            href="tel:1364"
            className="p-3 rounded-2xl bg-amber-950/40 border border-amber-800/60 hover:border-amber-600 text-center flex flex-col items-center justify-center gap-1 tap-active min-h-[56px]"
          >
            <PhoneCall className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-black text-amber-200">1364 Yatra</span>
            <span className="text-[9px] text-amber-400/80">BRO / Road State</span>
          </a>

          <a
            href="tel:1070"
            className="p-3 rounded-2xl bg-sky-950/40 border border-sky-800/60 hover:border-sky-600 text-center flex flex-col items-center justify-center gap-1 tap-active min-h-[56px]"
          >
            <PhoneCall className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-black text-sky-200">1070 SDRF</span>
            <span className="text-[9px] text-sky-400/80">Disaster Relief</span>
          </a>
        </div>
      </div>

      {/* Spotter Modal */}
      <ReportObstructionModal
        isOpen={isSpotterModalOpen}
        onClose={() => setIsSpotterModalOpen(false)}
        onReportSubmitted={handleSpotterReportSubmitted}
      />
    </div>
  );
};
