import React from 'react';
import { SightseeingSpot } from '../../../shared/types';
import { 
  Check, 
  Plus, 
  Clock, 
  HeartHandshake, 
  ShieldCheck,
  CableCar
} from 'lucide-react';

interface DaySightseeingCardProps {
  spot: SightseeingSpot;
  isAlreadyAdded?: boolean;
  onAdd: (spot: SightseeingSpot) => void;
}

export const DaySightseeingCard: React.FC<DaySightseeingCardProps> = ({
  spot,
  isAlreadyAdded = false,
  onAdd
}) => {
  // Elder difficulty color and label
  const getDifficultyBadge = (difficulty: SightseeingSpot['elderDifficulty']) => {
    switch (difficulty) {
      case 'EASY':
        return {
          label: 'Senior Friendly • Easy Walking',
          bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
        };
      case 'MODERATE':
        return {
          label: 'Moderate • Rest Stops Recommended',
          bg: 'bg-amber-500/15 border-amber-500/30 text-amber-300'
        };
      case 'STEEP':
        return {
          label: 'Steep Climb • Use Ropeway / Dandi',
          bg: 'bg-rose-500/15 border-rose-500/30 text-rose-300'
        };
      default:
        return {
          label: 'Moderate',
          bg: 'bg-slate-700/30 border-slate-600 text-slate-300'
        };
    }
  };

  const difficultyInfo = getDifficultyBadge(spot.elderDifficulty);

  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-800/90 p-3.5 shadow-md hover:border-slate-700 transition-all space-y-3">
      {/* Header with Title & Category */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
              {spot.category.replace('_', ' ')}
            </span>
            {spot.hasRopewayOrLift && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-300 border border-sky-500/20">
                <CableCar className="w-3 h-3" />
                Ropeway / Lift
              </span>
            )}
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              {spot.recommendedTimeSlot} • ~{spot.durationMinutes}m
            </span>
          </div>

          <h4 className="text-base font-bold text-white leading-tight">
            {spot.name}
          </h4>
          {spot.hindiName && (
            <div className="text-xs font-serif text-amber-200/80 mt-0.5 font-medium">
              {spot.hindiName}
            </div>
          )}
        </div>

        {/* 1-Tap Add Button */}
        <button
          type="button"
          onClick={() => onAdd(spot)}
          disabled={isAlreadyAdded}
          className={`shrink-0 h-10 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all tap-active ${
            isAlreadyAdded
              ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 cursor-default'
              : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
          }`}
          title={isAlreadyAdded ? 'Already added to today\'s plan' : 'Add to today\'s itinerary'}
        >
          {isAlreadyAdded ? (
            <>
              <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
              <span>Added</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add to Plan</span>
            </>
          )}
        </button>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-300 leading-relaxed">
        {spot.description}
      </p>

      {/* Elder Comfort & Dignity Advisory (Highlighted) */}
      <div className="rounded-xl bg-amber-950/25 border border-amber-500/20 p-2.5 flex items-start gap-2.5">
        <HeartHandshake className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="min-w-0">
          <div className="text-[11px] font-bold text-amber-300">Elder Comfort Advisory</div>
          <div className="text-xs text-slate-200 mt-0.5 leading-snug">
            {spot.elderComfortTip}
          </div>
        </div>
      </div>

      {/* Walking Difficulty & Highlights Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
        <div className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg border flex items-center gap-1.5 ${difficultyInfo.bg}`}>
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{difficultyInfo.label}</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {spot.highlights.slice(0, 2).map((hl, i) => (
            <span
              key={i}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60 truncate max-w-[160px]"
            >
              • {hl}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DaySightseeingCard;
