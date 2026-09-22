import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Printer, 
  Copy, 
  Check, 
  MessageSquare
} from 'lucide-react';
import { PILGRIMAGE_DAYS } from './DaySelectorStrip';
import { 
  TRIP_SEED_SEGMENTS, 
  DAILY_OUTFIT_GUIDANCE, 
  DAILY_CASH_UPI_GUIDANCE, 
  SACRED_RITUAL_SLOTS
} from '../../../shared/config/trip.config';

interface DayItineraryExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDayId: string;
}

export const DayItineraryExportModal: React.FC<DayItineraryExportModalProps> = ({
  isOpen,
  onClose,
  selectedDayId
}) => {
  const [activeTab, setActiveTab] = useState<'WHATSAPP' | 'PRINT'>('WHATSAPP');
  const [exportDayId, setExportDayId] = useState<string>(() => {
    return selectedDayId !== 'all' ? selectedDayId : 'day-4';
  });
  const [isAllDays, setIsAllDays] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentDayDef = PILGRIMAGE_DAYS.find(d => d.id === exportDayId) || PILGRIMAGE_DAYS[3];
  const currentOutfit = DAILY_OUTFIT_GUIDANCE.find(g => g.dayId === exportDayId);
  const currentCash = DAILY_CASH_UPI_GUIDANCE.find(g => g.dayId === exportDayId);
  const currentRituals = SACRED_RITUAL_SLOTS.filter(r => r.dayId === exportDayId);

  // Find relevant segment for this day
  const getSegmentForDay = (dayId: string) => {
    switch (dayId) {
      case 'day-1': return TRIP_SEED_SEGMENTS[0];
      case 'day-2': return TRIP_SEED_SEGMENTS[1];
      case 'day-3': return TRIP_SEED_SEGMENTS[2];
      case 'day-4': return TRIP_SEED_SEGMENTS[3];
      case 'day-5': return TRIP_SEED_SEGMENTS[4];
      case 'day-6': return TRIP_SEED_SEGMENTS[5];
      case 'day-7': return TRIP_SEED_SEGMENTS[6];
      case 'day-8': return TRIP_SEED_SEGMENTS[7];
      case 'day-9': return TRIP_SEED_SEGMENTS[8];
      default: return TRIP_SEED_SEGMENTS[0];
    }
  };

  const currentSegment = getSegmentForDay(exportDayId);

  // Generate WhatsApp formatted text
  const generateWhatsAppSummary = (isFullTrip: boolean) => {
    if (isFullTrip) {
      let text = `🚩 *TRIPTRACK 2026: BADRINATH DHAM 9-DAY PILGRIMAGE MASTER DOSSIER*\n`;
      text += `📅 Sep 24 – Oct 02, 2026\n`;
      text += `👥 *Pilgrims:* Family A (Utkarsh & Rajnish Ji) & Family B (Shreyas & Sanjay Ji)\n\n`;

      PILGRIMAGE_DAYS.forEach(day => {
        const seg = getSegmentForDay(day.id);
        const cash = DAILY_CASH_UPI_GUIDANCE.find(c => c.dayId === day.id);
        const outfit = DAILY_OUTFIT_GUIDANCE.find(o => o.dayId === day.id);

        text += `━━━━━━━━━━━━━━━━━━━━━\n`;
        text += `📍 *DAY ${day.dayNumber}: ${(day.destination || '').toUpperCase()}*\n`;
        text += `🗓️ ${day.dateStr} | ${day.location} (${day.elevationMeters}m)\n`;
        text += `🌡️ Weather: ${outfit?.tempRange || 'N/A'}\n`;
        text += `🚗 Transit: ${seg?.logistics?.serviceName || 'Local Cab / Sightseeing'}\n`;
        text += `💵 Recommended Cash: ${cash?.recommendedCashINR || 'N/A'} (UPI: ${cash?.upiReliability || 'N/A'})\n`;
        if (seg?.checkpoints && seg.checkpoints.length > 0) {
          text += `⏰ *Key Milestones:*\n`;
          seg.checkpoints.forEach(cp => {
            text += `  • ${cp.estimatedTime} - ${cp.name} ${cp.elderComfortNote ? `(${cp.elderComfortNote})` : ''}\n`;
          });
        }
        text += `\n`;
      });

      text += `━━━━━━━━━━━━━━━━━━━━━\n`;
      text += `🚨 *EMERGENCY & HELPLINE DIRECTORY:*\n`;
      text += `• SDRF Uttarakhand Police: 1070 / 112\n`;
      text += `• Railway Helpline: 139\n`;
      text += `• Badrinath Control Room: 01389-222124\n`;
      text += `• AIIMS Rishikesh Emergency: 0135-2462940\n`;
      text += `📱 Powered by TripTrack Private PWA`;
      return text;
    }

    // Single Day WhatsApp text
    let text = `🚩 *TRIPTRACK: DAY ${currentDayDef.dayNumber} SCHEDULE*\n`;
    text += `📍 *${currentDayDef.destination}*\n`;
    text += `🗓️ *Date:* ${currentDayDef.dateStr} (${currentDayDef.location})\n`;
    text += `🏔️ *Elevation:* ${currentDayDef.elevationMeters}m\n\n`;

    if (currentOutfit) {
      text += `🧥 *DRESS & WEATHER:*\n`;
      text += `• Temp: ${currentOutfit.tempRange}\n`;
      text += `• Elders: ${currentOutfit.elderWear}\n`;
      text += `• Footwear: ${currentOutfit.footwear}\n\n`;
    }

    if (currentCash) {
      text += `💵 *HARD CASH & UPI ADVISORY:*\n`;
      text += `• Recommended Cash: ${currentCash.recommendedCashINR}\n`;
      text += `• UPI Reliability: ${currentCash.upiReliability === 'CASH_MANDATORY' ? '🔴 ZERO SIGNAL / CASH ONLY' : currentCash.upiReliability === 'INTERMITTENT' ? '🟡 INTERMITTENT' : '🟢 100% WORKING'}\n`;
      text += `• Last ATM: ${currentCash.lastAtmLocation}\n\n`;
    }

    if (currentRituals.length > 0) {
      text += `🛕 *SACRED PUJA & AARTI MUHURTAS:*\n`;
      currentRituals.forEach(r => {
        text += `• *${r.ritualName}* (${r.templeName})\n`;
        text += `  ⏰ Time: ${r.timeWindow} | ⏳ Arrive by: ${r.arriveByTime}\n`;
        text += `  🪑 Elder Seating: ${r.elderSeatingAdvice}\n`;
      });
      text += `\n`;
    }

    if (currentSegment?.checkpoints && currentSegment.checkpoints.length > 0) {
      text += `⏱️ *DAY TIMELINE & MILESTONES:*\n`;
      currentSegment.checkpoints.forEach(cp => {
        text += `• [${cp.estimatedTime}] ${cp.name}\n`;
        if (cp.elderComfortNote) {
          text += `  ↳ 👴 _Elder note: ${cp.elderComfortNote}_\n`;
        }
      });
      text += `\n`;
    }

    text += `🚗 *TRANSIT LOGISTICS:*\n`;
    text += `• Service: ${currentSegment?.logistics?.serviceName || 'Dedicated Hill Cab'}\n`;
    if (currentSegment?.logistics?.identifier) text += `• Identifier: ${currentSegment.logistics.identifier}\n`;
    if (currentSegment?.logistics?.driverPhone) text += `• Driver Contact: ${currentSegment.logistics.driverPhone}\n\n`;

    text += `🚨 *SOS EMERGENCY NUMBERS:*\n`;
    text += `• SDRF Uttarakhand: 1070 / 112\n`;
    text += `• Badrinath Helpline: 01389-222124\n`;
    text += `📱 _Generated via TripTrack Offline PWA_`;
    return text;
  };

  const currentSummaryText = generateWhatsAppSummary(isAllDays);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentSummaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(currentSummaryText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-lg max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700/70 rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-sky-950/70 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-500/40 text-sky-400 flex items-center justify-center shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-1.5">
                <span>Itinerary Export & Print</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  WhatsApp & Sheet
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                1-Tap family WhatsApp briefings & printer-ready offline dossiers
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center tap-active shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Tabs (WhatsApp vs Print) */}
        <div className="p-2.5 bg-slate-950/50 border-b border-slate-800 flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('WHATSAPP')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all tap-active ${
              activeTab === 'WHATSAPP'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/60'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Format</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('PRINT')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all tap-active ${
              activeTab === 'PRINT'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/60'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Printable Sheet / PDF</span>
          </button>
        </div>

        {/* Scope Selector: Single Day vs All 9 Days */}
        <div className="p-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAllDays(false)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                !isAllDays ? 'bg-slate-700 text-white border border-slate-500' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Day {currentDayDef.dayNumber} Only
            </button>
            <button
              type="button"
              onClick={() => setIsAllDays(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isAllDays ? 'bg-slate-700 text-white border border-slate-500' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Entire 9-Day Trip
            </button>
          </div>

          {!isAllDays && (
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[200px]">
              {PILGRIMAGE_DAYS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setExportDayId(d.id)}
                  className={`w-7 h-7 rounded-lg text-xs font-black shrink-0 flex items-center justify-center transition-all ${
                    exportDayId === d.id
                      ? 'bg-amber-500 text-slate-950 font-black ring-2 ring-amber-400'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {d.dayNumber}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-4 overflow-y-auto flex-1">
          {activeTab === 'WHATSAPP' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">
                  Formatted for Family WhatsApp Group:
                </span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Ready to Send
                </span>
              </div>

              {/* Text Preview Area */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs whitespace-pre-wrap leading-relaxed select-all max-h-[380px] overflow-y-auto">
                {currentSummaryText}
              </div>
            </div>
          ) : (
            /* Printable Sheet Preview */
            <div id="printable-trip-sheet" className="p-4 rounded-2xl bg-white text-slate-950 text-xs shadow-lg space-y-4">
              {/* Header */}
              <div className="border-b-2 border-slate-900 pb-3 flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-black tracking-tight text-slate-900 uppercase">
                    TripTrack • Badrinath Dham Pilgrimage
                  </h2>
                  <p className="text-[11px] font-semibold text-slate-600">
                    Travel Dossier • {isAllDays ? 'Complete 9-Day Master Schedule' : `Day ${currentDayDef.dayNumber}: ${currentDayDef.destination}`}
                  </p>
                </div>
                <div className="text-right text-[10px] font-bold text-slate-700">
                  <div>Sep 24 – Oct 02, 2026</div>
                  <div>4 Pilgrims (Families A & B)</div>
                </div>
              </div>

              {/* Pilgrims Roster */}
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-[11px]">
                <div>
                  <strong className="text-slate-900">Family A:</strong> Utkarsh (Son/Lead) & Rajnish Ji (Senior)
                </div>
                <div>
                  <strong className="text-slate-900">Family B:</strong> Shreyas (Son/Lead) & Sanjay Ji (Senior)
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-950">
                <strong className="text-amber-900">Emergency & Helplines:</strong> SDRF Uttarakhand: 1070 / 112 | Badrinath Helpline: 01389-222124 | Railway: 139 | AIIMS Rishikesh: 0135-2462940
              </div>

              {/* Schedule Body */}
              <div className="space-y-3">
                <h4 className="font-black text-slate-900 uppercase tracking-wide border-b border-slate-300 pb-1 text-[11px]">
                  {isAllDays ? 'Trip Itinerary Overview' : `Day ${currentDayDef.dayNumber} Timeline & Transit`}
                </h4>

                {isAllDays ? (
                  <div className="space-y-2">
                    {PILGRIMAGE_DAYS.map(day => (
                      <div key={day.id} className="p-2 border border-slate-200 rounded text-[11px]">
                        <div className="font-black text-slate-900">
                          Day {day.dayNumber}: {day.destination} ({day.dateStr})
                        </div>
                        <div className="text-slate-600 text-[10px]">
                          Location: {day.location} ({day.elevationMeters}m) • Transit: {getSegmentForDay(day.id)?.logistics?.serviceName || 'Cab'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-[11px] font-semibold text-slate-800">
                      <strong>Service:</strong> {currentSegment?.logistics?.serviceName || 'Dedicated Hill Cab'} {currentSegment?.logistics?.identifier ? `(${currentSegment.logistics.identifier})` : ''}
                    </div>
                    {currentSegment?.checkpoints && (
                      <table className="w-full border-collapse text-[10px]">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 text-left">
                            <th className="p-1 border border-slate-200">Time</th>
                            <th className="p-1 border border-slate-200">Milestone</th>
                            <th className="p-1 border border-slate-200">Elder Comfort & Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentSegment.checkpoints.map(cp => (
                            <tr key={cp.id}>
                              <td className="p-1 border border-slate-200 font-bold whitespace-nowrap">{cp.estimatedTime}</td>
                              <td className="p-1 border border-slate-200">{cp.name}</td>
                              <td className="p-1 border border-slate-200 text-slate-600">{cp.elderComfortNote || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between gap-2 shrink-0">
          {activeTab === 'WHATSAPP' ? (
            <>
              <button
                type="button"
                onClick={handleCopy}
                className="flex-1 min-h-[48px] px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs flex items-center justify-center gap-2 tap-active border border-slate-700 shadow-md"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy WhatsApp Text</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="flex-1 min-h-[48px] px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 tap-active shadow-lg shadow-emerald-500/20"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open in WhatsApp</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handlePrint}
              className="w-full min-h-[48px] px-4 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 tap-active shadow-lg shadow-sky-500/20"
            >
              <Printer className="w-4 h-4" />
              <span>Print Sheet / Save as PDF</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
