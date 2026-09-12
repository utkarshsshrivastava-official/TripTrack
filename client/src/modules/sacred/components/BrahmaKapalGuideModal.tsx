import React, { useState } from 'react';
import { X, Flame, BookOpen, CheckSquare, PhoneCall, MapPin, Sparkles, Clock, Check } from 'lucide-react';
import {
  BRAHMA_KAPAL_SAMAGRI,
  BRAHMA_KAPAL_RITUAL_STEPS,
  PANDA_REGISTER_INFO
} from '../data/brahmaKapalData';

interface BrahmaKapalGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'STEPS' | 'SAMAGRI' | 'PANDA';

export const BrahmaKapalGuideModal: React.FC<BrahmaKapalGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('STEPS');
  const [checkedSamagri, setCheckedSamagri] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const toggleSamagri = (id: string) => {
    setCheckedSamagri(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-t-3xl sm:rounded-2xl p-4 sm:p-6 max-h-[92vh] overflow-y-auto pb-safe shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-100 flex items-center gap-1.5">
                ब्रह्मकपाल पितृ तर्पण मार्गदर्शिका
              </h2>
              <p className="text-xs text-amber-400 font-semibold">
                Brahma Kapal Pind Daan & Ancestral Liturgy
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

        {/* Spiritual Significance Alert */}
        <div className="mt-3.5 p-3 rounded-2xl bg-gradient-to-r from-amber-950/40 via-stone-950 to-stone-900 border border-amber-800/40 text-xs text-amber-200/90 leading-relaxed shadow-inner">
          <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-0.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>मोक्ष तीर्थ महात्म्य (Scriptural Importance)</span>
          </div>
          भगवान ब्रह्मा का पंचम शीश यहाँ भगवान शिव के हाथों से मुक्त हुआ था। शास्त्रों के अनुसार, ब्रह्मकपाल पर एक बार पिण्डदान करने से पितरों को शाश्वत मोक्ष प्राप्त होता है और भविष्य में अन्यत्र श्राद्ध की आवश्यकता नहीं रहती।
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 p-1 bg-stone-950 rounded-xl border border-stone-800 mt-3 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('STEPS')}
            className={`py-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
              activeTab === 'STEPS'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>विधि (Steps)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('SAMAGRI')}
            className={`py-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
              activeTab === 'SAMAGRI'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>सामग्री ({checkedSamagri.size}/{BRAHMA_KAPAL_SAMAGRI.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('PANDA')}
            className={`py-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
              activeTab === 'PANDA'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>पंडा बही (Priest)</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="mt-4">
          {activeTab === 'STEPS' && (
            <div className="space-y-3">
              {BRAHMA_KAPAL_RITUAL_STEPS.map(step => (
                <div
                  key={step.stepNumber}
                  className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-500/30 shrink-0">
                      {step.stepNumber}
                    </span>
                    <h3 className="text-sm font-bold text-stone-100">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed pl-8">
                    {step.description}
                  </p>

                  {step.mantraHindi && (
                    <div className="ml-8 p-2.5 rounded-xl bg-stone-900/90 border border-amber-900/30 text-xs font-mono text-amber-300">
                      {step.mantraHindi}
                    </div>
                  )}

                  <div className="ml-8 text-[11px] text-stone-400 flex items-center gap-1.5 italic">
                    <span>✨ {step.significance}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'SAMAGRI' && (
            <div className="space-y-2.5">
              <div className="text-[11px] text-stone-400 px-1">
                Tap each item as you procure or pack it in Badrinath bazaar:
              </div>
              {BRAHMA_KAPAL_SAMAGRI.map(item => {
                const isChecked = checkedSamagri.has(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleSamagri(item.id)}
                    className={`w-full min-h-[52px] p-3 rounded-2xl border text-left flex items-center justify-between transition-all tap-active ${
                      isChecked
                        ? 'bg-amber-950/30 border-amber-600/70 text-amber-100'
                        : 'bg-stone-950 border-stone-800 text-stone-200 hover:border-stone-700'
                    }`}
                  >
                    <div className="space-y-0.5 flex-1 pr-3">
                      <div className="text-xs font-bold flex items-center gap-2">
                        <span>{item.nameHindi}</span>
                        <span className="text-[10px] font-normal text-stone-400">({item.quantityNote})</span>
                      </div>
                      <p className="text-[11px] text-stone-400 leading-tight">
                        {item.purpose}
                      </p>
                    </div>

                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      isChecked ? 'bg-amber-400 text-stone-950' : 'border border-stone-600'
                    }`}>
                      {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'PANDA' && (
            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {PANDA_REGISTER_INFO.title}
                    </h3>
                    <p className="text-xs text-amber-400 font-medium">
                      {PANDA_REGISTER_INFO.role}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                    Bahi-Khata
                  </span>
                </div>

                <div className="space-y-2 text-xs text-stone-300">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{PANDA_REGISTER_INFO.location}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span>{PANDA_REGISTER_INFO.ritualTimings}</span>
                  </div>
                  <div className="flex items-start gap-2 text-stone-400">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{PANDA_REGISTER_INFO.familyLineageNote}</span>
                  </div>
                </div>

                {/* Calling Buttons */}
                <div className="pt-2 border-t border-stone-800/80 space-y-2">
                  <span className="text-[11px] font-bold text-stone-400 block">
                    Purohit Helpline & Pre-Arrangement:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PANDA_REGISTER_INFO.phoneNumbers.map(phone => (
                      <a
                        key={phone}
                        href={`tel:${phone.replace(/[^0-9]/g, '')}`}
                        className="min-h-[44px] px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md tap-active"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Call {phone}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
