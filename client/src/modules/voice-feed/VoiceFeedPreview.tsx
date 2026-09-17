import React, { useState, useEffect } from 'react';
import { DuoId } from '../../shared/types';
import { 
  Users, 
  Newspaper, 
  Music
} from 'lucide-react';
import { FamilyFeedTab } from './components/FamilyFeedTab';
import { RouteGuardTab } from './components/RouteGuardTab';
import { sacredAudioSynth } from '../sacred/services/sacredAudioSynth';

interface VoiceFeedPreviewProps {
  activeDuo: DuoId | 'ALL';
  onOpenSacredChants?: () => void;
}

export const VoiceFeedPreview: React.FC<VoiceFeedPreviewProps> = ({ 
  activeDuo: initialActiveDuo, 
  onOpenSacredChants 
}) => {
  const [activeTab, setActiveTab] = useState<'FAMILY' | 'NEWS'>('FAMILY');
  const [selectedDuo, setSelectedDuo] = useState<DuoId | 'ALL'>(initialActiveDuo);
  const [isTanpuraPlaying, setIsTanpuraPlaying] = useState<boolean>(false);

  useEffect(() => {
    setSelectedDuo(initialActiveDuo);
  }, [initialActiveDuo]);

  useEffect(() => {
    const unsub = sacredAudioSynth.subscribe(playing => {
      setIsTanpuraPlaying(playing);
    });
    setIsTanpuraPlaying(sacredAudioSynth.getIsPlaying());
    return () => unsub();
  }, []);

  return (
    <div className="space-y-4 pb-28">
      {/* 2-Tab Segmented Hub Control: Family Feed vs News Feed */}
      <div className="grid grid-cols-2 p-1 bg-slate-950/90 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
        <button
          type="button"
          onClick={() => setActiveTab('FAMILY')}
          className={`py-3 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 tap-active min-h-[48px] ${
            activeTab === 'FAMILY'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-950/80 border border-purple-400/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 text-purple-200" />
          <span>Family Feed</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('NEWS')}
          className={`py-3 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 tap-active min-h-[48px] ${
            activeTab === 'NEWS'
              ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-950/80 border border-amber-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Newspaper className="w-4 h-4 text-slate-950" />
          <span>News Feed</span>
        </button>
      </div>

      {/* Sacred Chants & Tanpura Quick Audio Ribbon */}
      {onOpenSacredChants && (
        <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-950/60 via-stone-900 to-slate-950 border border-amber-600/30 flex items-center justify-between shadow-lg gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0">
              <Music className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-black text-amber-100 block truncate">
                Sacred Chants & Tanpura Drone
              </span>
              <span className="text-[10px] text-stone-400 truncate block">
                {isTanpuraPlaying ? '🟢 C# Tanpura Drone Active' : 'Offline Stotras, Aartis & 108 Japa'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenSacredChants}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs shadow-md tap-active shrink-0 min-h-[38px]"
          >
            Open
          </button>
        </div>
      )}

      {/* Active Tab View */}
      {activeTab === 'FAMILY' ? (
        <FamilyFeedTab activeDuo={selectedDuo} />
      ) : (
        <RouteGuardTab />
      )}
    </div>
  );
};
