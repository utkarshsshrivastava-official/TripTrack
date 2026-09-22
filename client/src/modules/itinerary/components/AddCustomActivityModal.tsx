import React, { useState } from 'react';
import { CustomActivity, SightseeingCategory, TimeSlot } from '../../../shared/types';
import { 
  X, 
  PlusCircle, 
  Clock, 
  HeartHandshake, 
  Tag, 
  Sparkles,
  MapPin
} from 'lucide-react';

interface AddCustomActivityModalProps {
  isOpen: boolean;
  dayId: string;
  dayTitle: string;
  onClose: () => void;
  onSave: (activity: CustomActivity, addToTimeline: boolean) => Promise<void>;
}

const TIME_SLOT_OPTIONS: { value: TimeSlot; label: string; timeRange: string }[] = [
  { value: 'MORNING', label: 'Morning', timeRange: '08:00 – 12:00' },
  { value: 'AFTERNOON', label: 'Afternoon', timeRange: '12:00 – 16:00' },
  { value: 'EVENING', label: 'Evening', timeRange: '16:00 – 20:00' },
  { value: 'FLEXIBLE', label: 'Flexible', timeRange: 'Anytime today' },
];

const CATEGORY_OPTIONS: { value: SightseeingCategory; label: string; icon: string }[] = [
  { value: 'TEMPLE', label: 'Temple / Darshan', icon: '🛕' },
  { value: 'GHAT_AARTI', label: 'Ghat / Ganga Aarti', icon: '🌊' },
  { value: 'ROPEWAY', label: 'Ropeway / Cable Car', icon: '🚠' },
  { value: 'HERITAGE', label: 'Heritage / Ashram', icon: '🏛️' },
  { value: 'NATURE_VIEW', label: 'Nature / Sangam', icon: '🏞️' },
  { value: 'SHOPPING', label: 'Bazaar / Sweets', icon: '🛍️' },
];

export const AddCustomActivityModal: React.FC<AddCustomActivityModalProps> = ({
  isOpen,
  dayId,
  dayTitle,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('AFTERNOON');
  const [category, setCategory] = useState<SightseeingCategory>('TEMPLE');
  const [elderComfortNote, setElderComfortNote] = useState('');
  const [addToTimeline, setAddToTimeline] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const newActivity: CustomActivity = {
        id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        dayId,
        title: title.trim(),
        timeSlot,
        category,
        elderComfortNote: elderComfortNote.trim() || undefined,
        createdAt: new Date().toISOString()
      };

      await onSave(newActivity, addToTimeline);
      // Reset form and close
      setTitle('');
      setElderComfortNote('');
      onClose();
    } catch (err) {
      console.error('Failed to save custom activity:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Add Custom Activity</h3>
              <p className="text-xs text-amber-300/90 flex items-center gap-1 font-medium">
                <MapPin className="w-3 h-3" />
                {dayTitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center tap-active"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto no-scrollbar">
          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Activity / Stop Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Moti Bazaar Sweets, Chandi Devi Ropeway"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Time Slot Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              Preferred Time Slot
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TIME_SLOT_OPTIONS.map(slot => {
                const isSelected = timeSlot === slot.value;
                return (
                  <button
                    key={slot.value}
                    type="button"
                    onClick={() => setTimeSlot(slot.value)}
                    className={`p-2.5 rounded-xl border text-left transition-all tap-active ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500/80 text-white shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs font-bold">{slot.label}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{slot.timeRange}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-emerald-400" />
              Category
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {CATEGORY_OPTIONS.map(cat => {
                const isSelected = category === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`py-2 px-2 rounded-xl border text-center transition-all tap-active flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-500/80 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span className="text-[10px] font-bold leading-tight line-clamp-1">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Elder Comfort Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
              Elder Comfort / Pacing Note (Optional)
            </label>
            <textarea
              rows={2}
              value={elderComfortNote}
              onChange={e => setElderComfortNote(e.target.value)}
              placeholder="e.g. Fathers will rest on benches while sons purchase tickets; wheelchair available."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Timeline Checkbox */}
          <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer tap-active">
            <input
              type="checkbox"
              checked={addToTimeline}
              onChange={e => setAddToTimeline(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-900"
            />
            <div className="text-xs">
              <span className="font-bold text-white block">Add to Today's Checkpoint Timeline</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Displays in the main itinerary stream so everyone can tap checkmark when completed.
              </span>
            </div>
          </label>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!title.trim() || isSubmitting}
              className="w-full min-h-touch py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 tap-active disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>{isSubmitting ? 'Saving...' : 'Confirm & Add Activity'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomActivityModal;
