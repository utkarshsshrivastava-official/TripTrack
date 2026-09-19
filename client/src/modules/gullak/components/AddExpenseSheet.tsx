import React, { useState, useRef, useEffect } from 'react';
import { ExpenseCategory, ExpenseSplitMode } from '../../../shared/types';
import { DUO_A_SON, DUO_B_SON } from '../../../shared/config/travellers.config';
import { useUserProfile } from '../../../shared/hooks/useUserProfile';
import { uploadMedia } from '../../../shared/services/mediaService';
import { 
  X, 
  PlusCircle, 
  Car, 
  Flame, 
  Utensils, 
  Hotel, 
  Accessibility, 
  MoreHorizontal,
  DollarSign,
  Sparkles,
  Camera,
  Trash2,
  Receipt,
  Users,
  Scale,
  CheckCircle2,
  ArrowRightLeft
} from 'lucide-react';

interface AddExpenseSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: (data: {
    title: string;
    amountINR: number;
    paidBy: string;
    category: ExpenseCategory;
    receiptUrl?: string;
    paymentSplits?: {
      utkarshPaidINR: number;
      shreyasPaidINR: number;
    };
    splitMode?: ExpenseSplitMode;
    owedSplits?: {
      utkarshOwesINR: number;
      shreyasOwesINR: number;
    };
  }) => Promise<void>;
}

const PRESET_AMOUNTS = [200, 500, 1000, 2500, 5000];

const PRESET_TITLES = [
  'Dhaba Lunch & Chai',
  'Temple Special Entry / Puja',
  'NH-7 Taxi Toll & Fuel',
  'Porters / Dandi Luggage',
  'Emergency Medication / Vitals'
];

const CATEGORIES: { id: ExpenseCategory; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'FOOD', label: 'Food & Tea', icon: Utensils },
  { id: 'TOLL_TAXI', label: 'Cab & Toll', icon: Car },
  { id: 'RITUAL', label: 'Pujas & Rituals', icon: Flame },
  { id: 'HOTEL', label: 'Hotel & Stay', icon: Hotel },
  { id: 'PORTER_DANDI', label: 'Porter / Dandi', icon: Accessibility },
  { id: 'MISC', label: 'Medical & Misc', icon: MoreHorizontal },
];

export const AddExpenseSheet: React.FC<AddExpenseSheetProps> = ({
  isOpen,
  onClose,
  onAddExpense
}) => {
  const { activeUser } = useUserProfile();
  const isDuoB = activeUser.id === 'traveller-shreyas' || activeUser.id === 'traveller-sanjay' || activeUser.duoId === 'DUO_B';
  const defaultPayer = isDuoB ? 'SHREYAS' : 'UTKARSH';

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('FOOD');

  // Splitwise-Grade Multi-Payer State — Auto-default to logged in coordinator
  const [payerMode, setPayerMode] = useState<'UTKARSH' | 'SHREYAS' | 'BOTH'>(defaultPayer);
  const [utkarshPaid, setUtkarshPaid] = useState('');
  const [shreyasPaid, setShreyasPaid] = useState('');

  // Auto-sync payer when user profile changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setPayerMode(isDuoB ? 'SHREYAS' : 'UTKARSH');
    }
  }, [isOpen, isDuoB]);

  // Splitwise-Grade Split Mode State
  const [splitMode, setSplitMode] = useState<ExpenseSplitMode>('EQUAL_50_50');
  const [utkarshOwes, setUtkarshOwes] = useState('');
  const [shreyasOwes, setShreyasOwes] = useState('');


  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreviewUrl, setReceiptPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const totalNum = Number(amount) || 0;

  // Live Contribution Calculations
  let liveUPaid = 0;
  let liveSPaid = 0;
  if (payerMode === 'UTKARSH') {
    liveUPaid = totalNum;
    liveSPaid = 0;
  } else if (payerMode === 'SHREYAS') {
    liveUPaid = 0;
    liveSPaid = totalNum;
  } else {
    liveUPaid = Number(utkarshPaid) || 0;
    liveSPaid = Number(shreyasPaid) || 0;
  }

  // Live Share Owed Calculations
  let liveUOwes = 0;
  let liveSOwes = 0;
  if (splitMode === 'FULL_FAMILY_A') {
    liveUOwes = totalNum;
    liveSOwes = 0;
  } else if (splitMode === 'FULL_FAMILY_B') {
    liveUOwes = 0;
    liveSOwes = totalNum;
  } else if (splitMode === 'CUSTOM_AMOUNTS') {
    liveUOwes = Number(utkarshOwes) || 0;
    liveSOwes = Number(shreyasOwes) || 0;
  } else {
    // 50/50 Equal
    liveUOwes = totalNum / 2;
    liveSOwes = totalNum / 2;
  }

  const liveNetUtkarsh = Math.round(liveUPaid - liveUOwes);
  const isPaidBalanced = payerMode !== 'BOTH' || (Math.round(liveUPaid + liveSPaid) === Math.round(totalNum) && totalNum > 0);
  const isSplitBalanced = splitMode !== 'CUSTOM_AMOUNTS' || (Math.round(liveUOwes + liveSOwes) === Math.round(totalNum) && totalNum > 0);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      const url = URL.createObjectURL(file);
      setReceiptPreviewUrl(url);
    }
  };

  const handleRemoveReceipt = () => {
    if (receiptPreviewUrl) {
      URL.revokeObjectURL(receiptPreviewUrl);
    }
    setReceiptFile(null);
    setReceiptPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    if (!isPaidBalanced || !isSplitBalanced) return;

    setIsSubmitting(true);
    let receiptUrl: string | undefined = undefined;

    try {
      if (receiptFile) {
        if (navigator.onLine) {
          try {
            const uploadRes = await uploadMedia(receiptFile, 'receipt');
            receiptUrl = uploadRes.url;
          } catch (uploadErr) {
            console.warn('⚠️ [Gullak] Cloud upload failed, falling back to local data URL:', uploadErr);
          }
        }

        // Offline or upload fallback: convert to base64 data URL
        if (!receiptUrl) {
          receiptUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(receiptFile);
          });
        }
      }

      const computedPaidBy = payerMode === 'UTKARSH' 
        ? DUO_A_SON.name 
        : payerMode === 'SHREYAS' 
          ? DUO_B_SON.name 
          : 'Multiple';

      await onAddExpense({
        title: title.trim(),
        amountINR: Math.round(totalNum),
        paidBy: computedPaidBy,
        category,
        receiptUrl,
        paymentSplits: payerMode === 'BOTH' ? {
          utkarshPaidINR: Math.round(liveUPaid),
          shreyasPaidINR: Math.round(liveSPaid)
        } : undefined,
        splitMode,
        owedSplits: splitMode === 'CUSTOM_AMOUNTS' ? {
          utkarshOwesINR: Math.round(liveUOwes),
          shreyasOwesINR: Math.round(liveSOwes)
        } : splitMode === 'FULL_FAMILY_A' ? {
          utkarshOwesINR: Math.round(totalNum),
          shreyasOwesINR: 0
        } : splitMode === 'FULL_FAMILY_B' ? {
          utkarshOwesINR: 0,
          shreyasOwesINR: Math.round(totalNum)
        } : undefined
      });
      setTitle('');
      setAmount('');
      setPayerMode('UTKARSH');
      setUtkarshPaid('');
      setShreyasPaid('');
      setSplitMode('EQUAL_50_50');
      setUtkarshOwes('');
      setShreyasOwes('');
      handleRemoveReceipt();
      onClose();
    } catch (err) {
      console.error('Failed to log expense', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectPresetAmount = (val: number) => {
    setAmount(val.toString());
    if (payerMode === 'BOTH') {
      setUtkarshPaid(Math.round(val / 2).toString());
      setShreyasPaid((val - Math.round(val / 2)).toString());
    }
    if (splitMode === 'CUSTOM_AMOUNTS') {
      setUtkarshOwes(Math.round(val / 2).toString());
      setShreyasOwes((val - Math.round(val / 2)).toString());
    }
  };

  const handleSelectPresetTitle = (t: string) => {
    setTitle(t);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div 
        className="w-full max-w-lg bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Grab Bar & Header */}
        <div className="flex flex-col items-center gap-1.5 pb-2 border-b border-slate-800">
          <div className="w-10 h-1 rounded-full bg-slate-700 sm:hidden" />
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-temple-gold flex items-center justify-center border border-amber-500/30">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">Log Pilgrimage Expense</h3>
                <p className="text-[11px] text-slate-400 font-mono">Shared 50/50 between Son Coordinators</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white tap-active"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount Input with Quick Preset Chips */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
              Expense Amount (₹ INR)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold font-mono text-amber-400">
                ₹
              </span>
              <input
                type="number"
                required
                min="1"
                step="1"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0"
                className="w-full pl-8 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-xl font-black font-mono text-white placeholder-slate-600 focus:outline-none focus:border-temple-gold shadow-inner"
              />
            </div>

            {/* Fast Preset Amount Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {PRESET_AMOUNTS.map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleSelectPresetAmount(val)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border transition-all tap-active ${
                    amount === val.toString()
                      ? 'bg-temple-gold text-slate-950 border-amber-400 shadow'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  ₹{val.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          {/* Description Input & Quick Suggestion Chips */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
              Expense Description
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Satvik Thalis for 4 at Srinagar"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-temple-gold"
            />

            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {PRESET_TITLES.map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleSelectPresetTitle(preset)}
                  className="px-2 py-0.5 rounded-lg bg-slate-950/70 border border-slate-800 text-[10px] text-slate-400 hover:text-amber-300 hover:border-amber-500/40 transition-all flex items-center gap-1 tap-active"
                >
                  <Sparkles className="w-2.5 h-2.5 text-temple-gold" />
                  <span>{preset}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 1. Who Paid? (Splitwise Multi-Payer Selector) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Who Paid for this Bill?
              </label>
              {payerMode === 'BOTH' && (
                <span className="text-[10px] font-mono text-purple-300 font-bold flex items-center gap-1">
                  <Users className="w-3 h-3 text-purple-400" /> Split Payment
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setPayerMode('UTKARSH')}
                className={`p-2.5 rounded-2xl border text-center flex flex-col items-center gap-1 transition-all tap-active ${
                  payerMode === 'UTKARSH'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-xs font-bold leading-tight truncate w-full flex items-center justify-center gap-1">
                  <span>{DUO_A_SON.name}</span>
                  {!isDuoB && (
                    <span className="text-[9px] px-1 rounded bg-amber-500/30 text-amber-300 font-extrabold">You</span>
                  )}
                </span>
                <span className="text-[9px] font-mono text-slate-400">Paid 100%</span>
              </button>

              <button
                type="button"
                onClick={() => setPayerMode('SHREYAS')}
                className={`p-2.5 rounded-2xl border text-center flex flex-col items-center gap-1 transition-all tap-active ${
                  payerMode === 'SHREYAS'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-xs font-bold leading-tight truncate w-full flex items-center justify-center gap-1">
                  <span>{DUO_B_SON.name}</span>
                  {isDuoB && (
                    <span className="text-[9px] px-1 rounded bg-amber-500/30 text-amber-300 font-extrabold">You</span>
                  )}
                </span>
                <span className="text-[9px] font-mono text-slate-400">Paid 100%</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPayerMode('BOTH');
                  if (!utkarshPaid && !shreyasPaid && totalNum > 0) {
                    setUtkarshPaid(Math.round(totalNum / 2).toString());
                    setShreyasPaid((totalNum - Math.round(totalNum / 2)).toString());
                  }
                }}
                className={`p-2.5 rounded-2xl border text-center flex flex-col items-center gap-1 transition-all tap-active ${
                  payerMode === 'BOTH'
                    ? 'bg-purple-500/25 border-purple-500 text-purple-200 shadow-md font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-xs font-bold leading-tight flex items-center justify-center gap-1">
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  <span>Both Paid</span>
                </span>
                <span className="text-[9px] font-mono text-slate-400">Custom ₹ Shares</span>
              </button>
            </div>

            {/* When BOTH is selected, show dual inputs with auto-balance */}
            {payerMode === 'BOTH' && (
              <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-800/60 space-y-2.5 animate-in fade-in">
                <div className="flex items-center justify-between text-[11px] font-bold text-purple-200">
                  <span>Enter contributions for ₹{totalNum || 0} bill:</span>
                  {isPaidBalanced ? (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3 h-3" /> Exact Balance
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        const diff = totalNum - (Number(utkarshPaid) || 0);
                        setShreyasPaid(Math.max(0, diff).toString());
                      }}
                      className="text-[10px] text-amber-300 underline font-mono tap-active"
                    >
                      Auto-balance Shreyas
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-mono text-purple-300 block mb-1 font-bold">
                      {DUO_A_SON.name} Paid
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-purple-400">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={utkarshPaid}
                        onChange={e => {
                          const val = e.target.value;
                          setUtkarshPaid(val);
                          if (totalNum > 0 && val !== '') {
                            setShreyasPaid(Math.max(0, totalNum - Number(val)).toString());
                          }
                        }}
                        placeholder="0"
                        className="w-full pl-6 pr-2 py-2 rounded-xl bg-slate-950 border border-purple-700/50 text-xs font-mono font-bold text-white focus:outline-none focus:border-purple-400 shadow-inner"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-purple-300 block mb-1 font-bold">
                      {DUO_B_SON.name} Paid
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-purple-400">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={shreyasPaid}
                        onChange={e => setShreyasPaid(e.target.value)}
                        placeholder="0"
                        className="w-full pl-6 pr-2 py-2 rounded-xl bg-slate-950 border border-purple-700/50 text-xs font-mono font-bold text-white focus:outline-none focus:border-purple-400 shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                {!isPaidBalanced && totalNum > 0 && (
                  <p className="text-[10px] text-rose-400 font-mono">
                    ⚠️ Total contributions (₹{(Number(utkarshPaid) || 0) + (Number(shreyasPaid) || 0)}) must equal bill total (₹{totalNum}).
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 2. Split How? (Splitwise Split Mode) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                <span>Split Between Families</span>
              </label>
              <span className="text-[10px] font-mono text-slate-400">
                {splitMode === 'EQUAL_50_50' ? '50/50 Equal' : splitMode === 'FULL_FAMILY_A' ? '100% Family A' : splitMode === 'FULL_FAMILY_B' ? '100% Family B' : 'Custom'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => setSplitMode('EQUAL_50_50')}
                className={`p-2 rounded-xl border text-center transition-all tap-active ${
                  splitMode === 'EQUAL_50_50'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-[11px] font-bold">⚖️ 50-50 Equal</div>
                <div className="text-[9px] font-mono text-slate-400">Shared meal/cab</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSplitMode('CUSTOM_AMOUNTS');
                  if (!utkarshOwes && !shreyasOwes && totalNum > 0) {
                    setUtkarshOwes(Math.round(totalNum / 2).toString());
                    setShreyasOwes((totalNum - Math.round(totalNum / 2)).toString());
                  }
                }}
                className={`p-2 rounded-xl border text-center transition-all tap-active ${
                  splitMode === 'CUSTOM_AMOUNTS'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-[11px] font-bold">✏️ Custom Share</div>
                <div className="text-[9px] font-mono text-slate-400">Exact amounts</div>
              </button>

              <button
                type="button"
                onClick={() => setSplitMode('FULL_FAMILY_A')}
                className={`p-2 rounded-xl border text-center transition-all tap-active ${
                  splitMode === 'FULL_FAMILY_A'
                    ? 'bg-indigo-950/60 border-indigo-500 text-indigo-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-[11px] font-bold">🅰️ 100% Fam A</div>
                <div className="text-[9px] font-mono text-slate-400">Utkarsh & Papa</div>
              </button>

              <button
                type="button"
                onClick={() => setSplitMode('FULL_FAMILY_B')}
                className={`p-2 rounded-xl border text-center transition-all tap-active ${
                  splitMode === 'FULL_FAMILY_B'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-[11px] font-bold">🅱️ 100% Fam B</div>
                <div className="text-[9px] font-mono text-slate-400">Shreyas & Sanjay</div>
              </button>
            </div>

            {/* Custom Share Inputs */}
            {splitMode === 'CUSTOM_AMOUNTS' && (
              <div className="p-3 rounded-2xl bg-slate-950 border border-amber-600/40 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between text-[10px] font-bold text-amber-300">
                  <span>Who was responsible for what share?</span>
                  {!isSplitBalanced && (
                    <button
                      type="button"
                      onClick={() => {
                        const diff = totalNum - (Number(utkarshOwes) || 0);
                        setShreyasOwes(Math.max(0, diff).toString());
                      }}
                      className="text-amber-400 underline font-mono tap-active"
                    >
                      Auto-balance
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block mb-1">
                      {DUO_A_SON.name} Share
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={utkarshOwes}
                        onChange={e => {
                          const val = e.target.value;
                          setUtkarshOwes(val);
                          if (totalNum > 0 && val !== '') {
                            setShreyasOwes(Math.max(0, totalNum - Number(val)).toString());
                          }
                        }}
                        placeholder="0"
                        className="w-full pl-6 pr-2 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-400 shadow-inner"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block mb-1">
                      {DUO_B_SON.name} Share
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={shreyasOwes}
                        onChange={e => setShreyasOwes(e.target.value)}
                        placeholder="0"
                        className="w-full pl-6 pr-2 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-400 shadow-inner"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Live Splitwise Settlement Result Banner */}
            {totalNum > 0 && isPaidBalanced && isSplitBalanced && (
              <div className={`p-2.5 rounded-2xl border flex items-center justify-between text-xs font-bold ${
                liveNetUtkarsh === 0
                  ? 'bg-slate-950/80 border-slate-800 text-slate-300'
                  : liveNetUtkarsh > 0
                    ? 'bg-amber-950/50 border-amber-500/40 text-amber-200'
                    : 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
              }`}>
                <div className="flex items-center gap-1.5 truncate">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">
                    {liveNetUtkarsh > 0
                      ? `${DUO_B_SON.name} will owe ${DUO_A_SON.name} ₹${liveNetUtkarsh}`
                      : liveNetUtkarsh < 0
                        ? `${DUO_A_SON.name} will owe ${DUO_B_SON.name} ₹${Math.abs(liveNetUtkarsh)}`
                        : 'Balanced: No debt created between families'}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0 pl-1">
                  Splitwise Math
                </span>
              </div>
            )}
          </div>

          {/* Category Selector Grid */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
              Spending Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-2.5 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 border transition-all tap-active ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px] text-center leading-tight">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Receipt Photo Attachment */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-amber-400" />
                <span>Bill / Receipt Proof</span>
                <span className="text-[10px] text-slate-500 font-normal">(Optional • Cloudinary)</span>
              </label>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />

            {receiptPreviewUrl ? (
              <div className="relative rounded-2xl bg-slate-950 border border-amber-500/40 p-2.5 flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={receiptPreviewUrl}
                    alt="Receipt preview"
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {receiptFile?.name || 'Receipt Photo Attached'}
                    </p>
                    <p className="text-[10px] font-mono text-emerald-400">
                      Ready to upload ({Math.round((receiptFile?.size || 0) / 1024)} KB)
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveReceipt}
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-rose-950/30 tap-active shrink-0 min-h-touch min-w-touch flex items-center justify-center"
                  title="Remove Receipt"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="tap-active min-h-touch w-full py-2.5 px-3 rounded-2xl bg-slate-950 border border-dashed border-slate-700 hover:border-amber-500/60 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-all hover:bg-slate-900"
              >
                <Camera className="w-4 h-4 text-amber-400" />
                <span>Take Photo / Attach Receipt Bill</span>
              </button>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="tap-active min-h-touch w-full py-3.5 rounded-2xl bg-gradient-to-r from-temple-saffron via-amber-500 to-amber-600 text-slate-950 font-black text-sm shadow-xl shadow-amber-950/50 border border-amber-300/40 flex items-center justify-center gap-2 hover:brightness-110 transition-all"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                  <span>Saving to Dexie...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Save to Gullak Pool</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
