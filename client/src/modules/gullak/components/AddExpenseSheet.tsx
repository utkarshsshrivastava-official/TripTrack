import React, { useState, useRef, useEffect } from 'react';
import { Expense, ExpenseCategory, ExpenseSplitMode, PaymentMethod } from '../../../shared/types';
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
  ArrowRightLeft,
  Calendar,
  Clock,
  Pencil,
  ShoppingBag,
  HeartPulse,
  MapPin,
  CreditCard,
  Tag as TagIcon
} from 'lucide-react';

export interface SaveExpenseData {
  id?: string;
  title: string;
  amountINR: number;
  paidBy: string;
  category: ExpenseCategory;
  paymentMethod?: PaymentMethod;
  tags?: string[];
  venueName?: string;
  venueLocation?: string;
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
  createdAt?: string;
}

interface AddExpenseSheetProps {
  isOpen: boolean;
  onClose: () => void;
  editingExpense?: Expense | null;
  onSaveExpense: (data: SaveExpenseData) => Promise<void>;
}

const PRESET_AMOUNTS = [200, 500, 1000, 2500, 5000];

const PRESET_TITLES = [
  'Dhaba Lunch & Chai',
  'Temple Special Entry / Puja',
  'NH-7 Taxi Toll & Fuel',
  'Porters / Dandi Luggage',
  'Emergency Medication / Vitals',
  'Warm Shawls & Woolens',
  'Badrinath Mahaprasad Boxes',
  'Night Hotel Stay'
];

const PILGRIMAGE_DAYS = [
  { day: 'Day 1', date: '2026-09-24T13:00', label: 'Day 1 • 24 Sep', town: 'Haridwar' },
  { day: 'Day 2', date: '2026-09-25T13:00', label: 'Day 2 • 25 Sep', town: 'Rishikesh' },
  { day: 'Day 3', date: '2026-09-26T13:00', label: 'Day 3 • 26 Sep', town: 'Devprayag' },
  { day: 'Day 4', date: '2026-09-27T13:00', label: 'Day 4 • 27 Sep', town: 'Rudraprayag' },
  { day: 'Day 5', date: '2026-09-28T13:00', label: 'Day 5 • 28 Sep', town: 'Joshimath' },
  { day: 'Day 6', date: '2026-09-29T13:00', label: 'Day 6 • 29 Sep', town: 'Badrinath' },
  { day: 'Day 7', date: '2026-09-30T13:00', label: 'Day 7 • 30 Sep', town: 'Mana Village' },
  { day: 'Day 8', date: '2026-10-01T13:00', label: 'Day 8 • 01 Oct', town: 'Pipalkoti' },
  { day: 'Day 9', date: '2026-10-02T13:00', label: 'Day 9 • 02 Oct', town: 'Delhi' },
];

const QUICK_TOWNS = [
  'Haridwar',
  'Rishikesh',
  'Devprayag',
  'Srinagar',
  'Rudraprayag',
  'Karnaprayag',
  'Pipalkoti',
  'Joshimath',
  'Govindghat',
  'Pandukeshwar',
  'Badrinath',
  'Mana'
];

const SUGGESTED_TAGS = [
  'Badrinath',
  'Joshimath',
  'Haridwar',
  'Rishikesh',
  'Lunch',
  'Dinner',
  'Breakfast',
  'Chai',
  'Puja',
  'Woolens',
  'Medicine',
  'Prasad',
  'Taxi',
  'Toll',
  'Hotel',
  'Porter'
];

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: string }[] = [
  { id: 'UPI', label: 'UPI (GPay / PhonePe)', icon: '📱' },
  { id: 'CASH', label: 'Hard Cash', icon: '💵' },
  { id: 'CARD', label: 'Card (Debit / Credit)', icon: '💳' },
  { id: 'NET_BANKING', label: 'Net Banking / NEFT', icon: '🏦' },
  { id: 'OTHER', label: 'Other', icon: '🏷️' }
];

const CATEGORIES: { id: ExpenseCategory; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'FOOD', label: 'Food & Tea', icon: Utensils },
  { id: 'TOLL_TAXI', label: 'Cab & Toll', icon: Car },
  { id: 'HOTEL', label: 'Hotel & Stay', icon: Hotel },
  { id: 'SHOPPING', label: 'Shopping & Woolens', icon: ShoppingBag },
  { id: 'RITUAL', label: 'Pujas & Rituals', icon: Flame },
  { id: 'PORTER_DANDI', label: 'Porter / Dandi', icon: Accessibility },
  { id: 'MEDICAL', label: 'Medical & Vitals', icon: HeartPulse },
  { id: 'MISC', label: 'Misc & Cash', icon: MoreHorizontal },
];

function formatDateForInput(dateInput?: Date | string): string {
  const d = dateInput ? new Date(dateInput) : new Date();
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatDisplayDateTime(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return (
    d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) +
    ' • ' +
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
}

export const AddExpenseSheet: React.FC<AddExpenseSheetProps> = ({
  isOpen,
  onClose,
  editingExpense,
  onSaveExpense
}) => {
  const { activeUser } = useUserProfile();
  const isDuoB = activeUser.id === 'traveller-shreyas' || activeUser.id === 'traveller-sanjay' || activeUser.duoId === 'DUO_B';
  const defaultPayer = isDuoB ? 'SHREYAS' : 'UTKARSH';

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('FOOD');

  // Venue & Location State
  const [venueName, setVenueName] = useState('');
  const [venueLocation, setVenueLocation] = useState('');

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');

  // Layered Tagging State
  const [tags, setTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState('');

  // Custom Date & Time State
  const [expenseDateTime, setExpenseDateTime] = useState<string>(formatDateForInput(new Date()));

  // Splitwise-Grade Multi-Payer State — Auto-default to logged in coordinator
  const [payerMode, setPayerMode] = useState<'UTKARSH' | 'SHREYAS' | 'BOTH'>(defaultPayer);
  const [utkarshPaid, setUtkarshPaid] = useState('');
  const [shreyasPaid, setShreyasPaid] = useState('');

  // Splitwise-Grade Split Mode State
  const [splitMode, setSplitMode] = useState<ExpenseSplitMode>('EQUAL_50_50');
  const [utkarshOwes, setUtkarshOwes] = useState('');
  const [shreyasOwes, setShreyasOwes] = useState('');

  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreviewUrl, setReceiptPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [batchSuccessMsg, setBatchSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when opening modal or switching between add/edit
  useEffect(() => {
    if (isOpen) {
      if (editingExpense) {
        setTitle(editingExpense.title);
        setAmount(editingExpense.amountINR.toString());
        setCategory(editingExpense.category);
        setVenueName(editingExpense.venueName || '');
        setVenueLocation(editingExpense.venueLocation || '');
        setPaymentMethod(editingExpense.paymentMethod || 'UPI');
        setTags(editingExpense.tags || []);
        setCustomTagInput('');
        setBatchSuccessMsg(null);

        const hasBothPaid = Boolean(
          editingExpense.paymentSplits &&
          (Number(editingExpense.paymentSplits.utkarshPaidINR) > 0 || Number(editingExpense.paymentSplits.shreyasPaidINR) > 0)
        );

        if (hasBothPaid || editingExpense.paidBy === 'Multiple') {
          setPayerMode('BOTH');
          setUtkarshPaid(editingExpense.paymentSplits?.utkarshPaidINR ? String(editingExpense.paymentSplits.utkarshPaidINR) : '');
          setShreyasPaid(editingExpense.paymentSplits?.shreyasPaidINR ? String(editingExpense.paymentSplits.shreyasPaidINR) : '');
        } else if (editingExpense.paidBy === DUO_B_SON.name) {
          setPayerMode('SHREYAS');
          setUtkarshPaid('');
          setShreyasPaid('');
        } else {
          setPayerMode('UTKARSH');
          setUtkarshPaid('');
          setShreyasPaid('');
        }

        setSplitMode(editingExpense.splitMode || 'EQUAL_50_50');
        if (editingExpense.owedSplits) {
          setUtkarshOwes(editingExpense.owedSplits.utkarshOwesINR !== undefined ? String(editingExpense.owedSplits.utkarshOwesINR) : '');
          setShreyasOwes(editingExpense.owedSplits.shreyasOwesINR !== undefined ? String(editingExpense.owedSplits.shreyasOwesINR) : '');
        } else {
          setUtkarshOwes('');
          setShreyasOwes('');
        }

        setExpenseDateTime(formatDateForInput(editingExpense.createdAt));
        setReceiptPreviewUrl(editingExpense.receiptUrl || null);
        setReceiptFile(null);
      } else {
        // Adding new expense
        setTitle('');
        setAmount('');
        setCategory('FOOD');
        setVenueName('');
        setVenueLocation('');
        setPaymentMethod('UPI');
        setTags([]);
        setCustomTagInput('');
        setBatchSuccessMsg(null);
        setPayerMode(isDuoB ? 'SHREYAS' : 'UTKARSH');
        setUtkarshPaid('');
        setShreyasPaid('');
        setSplitMode('EQUAL_50_50');
        setUtkarshOwes('');
        setShreyasOwes('');
        setExpenseDateTime(formatDateForInput(new Date()));
        setReceiptPreviewUrl(null);
        setReceiptFile(null);
      }
    }
  }, [isOpen, editingExpense, isDuoB]);

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

  const toggleTag = (tagName: string) => {
    const clean = tagName.replace(/^#/, '').trim();
    if (!clean) return;
    setTags(prev => prev.includes(clean) ? prev.filter(t => t !== clean) : [...prev, clean]);
  };

  const handleAddCustomTag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = customTagInput.replace(/^#/, '').trim();
    if (clean && !tags.includes(clean)) {
      setTags(prev => [...prev, clean]);
      setCustomTagInput('');
    }
  };

  const handleSelectPilgrimageDay = (dayItem: typeof PILGRIMAGE_DAYS[0]) => {
    setExpenseDateTime(dayItem.date);
    if (!venueLocation || QUICK_TOWNS.includes(venueLocation) || PILGRIMAGE_DAYS.some(d => d.town === venueLocation)) {
      setVenueLocation(dayItem.town);
    }
    const cleanTag = dayItem.town.replace(' Village', '');
    if (!tags.includes(cleanTag)) {
      setTags(prev => [...prev, cleanTag]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      const url = URL.createObjectURL(file);
      setReceiptPreviewUrl(url);
    }
  };

  const handleRemoveReceipt = () => {
    if (receiptPreviewUrl && !receiptPreviewUrl.startsWith('http')) {
      URL.revokeObjectURL(receiptPreviewUrl);
    }
    setReceiptFile(null);
    setReceiptPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const setPresetTime = (hours: number, minutes: number) => {
    const current = expenseDateTime ? new Date(expenseDateTime) : new Date();
    current.setHours(hours, minutes, 0, 0);
    setExpenseDateTime(formatDateForInput(current));
  };

  const shiftDays = (deltaDays: number) => {
    const current = expenseDateTime ? new Date(expenseDateTime) : new Date();
    current.setDate(current.getDate() + deltaDays);
    setExpenseDateTime(formatDateForInput(current));
  };

  const handleSubmit = async (e?: React.FormEvent, addAnother: boolean = false) => {
    if (e) e.preventDefault();
    if (!title.trim() || !amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    if (!isPaidBalanced || !isSplitBalanced) return;

    setIsSubmitting(true);
    let finalReceiptUrl: string | undefined = receiptPreviewUrl || undefined;

    try {
      if (receiptFile) {
        if (navigator.onLine) {
          try {
            const uploadRes = await uploadMedia(receiptFile, 'receipt');
            finalReceiptUrl = uploadRes.url;
          } catch (uploadErr) {
            console.warn('⚠️ [Gullak] Cloud upload failed, falling back to local data URL:', uploadErr);
          }
        }

        // Offline or upload fallback: convert to base64 data URL
        if (!finalReceiptUrl || !finalReceiptUrl.startsWith('http')) {
          finalReceiptUrl = await new Promise<string>((resolve) => {
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

      const createdAtIso = expenseDateTime ? new Date(expenseDateTime).toISOString() : new Date().toISOString();

      await onSaveExpense({
        id: editingExpense?.id,
        title: title.trim(),
        amountINR: Math.round(totalNum),
        paidBy: computedPaidBy,
        category,
        paymentMethod,
        tags: tags.filter(t => t.trim().length > 0),
        venueName: venueName.trim() || undefined,
        venueLocation: venueLocation.trim() || undefined,
        receiptUrl: finalReceiptUrl,
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
        } : undefined,
        createdAt: createdAtIso
      });

      handleRemoveReceipt();

      if (addAnother) {
        const savedTitle = title.trim();
        const savedAmt = Math.round(totalNum);
        setTitle('');
        setAmount('');
        setVenueName('');
        setCustomTagInput('');
        setBatchSuccessMsg(`Saved ₹${savedAmt.toLocaleString('en-IN')} ("${savedTitle}")! Ready for next receipt...`);
      } else {
        onClose();
      }
    } catch (err) {
      console.error('Failed to save expense', err);
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
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center border ${
                editingExpense 
                  ? 'bg-amber-500/20 text-temple-gold border-amber-500/40' 
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              }`}>
                {editingExpense ? <Pencil className="w-4 h-4" /> : <DollarSign className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">
                  {editingExpense ? 'Edit Pilgrimage Expense' : 'Log Pilgrimage Expense'}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  {editingExpense 
                    ? `Modifying #${editingExpense.id.slice(-6)} • Update amount, split, or date` 
                    : 'Fast Post-Trip Entry • Tagging • Venue Details • Color Ledger'}
                </p>
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

        {/* Batch Success Banner when logging multiple receipts */}
        {batchSuccessMsg && (
          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2 truncate">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">{batchSuccessMsg}</span>
            </div>
            <button 
              type="button" 
              onClick={() => setBatchSuccessMsg(null)}
              className="text-slate-400 hover:text-white ml-2 text-xs"
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={e => handleSubmit(e, false)} className="space-y-4">
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
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {PRESET_AMOUNTS.map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleSelectPresetAmount(val)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border transition-all tap-active shrink-0 ${
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

          {/* 📅 Date & Time Picker Section + Post-Trip Pilgrimage Day Fast Selectors */}
          <div className="space-y-2 p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-temple-gold" />
                <span>Transaction Date & Time</span>
              </label>
              {expenseDateTime && (
                <span className="text-[10px] font-mono text-amber-300 font-bold truncate max-w-[190px]">
                  {formatDisplayDateTime(expenseDateTime)}
                </span>
              )}
            </div>

            {/* Pilgrimage Day Fast Presets */}
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 block">
                ⚡ Fast Pilgrimage Day Presets (Auto-fills date, town & tag):
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {PILGRIMAGE_DAYS.map(dayItem => (
                  <button
                    key={dayItem.day}
                    type="button"
                    onClick={() => handleSelectPilgrimageDay(dayItem)}
                    className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-amber-400/80 text-[10px] font-bold text-slate-300 hover:text-amber-300 transition-all shrink-0 tap-active"
                  >
                    <span>{dayItem.label}</span>
                    <span className="text-slate-500 font-normal ml-1">({dayItem.town})</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative pt-1">
              <input
                type="datetime-local"
                required
                value={expenseDateTime}
                onChange={e => setExpenseDateTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white focus:outline-none focus:border-temple-gold shadow-inner"
              />
            </div>

            {/* Quick Timestamp Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
              <button
                type="button"
                onClick={() => setExpenseDateTime(formatDateForInput(new Date()))}
                className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[10px] text-slate-300 hover:text-amber-300 hover:border-amber-500/40 flex items-center gap-1 tap-active shrink-0"
              >
                <Clock className="w-2.5 h-2.5 text-temple-gold" />
                <span>Now</span>
              </button>
              <button
                type="button"
                onClick={() => setPresetTime(9, 0)}
                className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[10px] text-slate-300 hover:text-amber-300 hover:border-amber-500/40 flex items-center gap-1 tap-active shrink-0"
              >
                <span>🌅 Morning (9 AM)</span>
              </button>
              <button
                type="button"
                onClick={() => setPresetTime(14, 0)}
                className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[10px] text-slate-300 hover:text-amber-300 hover:border-amber-500/40 flex items-center gap-1 tap-active shrink-0"
              >
                <span>☀️ Afternoon (2 PM)</span>
              </button>
              <button
                type="button"
                onClick={() => setPresetTime(20, 30)}
                className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[10px] text-slate-300 hover:text-amber-300 hover:border-amber-500/40 flex items-center gap-1 tap-active shrink-0"
              >
                <span>🌙 Dinner (8:30 PM)</span>
              </button>
              <button
                type="button"
                onClick={() => shiftDays(-1)}
                className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[10px] text-slate-300 hover:text-amber-300 hover:border-amber-500/40 flex items-center gap-1 tap-active shrink-0"
              >
                <span>📅 Yesterday</span>
              </button>
            </div>
          </div>

          {/* 📍 Venue & Location Details (Optional for Hotel, Restaurant, Shop) */}
          <div className="space-y-2 p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>Venue & Location (Optional)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={venueName}
                  onChange={e => setVenueName(e.target.value)}
                  placeholder="Venue / Hotel / Dhaba Name"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400"
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={venueLocation}
                  onChange={e => setVenueLocation(e.target.value)}
                  placeholder="Town / Location (e.g. Badrinath)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>

            {/* Quick Town Chips for 1-Tap Location setting */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
              <span className="text-[9px] uppercase font-bold text-slate-500 shrink-0">Towns:</span>
              {QUICK_TOWNS.map(town => (
                <button
                  key={town}
                  type="button"
                  onClick={() => {
                    setVenueLocation(town);
                    if (!tags.includes(town)) {
                      setTags(prev => [...prev, town]);
                    }
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border transition-all shrink-0 tap-active ${
                    venueLocation === town
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {town}
                </button>
              ))}
            </div>
          </div>

          {/* 💳 Payment Method Selector */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-sky-400" />
              <span>Payment Method</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {PAYMENT_METHODS.map(method => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-bold border transition-all tap-active flex items-center gap-2 ${
                    paymentMethod === method.id
                      ? 'bg-sky-500/20 border-sky-400 text-sky-300 shadow'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="text-sm">{method.icon}</span>
                  <span className="truncate text-[11px]">{method.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 🏷️ Layered Tagging System */}
          <div className="space-y-2 p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <TagIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Layered Tags & Filters</span>
              </label>
              <span className="text-[10px] font-mono text-slate-400">
                {tags.length} selected
              </span>
            </div>

            {/* Active Selected Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pb-1">
                {tags.map(t => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold font-mono"
                  >
                    <span>#{t}</span>
                    <button
                      type="button"
                      onClick={() => toggleTag(t)}
                      className="hover:text-rose-400 ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Quick Suggested Tags */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold block">
                Quick Tags (Tap to toggle):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_TAGS.map(st => {
                  const isSelected = tags.includes(st);
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => toggleTag(st)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-medium border transition-all tap-active ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      #{st}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Tag Input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={customTagInput}
                onChange={e => setCustomTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomTag();
                  }
                }}
                placeholder="Type custom tag and press Enter..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={() => handleAddCustomTag()}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 text-xs font-bold tap-active shrink-0"
              >
                + Add Tag
              </button>
            </div>
          </div>

          {/* Who Paid Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Who Paid from Pocket?</span>
              </label>
              <span className="text-[10px] font-mono text-slate-400">
                Payer Split
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setPayerMode('UTKARSH');
                  setUtkarshPaid('');
                  setShreyasPaid('');
                }}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition-all tap-active ${
                  payerMode === 'UTKARSH'
                    ? 'bg-sky-500/20 border-sky-400 text-sky-300 shadow-lg shadow-sky-950/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-[10px]">
                  U
                </div>
                <span>{DUO_A_SON.name}</span>
                <span className="text-[9px] font-mono text-slate-500">100% Out of Pocket</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPayerMode('SHREYAS');
                  setUtkarshPaid('');
                  setShreyasPaid('');
                }}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition-all tap-active ${
                  payerMode === 'SHREYAS'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-950/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                  S
                </div>
                <span>{DUO_B_SON.name}</span>
                <span className="text-[9px] font-mono text-slate-500">100% Out of Pocket</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPayerMode('BOTH');
                  if (totalNum > 0) {
                    setUtkarshPaid(Math.round(totalNum / 2).toString());
                    setShreyasPaid((totalNum - Math.round(totalNum / 2)).toString());
                  }
                }}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition-all tap-active ${
                  payerMode === 'BOTH'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-lg shadow-amber-950/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                  U+S
                </div>
                <span>Both Paid</span>
                <span className="text-[9px] font-mono text-slate-500">Custom Payer Split</span>
              </button>
            </div>

            {/* Custom Multi-Payer Breakdown if BOTH chosen */}
            {payerMode === 'BOTH' && (
              <div className="p-3 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-2.5 animate-in fade-in">
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-300">
                  <span>Enter amounts contributed by each:</span>
                  <span className="font-mono">Total: ₹{totalNum}</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">
                      {DUO_A_SON.name} Paid
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-amber-400">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={utkarshPaid}
                        onChange={e => {
                          const val = e.target.value;
                          setUtkarshPaid(val);
                          const num = Number(val) || 0;
                          if (totalNum > 0) {
                            setShreyasPaid(Math.max(0, totalNum - num).toString());
                          }
                        }}
                        className="w-full pl-6 pr-2 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-400"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">
                      {DUO_B_SON.name} Paid
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-amber-400">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={shreyasPaid}
                        onChange={e => {
                          const val = e.target.value;
                          setShreyasPaid(val);
                          const num = Number(val) || 0;
                          if (totalNum > 0) {
                            setUtkarshPaid(Math.max(0, totalNum - num).toString());
                          }
                        }}
                        className="w-full pl-6 pr-2 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-400"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {!isPaidBalanced && totalNum > 0 && (
                  <p className="text-[10px] font-mono text-rose-400 flex items-center gap-1">
                    <span>⚠️ Payer sum (₹{liveUPaid + liveSPaid}) does not equal total amount (₹{totalNum})</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Split Mode Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                <span>How is this bill split?</span>
              </label>
              <span className="text-[10px] font-mono text-slate-400">
                Responsibility
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => setSplitMode('EQUAL_50_50')}
                className={`p-2.5 rounded-xl border text-[11px] font-bold transition-all tap-active flex flex-col items-center gap-1 ${
                  splitMode === 'EQUAL_50_50'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span>50 / 50</span>
                <span className="text-[9px] font-mono text-slate-500">Shared Trip</span>
              </button>

              <button
                type="button"
                onClick={() => setSplitMode('FULL_FAMILY_A')}
                className={`p-2.5 rounded-xl border text-[11px] font-bold transition-all tap-active flex flex-col items-center gap-1 ${
                  splitMode === 'FULL_FAMILY_A'
                    ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span>100% Fam A</span>
                <span className="text-[9px] font-mono text-slate-500">{DUO_A_SON.name}'s Family</span>
              </button>

              <button
                type="button"
                onClick={() => setSplitMode('FULL_FAMILY_B')}
                className={`p-2.5 rounded-xl border text-[11px] font-bold transition-all tap-active flex flex-col items-center gap-1 ${
                  splitMode === 'FULL_FAMILY_B'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span>100% Fam B</span>
                <span className="text-[9px] font-mono text-slate-500">{DUO_B_SON.name}'s Family</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSplitMode('CUSTOM_AMOUNTS');
                  if (totalNum > 0) {
                    setUtkarshOwes(Math.round(totalNum / 2).toString());
                    setShreyasOwes((totalNum - Math.round(totalNum / 2)).toString());
                  }
                }}
                className={`p-2.5 rounded-xl border text-[11px] font-bold transition-all tap-active flex flex-col items-center gap-1 ${
                  splitMode === 'CUSTOM_AMOUNTS'
                    ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span>Custom</span>
                <span className="text-[9px] font-mono text-slate-500">Unequal Split</span>
              </button>
            </div>

            {/* Custom Split breakdown if CUSTOM_AMOUNTS chosen */}
            {splitMode === 'CUSTOM_AMOUNTS' && (
              <div className="p-3 rounded-2xl bg-slate-950/90 border border-indigo-500/30 space-y-2.5 animate-in fade-in">
                <div className="flex items-center justify-between text-[11px] font-bold text-indigo-300">
                  <span>Enter share owed by each family:</span>
                  <span className="font-mono">Total: ₹{totalNum}</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">
                      {DUO_A_SON.name}'s Share
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-indigo-400">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={utkarshOwes}
                        onChange={e => {
                          const val = e.target.value;
                          setUtkarshOwes(val);
                          const num = Number(val) || 0;
                          if (totalNum > 0) {
                            setShreyasOwes(Math.max(0, totalNum - num).toString());
                          }
                        }}
                        className="w-full pl-6 pr-2 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white focus:outline-none focus:border-indigo-400"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">
                      {DUO_B_SON.name}'s Share
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-indigo-400">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={shreyasOwes}
                        onChange={e => {
                          const val = e.target.value;
                          setShreyasOwes(val);
                          const num = Number(val) || 0;
                          if (totalNum > 0) {
                            setUtkarshOwes(Math.max(0, totalNum - num).toString());
                          }
                        }}
                        className="w-full pl-6 pr-2 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white focus:outline-none focus:border-indigo-400"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {!isSplitBalanced && totalNum > 0 && (
                  <p className="text-[10px] font-mono text-rose-400 flex items-center gap-1">
                    <span>⚠️ Owed sum (₹{liveUOwes + liveSOwes}) does not equal total amount (₹{totalNum})</span>
                  </p>
                )}
              </div>
            )}

            {/* Splitwise-Grade Impact Summary Preview */}
            {totalNum > 0 && (
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center justify-between">
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
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
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
                      {receiptFile ? `Ready to upload (${Math.round(receiptFile.size / 1024)} KB)` : 'Existing bill saved'}
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

          {/* Submit Actions: Save & Add Next (Continuous Bulk Entry) vs Save & Finish */}
          <div className="pt-2">
            {editingExpense ? (
              <button
                type="submit"
                disabled={isSubmitting}
                className="tap-active min-h-touch w-full py-3.5 rounded-2xl font-black text-sm shadow-xl border flex items-center justify-center gap-2 hover:brightness-110 transition-all bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 border-emerald-300/40 shadow-emerald-950/50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={e => handleSubmit(e, true)}
                  className="tap-active min-h-touch py-3.5 px-3 rounded-2xl font-black text-xs shadow-lg border flex items-center justify-center gap-2 transition-all bg-slate-800 hover:bg-slate-750 text-emerald-300 border-emerald-500/40 hover:border-emerald-400"
                  title="Save this receipt and keep date/town ready for the next one"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  <span>Save & Add Next (+)</span>
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="tap-active min-h-touch py-3.5 px-3 rounded-2xl font-black text-xs shadow-xl border flex items-center justify-center gap-2 hover:brightness-110 transition-all bg-gradient-to-r from-temple-saffron via-amber-500 to-amber-600 text-slate-950 border-amber-300/40 shadow-amber-950/50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                      <span>Saving to Dexie...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save to Gullak Pool</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
