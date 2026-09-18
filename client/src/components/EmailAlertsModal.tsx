import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  Radio,
  Calendar,
  Compass,
  RefreshCw,
  Sun
} from 'lucide-react';

interface EmailAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GeofenceItem {
  id: string;
  name: string;
  radiusKm: number;
  altitudeMeters: number;
  isDispatched: boolean;
}

interface BriefingItem {
  id: string;
  dayTitle: string;
  scheduledFor: string;
  subject: string;
  isDispatched: boolean;
}

interface AutomationStatus {
  schedulerActive: boolean;
  recipients: string[];
  activeGeofences: GeofenceItem[];
  scheduledBriefings: BriefingItem[];
  totalDispatchedCount: number;
}

export const EmailAlertsModal: React.FC<EmailAlertsModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<AutomationStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'briefings' | 'geofences'>('briefings');
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isDispatchingDigest, setIsDispatchingDigest] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [simulatingId, setSimulatingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const pin = localStorage.getItem('triptrack_family_pin') || '2026';
      const res = await fetch('/api/notifications/status', {
        headers: { 'x-family-pin': pin }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setStatus(json.data);
        }
      }
    } catch (err) {
      console.warn('Failed to load notification automation status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestEmail = async () => {
    setIsSendingTest(true);
    setActionMessage(null);
    try {
      const pin = localStorage.getItem('triptrack_family_pin') || '2026';
      const res = await fetch('/api/notifications/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-family-pin': pin
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage({
          text: data.simulated 
            ? 'Test notification simulated successfully! (Payload logged in server console).'
            : 'Test email dispatched successfully to family inbox via Gmail SMTP!',
          type: 'success'
        });
      } else {
        setActionMessage({ text: data.error || 'Failed to dispatch test email', type: 'error' });
      }
    } catch (err: any) {
      setActionMessage({ text: err.message || 'Connection error', type: 'error' });
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleDispatchDigest = async () => {
    setIsDispatchingDigest(true);
    setActionMessage(null);
    try {
      const pin = localStorage.getItem('triptrack_family_pin') || '2026';
      const res = await fetch('/api/notifications/digest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-family-pin': pin
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage({
          text: 'Evening Sandhya Bulletin compiled and dispatched to all family emails!',
          type: 'success'
        });
        fetchStatus();
      } else {
        setActionMessage({ text: data.error || 'Failed to dispatch digest', type: 'error' });
      }
    } catch (err: any) {
      setActionMessage({ text: err.message || 'Connection error', type: 'error' });
    } finally {
      setIsDispatchingDigest(false);
    }
  };

  const handleSimulate = async (type: 'BRIEFING' | 'WAYPOINT', targetId: string) => {
    setSimulatingId(targetId);
    setActionMessage(null);
    try {
      const pin = localStorage.getItem('triptrack_family_pin') || '2026';
      const res = await fetch('/api/notifications/trigger-simulation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-family-pin': pin
        },
        body: JSON.stringify({ type, targetId })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage({
          text: `Trigger executed for ${targetId}! Notification dispatched to family.`,
          type: 'success'
        });
        fetchStatus();
      } else {
        setActionMessage({ text: data.error || 'Simulation trigger failed', type: 'error' });
      }
    } catch (err: any) {
      setActionMessage({ text: err.message || 'Error executing trigger', type: 'error' });
    } finally {
      setSimulatingId(null);
    }
  };

  const handleTriggerLocation = async (useCoords?: { lat: number; lng: number }) => {
    setActionMessage(null);
    try {
      let lat = useCoords?.lat ?? 21.1904; // Durg, Chhattisgarh
      let lng = useCoords?.lng ?? 81.2849;

      if (!useCoords && typeof navigator !== 'undefined' && 'geolocation' in navigator) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 4000 });
          });
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
        } catch {
          // Fallback to Durg coordinates if geolocation permission not granted
        }
      }

      const pin = localStorage.getItem('triptrack_family_pin') || '2026';
      const res = await fetch('/api/notifications/trigger-geofence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-family-pin': pin
        },
        body: JSON.stringify({ latitude: lat, longitude: lng, passengerId: 'traveller-utkarsh' })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.detected && data.arrival) {
          setActionMessage({
            text: `🎯 Location Detection Success: Touched ${data.arrival.name}! Automated arrival alert dispatched to family email.`,
            type: 'success'
          });
        } else {
          setActionMessage({
            text: `📍 Location recorded (${lat.toFixed(4)}, ${lng.toFixed(4)}). ${data.message}`,
            type: 'success'
          });
        }
        fetchStatus();
      } else {
        setActionMessage({ text: data.error || 'Location detection failed', type: 'error' });
      }
    } catch (err: any) {
      setActionMessage({ text: err.message || 'Error executing location check', type: 'error' });
    }
  };

  const handleScheduleCustom = async (minutes: number = 15) => {
    setActionMessage(null);
    try {
      const pin = localStorage.getItem('triptrack_family_pin') || '2026';
      const res = await fetch('/api/notifications/schedule-custom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-family-pin': pin
        },
        body: JSON.stringify({
          minutesFromNow: minutes,
          dayTitle: `Live Test: ${minutes}-Minute Scheduled Briefing`,
          subject: `⏰ [TripTrack Live Test] ${minutes}-Minute Scheduled Briefing Trigger`,
          transitInfo: `Automated schedule execution test in Durg, CG. Trigger time reached right on schedule!`
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage({
          text: `⏱️ Scheduled! ${data.message}. TripTrack background engine will fire the email right on schedule.`,
          type: 'success'
        });
        fetchStatus();
      } else {
        setActionMessage({ text: data.error || 'Failed to schedule custom briefing', type: 'error' });
      }
    } catch (err: any) {
      setActionMessage({ text: err.message || 'Error scheduling briefing', type: 'error' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-t-3xl sm:rounded-2xl p-4 sm:p-6 max-h-[92vh] overflow-y-auto pb-safe shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-temple-gold border border-amber-500/40">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Family Email Alerts & Automation</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Gmail SMTP
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Autonomous Briefings, GPS Geofencing & Evening Digests
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="tap-active p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Message Alert */}
        {actionMessage && (
          <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
            actionMessage.type === 'success' 
              ? 'bg-emerald-950/80 border border-emerald-600/80 text-emerald-200' 
              : 'bg-rose-950/80 border border-rose-600/80 text-rose-200'
          }`}>
            {actionMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span className="flex-1 leading-snug">{actionMessage.text}</span>
          </div>
        )}

        {/* Recipients Card */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Configured Family Recipients</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {status?.recipients.length || 0} Emails Active
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {status?.recipients && status.recipients.length > 0 ? (
              status.recipients.map((email, idx) => (
                <span 
                  key={idx} 
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-[11px] font-mono font-medium flex items-center gap-1"
                >
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>{email}</span>
                </span>
              ))
            ) : (
              <span className="text-xs text-amber-400 italic">
                Simulated mode: Server logs emails to console (Configure SMTP_USER in server/.env)
              </span>
            )}
          </div>
        </div>

        {/* Quick Action Dispatchers */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleDispatchDigest}
            disabled={isDispatchingDigest}
            className="p-3 rounded-2xl bg-gradient-to-r from-purple-600/20 via-slate-800 to-slate-900 border border-purple-500/40 hover:border-purple-500/70 text-left space-y-1 tap-active group transition-all"
          >
            <div className="flex items-center justify-between">
              <Sun className="w-4 h-4 text-purple-400" />
              <span className="text-[9px] font-bold text-purple-300 font-mono">1-Tap Send</span>
            </div>
            <div className="text-xs font-bold text-white group-hover:text-purple-200">
              {isDispatchingDigest ? 'Dispatching...' : "Today's Evening Digest"}
            </div>
            <div className="text-[10px] text-slate-400 leading-tight">
              Sandhya Bulletin with milestones & SpO2
            </div>
          </button>

          <button
            type="button"
            onClick={handleSendTestEmail}
            disabled={isSendingTest}
            className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/60 text-left space-y-1 tap-active group transition-all"
          >
            <div className="flex items-center justify-between">
              <Send className="w-4 h-4 text-amber-400" />
              <span className="text-[9px] font-bold text-amber-300 font-mono">Verify</span>
            </div>
            <div className="text-xs font-bold text-white group-hover:text-amber-200">
              {isSendingTest ? 'Sending...' : 'Send Test Notification'}
            </div>
            <div className="text-[10px] text-slate-400 leading-tight">
              Verify family inbox deliverability
            </div>
          </button>
        </div>

        {/* Live Durg CG Location Test Banner */}
        <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-300">
              <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Location Trigger Test: Durg, CG</span>
            </div>
            <p className="text-[10px] text-slate-300 mt-0.5 leading-tight">
              Simulates detection at Durg, CG (21.19°N, 81.28°E) to trigger arrival notification.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleTriggerLocation({ lat: 21.1904, lng: 81.2849 })}
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shrink-0 shadow-lg tap-active flex items-center gap-1"
          >
            <span>Trigger Durg GPS</span>
          </button>
        </div>

        {/* Segmented Tab Selector */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('briefings')}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all tap-active ${
              activeTab === 'briefings'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Scheduled Briefings ({status?.scheduledBriefings.length || 6})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('geofences')}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all tap-active ${
              activeTab === 'geofences'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>GPS Geofences ({status?.activeGeofences.length || 8})</span>
          </button>
        </div>

        {/* Tab 1: Scheduled Briefings List */}
        {activeTab === 'briefings' && (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {/* Quick 15-min test scheduler */}
            <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Schedule Test Briefing (+15 Mins)</span>
                </span>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Dispatches an automated email 15 minutes from now.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleScheduleCustom(15)}
                className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] shrink-0 tap-active shadow"
              >
                Schedule (+15m)
              </button>
            </div>

            {status?.scheduledBriefings.map((briefing) => (
              <div 
                key={briefing.id}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white truncate">
                      {briefing.dayTitle}
                    </span>
                    {briefing.isDispatched ? (
                      <span className="text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/30 shrink-0">
                        Dispatched
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono font-bold bg-sky-500/20 text-sky-400 px-1.5 py-0.2 rounded border border-sky-500/30 shrink-0">
                        Scheduled
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {briefing.subject}
                  </p>
                  <p className="text-[10px] text-amber-300/80 font-mono mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{new Date(briefing.scheduledFor).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleSimulate('BRIEFING', briefing.id)}
                  disabled={simulatingId === briefing.id}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-bold shrink-0 border border-slate-700 tap-active"
                  title="Simulate Dispatch"
                >
                  {simulatingId === briefing.id ? 'Sending...' : 'Test Send'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: GPS Geofences List */}
        {activeTab === 'geofences' && (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {status?.activeGeofences.map((wp) => (
              <div 
                key={wp.id}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white truncate">
                      {wp.name}
                    </span>
                    {wp.isDispatched ? (
                      <span className="text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/30 shrink-0">
                        Touched
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono font-bold bg-amber-500/20 text-amber-400 px-1.5 py-0.2 rounded border border-amber-500/30 shrink-0">
                        Pending
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                    <span>Radius: {wp.radiusKm}km</span>
                    <span>•</span>
                    <span>Alt: {wp.altitudeMeters}m</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSimulate('WAYPOINT', wp.id)}
                  disabled={simulatingId === wp.id}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-bold shrink-0 border border-slate-700 tap-active"
                  title="Simulate Waypoint Touch"
                >
                  {simulatingId === wp.id ? 'Sending...' : 'Simulate Touch'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Refresh & Close Button */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={fetchStatus}
            disabled={loading}
            className="tap-active p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 text-xs font-bold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="tap-active flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
