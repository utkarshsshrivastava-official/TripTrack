import React, { useState, useEffect } from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Search, 
  MessageSquare, 
  ShieldAlert, 
  Mountain, 
  Flame, 
  Coffee, 
  Car,
  Sparkles
} from 'lucide-react';
import { TRAVEL_PHRASEBOOK } from '../../../shared/config/trip.config';
import { TravelPhrase } from '../../../shared/types';

interface DriverVoicePhrasebookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DriverVoicePhrasebookModal: React.FC<DriverVoicePhrasebookModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [speakingPhraseId, setSpeakingPhraseId] = useState<string | null>(null);
  const [copiedPhraseId, setCopiedPhraseId] = useState<string | null>(null);

  // Stop any ongoing speech synthesis on unmount or close
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isOpen) return null;

  const categories = [
    { id: 'ALL', label: 'All Phrases', icon: Sparkles },
    { id: 'DRIVER_SAFETY', label: 'Cab & Safety', icon: Car },
    { id: 'GARHWALI_LOCAL', label: 'Pahadi Local', icon: Mountain },
    { id: 'TEMPLE_RITUAL', label: 'Temple & Rituals', icon: Flame },
    { id: 'FOOD_SENIOR', label: 'Food & Elders', icon: Coffee },
    { id: 'EMERGENCY', label: 'Emergency', icon: ShieldAlert },
  ];

  const filteredPhrases = TRAVEL_PHRASEBOOK.filter(phrase => {
    const matchesCategory = selectedCategory === 'ALL' || phrase.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      phrase.hindiDevanagari.toLowerCase().includes(q) ||
      phrase.englishTransliteration.toLowerCase().includes(q) ||
      phrase.englishMeaning.toLowerCase().includes(q) ||
      phrase.contextUsage.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const handleSpeak = (phrase: TravelPhrase) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    // If currently speaking this phrase, cancel it
    if (speakingPhraseId === phrase.id) {
      window.speechSynthesis.cancel();
      setSpeakingPhraseId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phrase.audioText);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.88; // slightly slower for clear mountain comprehension
    utterance.pitch = 1.0;

    // Pick a Hindi voice if available
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => v.lang === 'hi-IN' || v.lang.startsWith('hi'));
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    utterance.onstart = () => {
      setSpeakingPhraseId(phrase.id);
    };

    utterance.onend = () => {
      setSpeakingPhraseId(null);
    };

    utterance.onerror = () => {
      setSpeakingPhraseId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = async (phrase: TravelPhrase) => {
    const textToCopy = `${phrase.hindiDevanagari}\n(${phrase.englishTransliteration})\nMeaning: ${phrase.englishMeaning}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedPhraseId(phrase.id);
      setTimeout(() => setCopiedPhraseId(null), 2000);
    } catch {
      // Fallback
    }
  };

  const handleWhatsAppSend = (phrase: TravelPhrase) => {
    const message = `*${phrase.hindiDevanagari}*\n_${phrase.englishTransliteration}_\nMeaning: ${phrase.englishMeaning}`;
    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-lg max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700/70 rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-1.5">
                <span>Driver & Local Phrasebook</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Offline Audio
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Polite Hindi & Garhwali phrases with audio voice pronunciation
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

        {/* Search Bar */}
        <div className="p-3 bg-slate-900/60 border-b border-slate-800 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search phrases (e.g., AC, stop, nausea, oxygen, dal)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Categories Scroller */}
        <div className="p-2.5 bg-slate-950/40 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shrink-0 transition-all tap-active ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Phrases List */}
        <div className="p-3.5 overflow-y-auto space-y-3 flex-1">
          {filteredPhrases.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-500" />
              <p className="text-sm font-semibold">No phrases found matching "{searchQuery}"</p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}
                className="mt-3 text-xs font-bold text-emerald-400 hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredPhrases.map((phrase) => {
              const isSpeaking = speakingPhraseId === phrase.id;
              const isCopied = copiedPhraseId === phrase.id;

              return (
                <div
                  key={phrase.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isSpeaking 
                      ? 'bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/30' 
                      : 'bg-slate-800/70 border-slate-700/70 hover:border-slate-600'
                  }`}
                >
                  {/* Category & Tag Row */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      {phrase.isPahadi ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          <Mountain className="w-3 h-3" />
                          <span>Garhwali / Pahadi</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-sky-500/15 text-sky-300 border border-sky-500/30">
                          <span>Hindi / Devanagari</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {phrase.contextUsage}
                    </span>
                  </div>

                  {/* Large Devanagari Hindi Text (Elder Dignity Contrast) */}
                  <div className="text-base sm:text-lg font-black text-white leading-relaxed mb-1.5">
                    {phrase.hindiDevanagari}
                  </div>

                  {/* English Transliteration */}
                  <div className="text-xs font-semibold text-emerald-300/90 italic mb-2">
                    "{phrase.englishTransliteration}"
                  </div>

                  {/* English Meaning */}
                  <div className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 mb-3">
                    <span className="text-slate-400 font-bold uppercase text-[9px] block mb-0.5">Meaning:</span>
                    {phrase.englishMeaning}
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-700/60">
                    <button
                      type="button"
                      onClick={() => handleSpeak(phrase)}
                      className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-2 tap-active transition-all ${
                        isSpeaking
                          ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                      }`}
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-4 h-4" />
                          <span>Stop Voice</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4" />
                          <span>Speak Voice</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopy(phrase)}
                        className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl bg-slate-700/80 hover:bg-slate-600 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 tap-active"
                        title="Copy phrase to clipboard"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleWhatsAppSend(phrase)}
                        className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 tap-active"
                        title="Share via WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Note */}
        <div className="p-3 bg-slate-950/60 border-t border-slate-800 text-center shrink-0">
          <p className="text-[11px] text-slate-400">
            💡 <strong className="text-emerald-300">Elder Tip:</strong> Tap <span className="text-white font-bold">"Speak Voice"</span> on speakerphone so the cab driver hears gentle and courteous driving instructions without any awkwardness.
          </p>
        </div>
      </div>
    </div>
  );
};
