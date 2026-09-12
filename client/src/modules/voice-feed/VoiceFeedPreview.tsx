import React, { useState } from 'react';
import { VoiceUpdate, DuoId } from '../../shared/types';
import { Mic, MicOff, Radio, Sparkles } from 'lucide-react';
import { getTravellerById } from '../../shared/config/travellers.config';

interface VoiceFeedPreviewProps {
  activeDuo: DuoId | 'ALL';
}

const SAMPLE_FEED: VoiceUpdate[] = [
  {
    id: 'voice-1',
    speakerId: 'traveller-utkarsh',
    transcription: 'Devprayag pahunch gaye hain. Dono papa log ekdum theek hain, chai pee rahe hain. Sangam ka darshan karwa diya car se hi bina stairs climb karwaye. Abhi Srinagar ki taraf badh rahe hain.',
    summary: 'Devprayag reached safely. Both fathers in good spirits and rested; proceeding along NH-7 towards Srinagar Garhwal.',
    recordedAt: '2026-09-26T08:45:00+05:30',
    locationName: 'Devprayag Viewpoint'
  },
  {
    id: 'voice-2',
    speakerId: 'traveller-cousin',
    transcription: 'Joshimath base hotel pahunch gaye hain. Room heater on kar diya hai. Bade papa aur chacha ji ne garam paani se haath-munh dho liya hai aur dinner karke aaram kar rahe hain.',
    summary: 'Joshimath hotel reached. Elders settled with room heating and warm dinner; acclimating for tomorrow\'s Badrinath ascent.',
    recordedAt: '2026-09-26T16:30:00+05:30',
    locationName: 'Joshimath Heritage Hotel'
  },
  {
    id: 'voice-3',
    speakerId: 'traveller-utkarsh',
    transcription: 'Brahma Kapal pe Pind Daan aur Tarpan bahut shaanti se sampann hua. Pandit ji ne baitha ke pooja karwayi. Papa bilkul theek hain. Badrinath mandir darshan VIP senior citizen line se 15 minute me ho gaya!',
    summary: 'Brahma Kapal Pitru Paksha rituals completed unhurriedly. Special senior queue allowed smooth Badrinath Darshan.',
    recordedAt: '2026-09-27T11:15:00+05:30',
    locationName: 'Badrinath Dham Sanctum'
  }
];

export const VoiceFeedPreview: React.FC<VoiceFeedPreviewProps> = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [feed, setFeed] = useState<VoiceUpdate[]>(SAMPLE_FEED);
  const [feedbackNote, setFeedbackNote] = useState<string | null>(null);

  const handleToggleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setFeedbackNote('Listening... Tap again to finish & transcribe with Gemini');
    } else {
      setIsRecording(false);
      setFeedbackNote('Processing voice log with Gemini Flash...');

      setTimeout(() => {
        const newUpdate: VoiceUpdate = {
          id: `voice-${Date.now()}`,
          speakerId: 'traveller-utkarsh',
          transcription: 'Sab log safe hain. Haridwar wapas pahunch gaye hain aur Ganga aarti me baithe hain.',
          summary: 'Arrived comfortably at Haridwar for evening Ganga Aarti. Everyone feeling refreshed.',
          recordedAt: new Date().toISOString(),
          locationName: 'Current Pilgrimage Halt'
        };
        setFeed([newUpdate, ...feed]);
        setFeedbackNote('Update published to Home Family dashboard!');
        setTimeout(() => setFeedbackNote(null), 3000);
      }, 1500);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Push-to-Talk Record Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-purple-950/60 via-alpine-900 to-slate-950 border border-purple-800/50 shadow-xl text-center space-y-3">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-purple-300 uppercase tracking-wider">
          <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
          <span>Push-to-Talk Family Voice Log</span>
        </div>

        <p className="text-xs text-slate-300 max-w-xs mx-auto">
          Record a quick Hindi/Hinglish update. Gemini AI transcribes and summarizes for family at home.
        </p>

        {/* Big Mic Button */}
        <div className="py-2 flex justify-center">
          <button
            onClick={handleToggleRecord}
            className={`tap-active w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl border-4 ${
              isRecording
                ? 'bg-rose-600 border-rose-400 text-white animate-pulse scale-110 shadow-rose-900/80'
                : 'bg-gradient-to-tr from-purple-700 to-indigo-600 border-purple-400/50 text-white shadow-purple-950/60 hover:scale-105'
            }`}
          >
            {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>
        </div>

        {feedbackNote && (
          <div className="text-xs font-semibold text-purple-200 animate-in fade-in">
            {feedbackNote}
          </div>
        )}
      </div>

      {/* Family Timeline */}
      <div className="space-y-3">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Family Reassurance Broadcasts</span>
          <span className="text-temple-gold text-[10px] flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>AI Summarized</span>
          </span>
        </div>

        {feed.map((item) => {
          const speaker = getTravellerById(item.speakerId);
          return (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-alpine-900/90 border border-slate-800 space-y-2.5 shadow-sm"
            >
              {/* Header info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full text-white font-bold text-xs flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: speaker?.avatarColor || '#2563eb' }}
                  >
                    {speaker?.name.charAt(0) || 'P'}
                  </div>
                  <span className="text-xs font-bold text-white">
                    {speaker?.name || 'Pilgrim'}
                  </span>
                  {item.locationName && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      📍 {item.locationName}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {new Date(item.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

            {/* AI Summary Card */}
            <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/40 text-xs text-purple-200 font-medium leading-relaxed">
              <div className="text-[10px] uppercase font-mono font-bold text-purple-300 mb-0.5">
                Home Family Summary:
              </div>
              "{item.summary}"
            </div>

            {/* Original Hinglish Audio Note */}
            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/60 text-[11px] text-slate-300 italic">
              <span className="text-slate-500 not-italic font-semibold block text-[10px]">
                Original Voice Note:
              </span>
              "{item.transcription}"
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
};
