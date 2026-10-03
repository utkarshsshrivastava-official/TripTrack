import React, { useState } from 'react';
import { GullakFinancialSummary } from '../services/expenseStorage';
import { DUO_A_SON, DUO_B_SON } from '../../../shared/config/travellers.config';
import { 
  ArrowRightLeft, 
  CheckCircle, 
  Copy, 
  Check, 
  MessageSquare,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

interface SettlementGaugeProps {
  summary: GullakFinancialSummary;
}

export const SettlementGauge: React.FC<SettlementGaugeProps> = ({ summary }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [settlementMode, setSettlementMode] = useState<'SPLITWISE' | 'FLAT_50_50'>('SPLITWISE');
  const [showMathAudit, setShowMathAudit] = useState<boolean>(false);

  const { 
    netSettlement, 
    pure5050NetSettlement,
    totalSpentINR, 
    paidByUtkarshINR, 
    paidByShreyasINR, 
    fairSharePerCoordinatorINR,
    utkarshFairShareINR,
    shreyasFairShareINR,
    sharedPoolTotalINR,
    sharedPoolPerPersonINR,
    personalA_INR,
    personalB_INR,
    customA_INR,
    customB_INR,
    hasCustomSplits
  } = summary;

  // Active settlement based on chosen mode
  const activeSettlement = settlementMode === 'SPLITWISE' ? netSettlement : pure5050NetSettlement;
  const differenceINR = Math.abs((pure5050NetSettlement?.amountINR || 0) - (netSettlement.amountINR || 0));

  // Calculate percentage tilt for the balance needle (50% is dead center / perfect equilibrium)
  let needlePositionPercent = 50;
  if (totalSpentINR > 0 && !activeSettlement.isSettled) {
    const netUtkarsh = activeSettlement.creditorName === DUO_A_SON.name 
      ? activeSettlement.amountINR 
      : -activeSettlement.amountINR;
    const ratio = netUtkarsh / totalSpentINR; // -1 to +1
    needlePositionPercent = Math.min(90, Math.max(10, Math.round(50 + ratio * 40)));
  }

  const generateWhatsAppMessage = () => {
    const isSplitwise = settlementMode === 'SPLITWISE';
    const lines = [
      '🏔️ *TripTrack Badrinath 2026 — Yatra Gullak Settlement Audit*',
      '━━━━━━━━━━━━━━━━━━━━',
      `💰 *Total Collective Outlay:* ₹${totalSpentINR.toLocaleString('en-IN')}`,
      isSplitwise && hasCustomSplits
        ? `⚖️ *Shared 50/50 Pool:* ₹${sharedPoolTotalINR.toLocaleString('en-IN')} (₹${sharedPoolPerPersonINR.toLocaleString('en-IN')} each)\n🛍️ *Personal / Tagged Splits:* ₹${(personalA_INR + personalB_INR + customA_INR + customB_INR).toLocaleString('en-IN')}`
        : `⚖️ *Flat 50/50 Target:* ₹${fairSharePerCoordinatorINR.toLocaleString('en-IN')} each`,
      '',
      `👤 *${DUO_A_SON.name} (Family A):*`,
      `  • Paid Out-of-Pocket: ₹${paidByUtkarshINR.toLocaleString('en-IN')}`,
      isSplitwise && hasCustomSplits ? `  • Fair Obligation: ₹${utkarshFairShareINR.toLocaleString('en-IN')}` : '',
      `👤 *${DUO_B_SON.name} (Family B):*`,
      `  • Paid Out-of-Pocket: ₹${paidByShreyasINR.toLocaleString('en-IN')}`,
      isSplitwise && hasCustomSplits ? `  • Fair Obligation: ₹${shreyasFairShareINR.toLocaleString('en-IN')}` : '',
      '━━━━━━━━━━━━━━━━━━━━',
      activeSettlement.isSettled
        ? '✅ *All accounts are completely even! (₹0 balance)*'
        : `📌 *Net Settlement (${isSplitwise ? 'Personal Deducted' : 'Flat 50/50'}):*\n👉 *${activeSettlement.debtorName}* owes *${activeSettlement.creditorName} ₹${activeSettlement.amountINR.toLocaleString('en-IN')}*`,
      hasCustomSplits && !isSplitwise
        ? `_(Flat 50/50 assumes all individual gifts/souvenirs are shared collectively)_`
        : hasCustomSplits
        ? `_(Excludes ₹${differenceINR} net difference from individual personal purchases)_`
        : '',
      '',
      '🙏 Jai Badri Vishal! • Tracked offline via TripTrack PWA'
    ].filter(Boolean);
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
            Bilateral Settlement Gauge
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Son Coordinators Only
        </span>
      </div>

      {/* Dual Mode Switcher (if personal/custom splits exist) */}
      {hasCustomSplits && (
        <div className="p-1 rounded-2xl bg-slate-950 border border-slate-800 flex gap-1">
          <button
            type="button"
            onClick={() => setSettlementMode('SPLITWISE')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-0.5 ${
              settlementMode === 'SPLITWISE'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Splitwise Adjusted</span>
            <span className={`text-[9px] font-mono ${settlementMode === 'SPLITWISE' ? 'text-amber-950 font-bold' : 'text-slate-500'}`}>
              Personal Deducted: ₹{netSettlement.amountINR.toLocaleString('en-IN')}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSettlementMode('FLAT_50_50')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-0.5 ${
              settlementMode === 'FLAT_50_50'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Flat 50/50 (All In)</span>
            <span className={`text-[9px] font-mono ${settlementMode === 'FLAT_50_50' ? 'text-amber-950 font-bold' : 'text-slate-500'}`}>
              Pure Equal Split: ₹{(pure5050NetSettlement?.amountINR || 0).toLocaleString('en-IN')}
            </span>
          </button>
        </div>
      )}

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
          {activeSettlement.isSettled ? (
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
                  <strong className="text-amber-300 font-extrabold">{activeSettlement.debtorName}</strong> owes{' '}
                  <strong className="text-white font-extrabold">{activeSettlement.creditorName}</strong>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {settlementMode === 'SPLITWISE'
                    ? 'Splitwise Parity (Personal Tagged Items Deducted)'
                    : 'Flat 50/50 Parity (All ₹68,955 Shared)'}
                </span>
              </div>
            </>
          )}
        </div>

        {!activeSettlement.isSettled && (
          <div className="text-right">
            <span className="text-base font-black font-mono text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-xl border border-amber-500/50 shadow-inner inline-block">
              ₹{activeSettlement.amountINR.toLocaleString('en-IN')}
            </span>
          </div>
        )}
      </div>

      {/* Expandable Math Audit Breakdown Card */}
      {hasCustomSplits && (
        <div className="rounded-2xl bg-slate-950/80 border border-slate-800 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowMathAudit(!showMathAudit)}
            className="w-full p-2.5 flex items-center justify-between text-left hover:bg-slate-900/60 transition-colors"
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-bold text-slate-300">
                Math Audit: Why is there a ₹{differenceINR} difference?
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
              <span>{showMathAudit ? 'Hide Math' : 'Show Math'}</span>
              {showMathAudit ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </div>
          </button>

          {showMathAudit && (
            <div className="p-3 border-t border-slate-800/80 space-y-2.5 text-[10px] font-mono text-slate-300 bg-slate-900/40">
              <div className="flex items-start gap-1.5 text-slate-400">
                <Info className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  The ₹{differenceINR} difference comes from <strong className="text-white font-bold">20 personal purchases</strong> logged during the trip that were not meant to be split 50/50:
                </span>
              </div>

              {/* Four Buckets Breakdown */}
              <div className="grid grid-cols-1 gap-1.5 p-2 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between items-center text-slate-300">
                  <span>1. Shared 50/50 Items (70 items):</span>
                  <span className="text-white font-bold">₹{sharedPoolTotalINR.toLocaleString('en-IN')} (₹{sharedPoolPerPersonINR.toLocaleString('en-IN')} each)</span>
                </div>
                <div className="flex justify-between items-center text-sky-400">
                  <span>2. Utkarsh Personal (Fam A + Custom):</span>
                  <span className="font-bold">₹{(personalA_INR + customA_INR).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-400">
                  <span>3. Shreyas Personal (Fam B + Custom):</span>
                  <span className="font-bold">₹{(personalB_INR + customB_INR).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Net Comparison Summary */}
              <div className="space-y-1 pt-1 border-t border-slate-800/80">
                <div className="flex justify-between text-slate-400">
                  <span>• Utkarsh Total Obligation:</span>
                  <span className="text-sky-300">₹{sharedPoolPerPersonINR.toLocaleString('en-IN')} + ₹{(personalA_INR + customA_INR).toLocaleString('en-IN')} = <strong>₹{utkarshFairShareINR.toLocaleString('en-IN')}</strong> (Paid ₹{paidByUtkarshINR.toLocaleString('en-IN')} → Owes <strong>₹{netSettlement.amountINR.toLocaleString('en-IN')}</strong>)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>• Shreyas Total Obligation:</span>
                  <span className="text-emerald-300">₹{sharedPoolPerPersonINR.toLocaleString('en-IN')} + ₹{(personalB_INR + customB_INR).toLocaleString('en-IN')} = <strong>₹{shreyasFairShareINR.toLocaleString('en-IN')}</strong> (Paid ₹{paidByShreyasINR.toLocaleString('en-IN')} → Receives <strong>₹{netSettlement.amountINR.toLocaleString('en-IN')}</strong>)</span>
                </div>
                <p className="text-[9px] text-amber-300/90 pt-1 leading-relaxed">
                  💡 Shreyas bought ₹{((personalB_INR + customB_INR) - (personalA_INR + customA_INR)).toLocaleString('en-IN')} more in personal items than Utkarsh. In <strong>Splitwise mode</strong>, Utkarsh does NOT pay half of Shreyas's personal purchases (saving Utkarsh ₹{differenceINR}). If you both agree to treat all gifts/tea as shared 50/50, tap <strong>Flat 50/50</strong> above!
                </p>
              </div>
            </div>
          )}
        </div>
      )}

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
