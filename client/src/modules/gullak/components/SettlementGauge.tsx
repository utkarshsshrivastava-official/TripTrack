import React, { useState } from 'react';
import { GullakFinancialSummary } from '../services/expenseStorage';
import { DUO_A_SON, DUO_B_SON } from '../../../shared/config/travellers.config';
import { 
  ArrowRightLeft, 
  CheckCircle, 
  Copy, 
  Check, 
  MessageSquare
} from 'lucide-react';

interface SettlementGaugeProps {
  summary: GullakFinancialSummary;
}

export const SettlementGauge: React.FC<SettlementGaugeProps> = ({ summary }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const { netSettlement, totalSpentINR, paidByUtkarshINR, paidByShreyasINR, fairSharePerCoordinatorINR } = summary;

  // Calculate percentage tilt for the balance needle (50% is dead center / perfect equilibrium)
  // Range: 10% (max Shreyas / Duo B) to 90% (max Utkarsh / Duo A)
  let needlePositionPercent = 50;
  if (totalSpentINR > 0 && !netSettlement.isSettled) {
    const netUtkarsh = netSettlement.creditorName === DUO_A_SON.name 
      ? netSettlement.amountINR 
      : -netSettlement.amountINR;
    const ratio = netUtkarsh / totalSpentINR; // -1 to +1
    needlePositionPercent = Math.min(90, Math.max(10, Math.round(50 + ratio * 40)));
  }

  const generateWhatsAppMessage = () => {
    const lines = [
      '🏔️ *TripTrack Badrinath 2026 — Yatra Gullak 50/50 Audit*',
      '━━━━━━━━━━━━━━━━━━━━',
      `💰 *Total Collective Outlay:* ₹${totalSpentINR.toLocaleString('en-IN')}`,
      `⚖️ *Equal Fair Share:* ₹${fairSharePerCoordinatorINR.toLocaleString('en-IN')} each`,
      '',
      `👤 *${DUO_A_SON.name} (Family A):* Paid ₹${paidByUtkarshINR.toLocaleString('en-IN')}`,
      `👤 *${DUO_B_SON.name} (Family B):* Paid ₹${paidByShreyasINR.toLocaleString('en-IN')}`,
      '━━━━━━━━━━━━━━━━━━━━',
      netSettlement.isSettled
        ? '✅ *All accounts are completely even! (₹0 balance)*'
        : `📌 *Net Settlement:* 👉 *${netSettlement.debtorName}* owes *${netSettlement.creditorName} ₹${netSettlement.amountINR.toLocaleString('en-IN')}*`,
      '',
      '🙏 Jai Badri Vishal! • Tracked offline via TripTrack PWA'
    ];
    return encodeURIComponent(lines.join('\n'));
  };

  const handleCopyAudit = () => {
    const message = decodeURIComponent(generateWhatsAppMessage());
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${generateWhatsAppMessage()}`;
    window.open(url, '_blank');
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-4 shadow-xl space-y-3.5">
      {/* Gauge Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-black uppercase tracking-wider text-white">
            50/50 Bilateral Settlement Gauge
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Son Coordinators Only
        </span>
      </div>

      {/* Visual Balance Scale / Tug-of-War Track */}
      <div className="space-y-1.5 py-1">
        <div className="flex items-center justify-between text-[11px] font-bold">
          <span className="text-sky-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span>{DUO_A_SON.name}</span>
          </span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span>{DUO_B_SON.name}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </span>
        </div>

        {/* Needle Track */}
        <div className="relative h-4 w-full rounded-full bg-slate-950 p-0.5 border border-slate-800">
          {/* Center Zero Equilibrium Mark */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-slate-700 z-0" />

          {/* Left Gradient (Utkarsh side) */}
          <div 
            className="absolute left-0 top-0 bottom-0 bg-sky-500/30 rounded-l-full"
            style={{ width: `${needlePositionPercent}%` }}
          />

          {/* Dynamic Needle Pin */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-temple-gold border-2 border-slate-950 shadow-lg transition-all duration-700 flex items-center justify-center z-10"
            style={{ left: `${needlePositionPercent}%` }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
          </div>
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono text-slate-500">
          <span>₹{paidByUtkarshINR.toLocaleString('en-IN')}</span>
          <span className="text-amber-400/80">Center: ₹0 Balance</span>
          <span>₹{paidByShreyasINR.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Settlement Verdict Card */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-950/40 via-alpine-900 to-slate-950 border border-amber-800/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {netSettlement.isSettled ? (
            <>
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-emerald-300 block">
                  Accounts 100% Even
                </span>
                <span className="text-[10px] text-slate-400">
                  Neither coordinator owes any balance
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-mono font-black text-sm shrink-0 border border-amber-500/30">
                ₹
              </div>
              <div>
                <span className="text-xs text-slate-200 block">
                  <strong className="text-amber-300 font-extrabold">{netSettlement.debtorName}</strong> owes{' '}
                  <strong className="text-white font-extrabold">{netSettlement.creditorName}</strong>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  To achieve exact 50/50 parity
                </span>
              </div>
            </>
          )}
        </div>

        {!netSettlement.isSettled && (
          <div className="text-right">
            <span className="text-base font-black font-mono text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-xl border border-amber-500/50 shadow-inner inline-block">
              ₹{netSettlement.amountINR.toLocaleString('en-IN')}
            </span>
          </div>
        )}
      </div>

      {/* 1-Tap Action Bar: WhatsApp Share & Copy */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          type="button"
          onClick={handleWhatsAppShare}
          className="tap-active min-h-touch py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40"
        >
          <MessageSquare className="w-3.5 h-3.5 fill-white/20" />
          <span>WhatsApp Audit</span>
        </button>

        <button
          type="button"
          onClick={handleCopyAudit}
          className="tap-active min-h-touch py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-1.5"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy Breakdown</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
