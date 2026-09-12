import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Circle, Luggage } from 'lucide-react';
import {
  DEFAULT_PACKING_ITEMS,
  PACKING_CATEGORIES,
  PackingCategory,
  PackingItem
} from '../data/packingChecklistData';
import {
  getCheckedItemIds,
  togglePackingItem,
  getPackingProgress
} from '../services/packingStorage';

interface PackingChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PackingChecklistModal: React.FC<PackingChecklistModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<PackingCategory | 'ALL'>('ALL');
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState(getPackingProgress());

  useEffect(() => {
    if (isOpen) {
      const ids = getCheckedItemIds();
      setCheckedIds(ids);
      setProgress(getPackingProgress());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggle = (id: string) => {
    togglePackingItem(id);
    const updated = getCheckedItemIds();
    setCheckedIds(updated);
    setProgress(getPackingProgress());
  };

  const filteredItems: PackingItem[] = selectedCategory === 'ALL'
    ? DEFAULT_PACKING_ITEMS
    : DEFAULT_PACKING_ITEMS.filter(i => i.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-t-3xl sm:rounded-2xl p-4 sm:p-6 max-h-[92vh] overflow-y-auto pb-safe shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Luggage className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-100 flex items-center gap-1.5">
                High-Altitude Packing Checklist
              </h2>
              <p className="text-xs text-stone-400">
                Cold Weather, Medicine & Sacred Gear for Elders
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="tap-active p-2 rounded-full bg-stone-800 text-stone-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Card */}
        <div className="mt-3.5 p-3.5 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-300">
              Overall Packing Readiness
            </span>
            <span className="text-xs font-mono font-bold text-amber-400">
              {progress.packed} / {progress.total} items ({progress.percentage}%)
            </span>
          </div>
          <div className="w-full bg-stone-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-emerald-400 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-stone-400">
            {progress.percentage === 100
              ? '🎉 All gear ready! Safe journey to Badrinath Dham.'
              : 'Make sure all essential cold-weather and elder prescription items are packed.'}
          </p>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all tap-active ${
              selectedCategory === 'ALL'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'bg-stone-950 text-stone-400 border border-stone-800 hover:text-stone-200'
            }`}
          >
            All Items ({DEFAULT_PACKING_ITEMS.length})
          </button>
          {PACKING_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 tap-active ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'bg-stone-950 text-stone-400 border border-stone-800 hover:text-stone-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Items List */}
        <div className="space-y-2 mt-1">
          {filteredItems.map(item => {
            const isChecked = checkedIds.has(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleToggle(item.id)}
                className={`w-full min-h-[56px] p-3 rounded-2xl border text-left flex items-start justify-between gap-3 transition-all tap-active ${
                  isChecked
                    ? 'bg-emerald-950/20 border-emerald-700/50 text-stone-300 opacity-80'
                    : 'bg-stone-950 border-stone-800 text-stone-100 hover:border-stone-700'
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${isChecked ? 'line-through text-stone-400' : 'text-stone-100'}`}>
                      {item.title}
                    </span>
                    {item.isEssential && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-950/80 text-rose-300 border border-rose-800/60 shrink-0">
                        Essential
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-400 leading-snug">
                    {item.subtitle}
                  </p>
                </div>

                <div className="shrink-0 pt-0.5">
                  {isChecked ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-stone-600" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
