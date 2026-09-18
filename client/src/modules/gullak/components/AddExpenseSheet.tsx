import React, { useState, useRef } from 'react';
import { ExpenseCategory } from '../../../shared/types';
import { COORDINATOR_MEMBERS, DUO_A_SON } from '../../../shared/config/travellers.config';
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
  Receipt
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
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState<string>(DUO_A_SON.name);
  const [category, setCategory] = useState<ExpenseCategory>('FOOD');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreviewUrl, setReceiptPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

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

      await onAddExpense({
        title: title.trim(),
        amountINR: Math.round(Number(amount)),
        paidBy,
        category,
        receiptUrl
      });
      setTitle('');
      setAmount('');
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

          {/* Paid By Coordinator Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
              Paid By (Coordinator)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {COORDINATOR_MEMBERS.map(member => {
                const isSelected = paidBy === member.name;
                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => setPaidBy(member.name)}
                    className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all tap-active ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isSelected ? 'bg-temple-gold text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">{member.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {member.duoId === 'DUO_A' ? 'Family A' : 'Family B'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
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
