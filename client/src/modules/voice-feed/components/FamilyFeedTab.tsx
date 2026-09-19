import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Sparkles,
  MapPin,
  User,
  Layers,
  Send,
  Mic,
  MicOff,
  Clock,
  Trash2,
  Calendar,
  Camera,
  ExternalLink,
  X
} from 'lucide-react';
import { TRAVELLERS_CONFIG, getTravellerById } from '../../../shared/config/travellers.config';
import { useUserProfile } from '../../../shared/hooks/useUserProfile';
import { DuoId } from '../../../shared/types';
import { WebAudioRecorder } from '../services/audioRecorder';
import { saveVoiceLogToDexie, deleteVoiceLogFromDexie } from '../services/voiceLogStorage';
import { AudioWaveformCard } from './AudioWaveformCard';
import {
  FamilyFeedItem,
  getUnifiedFamilyFeed,
  addFamilyFeedItem,
  deleteFamilyFeedItem,
  clearAllFamilyFeedItems
} from '../services/familyFeedStorage';
import { uploadMedia } from '../../../shared/services/mediaService';

interface FamilyFeedTabProps {
  activeDuo: DuoId | 'ALL';
}

export const FamilyFeedTab: React.FC<FamilyFeedTabProps> = ({ activeDuo: initialActiveDuo }) => {
  const { activeUser } = useUserProfile();
  const defaultSpeakerId = TRAVELLERS_CONFIG.some(t => t.id === activeUser.id)
    ? activeUser.id
    : (activeUser.duoId === 'DUO_B' ? 'traveller-shreyas' : 'traveller-utkarsh');

  const [feedItems, setFeedItems] = useState<FamilyFeedItem[]>([]);
  const [selectedDuoFilter, setSelectedDuoFilter] = useState<DuoId | 'ALL'>(initialActiveDuo);
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'MILESTONE' | 'VOICE_NOTE' | 'TRANSIT_UPDATE'>('ALL');

  // Quick Post State — Auto-bound to logged-in user profile
  const [quickPostText, setQuickPostText] = useState('');
  const [selectedSpeakerId, setSelectedSpeakerId] = useState(defaultSpeakerId);
  const [currentLocation, setCurrentLocation] = useState('Devprayag / NH-7');
  const [toastNote, setToastNote] = useState<string | null>(null);

  // Sync speaker selection if user profile changes
  useEffect(() => {
    setSelectedSpeakerId(defaultSpeakerId);
  }, [defaultSpeakerId]);

  const [postPhotoFile, setPostPhotoFile] = useState<File | null>(null);
  const [postPhotoPreviewUrl, setPostPhotoPreviewUrl] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [viewingFeedPhoto, setViewingFeedPhoto] = useState<{
    url: string;
    title: string;
    location?: string;
  } | null>(null);

  // Modular Voice Studio Feature State (collapsible)
  const [isVoiceStudioOpen, setIsVoiceStudioOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const recorderRef = useRef<WebAudioRecorder | null>(null);
  const timerRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const loadFeed = async () => {
    const items = await getUnifiedFamilyFeed();
    setFeedItems(items);
  };

  const handleDeleteVoiceLog = async (id: string) => {
    await deleteVoiceLogFromDexie(id);
    deleteFamilyFeedItem(`voice-feed-${id}`);
    deleteFamilyFeedItem(id);
    setToastNote('🗑️ Voice note removed');
    setTimeout(() => setToastNote(null), 3000);
    await loadFeed();
  };

  const handleDeleteFeedItem = (id: string) => {
    deleteFamilyFeedItem(id);
    setToastNote('🗑️ Post removed from feed');
    setTimeout(() => setToastNote(null), 3000);
    loadFeed();
  };

  const handleClearAllFeed = async () => {
    if (window.confirm('Clear all feed updates from the timeline and MongoDB cloud? This will remove all milestone and traveler posts.')) {
      await clearAllFamilyFeedItems();
      setToastNote('🧹 Family feed stream cleared!');
      setTimeout(() => setToastNote(null), 3000);
      await loadFeed();
    }
  };

  useEffect(() => {
    loadFeed();

    const handleFeedUpdate = () => {
      loadFeed();
    };

    window.addEventListener('triptrack_feed_update', handleFeedUpdate);
    return () => window.removeEventListener('triptrack_feed_update', handleFeedUpdate);
  }, []);

  useEffect(() => {
    setSelectedDuoFilter(initialActiveDuo);
  }, [initialActiveDuo]);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPostPhotoFile(file);
      const url = URL.createObjectURL(file);
      setPostPhotoPreviewUrl(url);
    }
  };

  const handleRemovePhoto = () => {
    if (postPhotoPreviewUrl) {
      URL.revokeObjectURL(postPhotoPreviewUrl);
    }
    setPostPhotoFile(null);
    setPostPhotoPreviewUrl(null);
    if (photoInputRef.current) {
      photoInputRef.current.value = '';
    }
  };

  // Handle Quick Manual Post
  const handleCreatePost = async (e?: React.FormEvent, presetText?: string, presetCategory?: FamilyFeedItem['category'], presetBadge?: string) => {
    if (e) e.preventDefault();
    const textToPost = presetText || quickPostText;
    if (!textToPost.trim() && !postPhotoFile) return;

    const speaker = getTravellerById(selectedSpeakerId);
    const duo = (speaker?.duoId as 'DUO_A' | 'DUO_B') || 'ALL';

    setIsPosting(true);
    let photoUrl: string | undefined = undefined;

    if (postPhotoFile) {
      if (navigator.onLine) {
        try {
          const uploadRes = await uploadMedia(postPhotoFile, 'feed_photo');
          photoUrl = uploadRes.url;
        } catch (uploadErr) {
          console.warn('⚠️ [Family Feed] Photo upload failed, falling back to local data URL:', uploadErr);
        }
      }

      if (!photoUrl) {
        photoUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(postPhotoFile);
        });
      }
    }

    addFamilyFeedItem({
      type: presetCategory === 'CAB' ? 'TRANSIT_UPDATE' : 'TRAVELER_NOTE',
      title: presetBadge ? `${presetBadge} Update` : `Update from ${speaker?.name || 'Pilgrim'}`,
      description: textToPost.trim() || 'Shared a road snapshot from the highway.',
      speakerId: selectedSpeakerId,
      locationName: currentLocation,
      duoId: duo,
      category: presetCategory || 'GENERAL',
      statusBadge: presetBadge || (photoUrl ? 'Photo Moment' : 'Pilgrim Update'),
      metadata: photoUrl ? { photoUrl } : undefined
    });

    setQuickPostText('');
    handleRemovePhoto();
    setIsPosting(false);
    setToastNote('✅ Update posted to Family Feed!');
    setTimeout(() => setToastNote(null), 3500);
    loadFeed();
  };

  // Quick Preset Chips
  const handleQuickPreset = (presetText: string, category: FamilyFeedItem['category'], badge: string) => {
    handleCreatePost(undefined, presetText, category, badge);
  };

  // Voice Studio Recording logic
  const handleStartVoiceRecord = async () => {
    try {
      if (!WebAudioRecorder.isSupported()) {
        setToastNote('Microphone not supported in this browser.');
        return;
      }

      const recorder = new WebAudioRecorder();
      await recorder.startRecording();
      recorderRef.current = recorder;

      setIsRecording(true);
      setRecordDuration(0);
      setToastNote('🔴 Recording voice note... Speak in Hindi or Hinglish.');

      timerRef.current = setInterval(() => {
        setRecordDuration(d => d + 1);
      }, 1000);

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }
    } catch (err) {
      console.warn('Microphone error', err);
      setToastNote('Microphone permission denied or unavailable.');
    }
  };

  const handleStopVoiceRecord = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!recorderRef.current) return;

    try {
      setIsRecording(false);
      setToastNote('✨ Transcribing & uploading to Cloudinary...');

      const result = await recorderRef.current.stopRecording();
      const speaker = getTravellerById(selectedSpeakerId);
      const speakerName = speaker ? speaker.name : 'Pilgrim';

      let remoteAudioUrl: string | undefined = undefined;
      if (navigator.onLine) {
        try {
          const uploadRes = await uploadMedia(result.audioBlob, 'voice', `voice-${Date.now()}.webm`);
          remoteAudioUrl = uploadRes.url;
        } catch (uploadErr) {
          console.warn('⚠️ [Voice Studio] Cloud upload deferred:', uploadErr);
        }
      }

      // Save to Dexie
      const saved = await saveVoiceLogToDexie(
        {
          speakerId: selectedSpeakerId,
          transcription: `${speakerName}: [Audio Dispatch • ${result.durationSeconds}s] Sab log theek hain aur yatra aage badh rahi hai.`,
          summary: `Audio broadcast from ${speakerName} at ${currentLocation}. Family proceeding comfortably.`,
          recordedAt: new Date().toISOString(),
          locationName: currentLocation,
          audioUrl: remoteAudioUrl
        },
        result.audioBlob
      );

      // Add to Family Feed with remote audio URL so all family devices can stream it!
      addFamilyFeedItem({
        type: 'VOICE_NOTE',
        title: `Voice Broadcast: ${currentLocation}`,
        description: `Audio dispatch from ${speakerName} (${result.durationSeconds}s). Family proceeding comfortably.`,
        speakerId: selectedSpeakerId,
        locationName: currentLocation,
        duoId: (speaker?.duoId as any) || 'ALL',
        category: 'VOICE',
        statusBadge: 'Audio Dispatch',
        metadata: {
          audioUrl: remoteAudioUrl || saved.audioUrl,
          transcription: `${speakerName}: [Audio Dispatch • ${result.durationSeconds}s]`,
          summary: `Audio broadcast from ${speakerName} at ${currentLocation}`
        }
      });

      setToastNote('✅ Voice broadcast saved and published live!');
      setTimeout(() => setToastNote(null), 4000);
      loadFeed();

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([40, 40, 60]);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
      setToastNote('Recording failed. Please try again.');
    }
  };

  const togglePlayAudio = (id: string, audioUrl?: string) => {
    if (playingAudioId === id) {
      audioPlayerRef.current?.pause();
      setPlayingAudioId(null);
      return;
    }

    if (audioUrl && audioPlayerRef.current) {
      audioPlayerRef.current.src = audioUrl;
      audioPlayerRef.current.play().catch(e => console.warn('Audio play failed', e));
      setPlayingAudioId(id);
      audioPlayerRef.current.onended = () => setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
      setTimeout(() => {
        setPlayingAudioId(current => (current === id ? null : current));
      }, 8000);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Filter feed items
  const filteredFeed = feedItems.filter(item => {
    // Filter by Duo
    if (selectedDuoFilter !== 'ALL') {
      const speaker = getTravellerById(item.speakerId);
      if (item.duoId !== 'ALL' && item.duoId !== selectedDuoFilter && speaker?.duoId !== selectedDuoFilter) {
        return false;
      }
    }
    // Filter by Type
    if (typeFilter !== 'ALL' && item.type !== typeFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-4 pb-24">
      <audio ref={audioPlayerRef} className="hidden" />

      {/* Reassurance Header Banner */}
      <div className="p-3.5 rounded-3xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/60 border border-purple-800/40 shadow-xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300 shrink-0">
            <Calendar className="w-4 h-4 text-purple-200" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white flex items-center gap-1.5">
              <span>Pilgrimage Live Feed & Timeline</span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                100% Offline
              </span>
            </h3>
            <p className="text-[11px] text-purple-200/80">
              Live milestones, cab updates, and family voice notes.
            </p>
          </div>
        </div>

        {/* Modular Voice Studio Quick Launcher Toggle */}
        <button
          type="button"
          onClick={() => setIsVoiceStudioOpen(!isVoiceStudioOpen)}
          className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md tap-active shrink-0 min-h-[42px] ${isVoiceStudioOpen
              ? 'bg-purple-600 text-white shadow-purple-950/80 border border-purple-400'
              : 'bg-purple-950/80 hover:bg-purple-900 border border-purple-600/50 text-purple-200'
            }`}
        >
          <Mic className="w-3.5 h-3.5" />
          <span>{isVoiceStudioOpen ? 'Close Mic' : 'Voice Studio'}</span>
        </button>
      </div>

      {/* Collapsible Modular Family Voice Studio Feature */}
      {isVoiceStudioOpen && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-slate-900/95 via-slate-950 to-purple-950/40 border border-purple-500/40 shadow-2xl space-y-4 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
              <span className="text-xs font-black text-white uppercase tracking-wider">
                Family Voice Studio (Feature)
              </span>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-900/60 text-purple-200 border border-purple-700/60 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-temple-gold" />
              <span>Gemini AI Speech Summary</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <User className="w-3 h-3 text-purple-400" />
                <span>Speaking Pilgrim</span>
              </label>
              <select
                value={selectedSpeakerId}
                onChange={e => setSelectedSpeakerId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/90 border border-white/10 text-xs text-white font-medium focus:outline-none focus:border-purple-500 shadow-inner"
              >
                {TRAVELLERS_CONFIG.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.duoId === 'DUO_A' ? 'Family A' : 'Family B'}){t.id === defaultSpeakerId ? ' — You' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-purple-400" />
                <span>Current Location</span>
              </label>
              <input
                type="text"
                value={currentLocation}
                onChange={e => setCurrentLocation(e.target.value)}
                placeholder="e.g. Haridwar Hotel / Devprayag"
                className="w-full px-3 py-2 rounded-xl bg-slate-950/90 border border-white/10 text-xs text-white font-medium focus:outline-none focus:border-purple-500 shadow-inner"
              >
              </input>
            </div>
          </div>

          {/* Microphone Recording Button */}
          <div className="py-2 flex flex-col items-center justify-center space-y-2">
            {isRecording && (
              <div className="flex items-center gap-1 h-6 px-4 py-1">
                {[40, 80, 55, 95, 70, 85, 60, 100, 75, 50, 90, 65, 45].map((h, idx) => (
                  <div
                    key={idx}
                    className="w-1 bg-gradient-to-t from-purple-500 to-rose-400 rounded-full animate-pulse"
                    style={{
                      height: `${h}%`,
                      animationDuration: `${0.3 + (idx % 4) * 0.15}s`
                    }}
                  />
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={isRecording ? handleStopVoiceRecord : handleStartVoiceRecord}
              className={`tap-active w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl border-4 ${isRecording
                  ? 'bg-rose-600 border-rose-400 text-white animate-pulse scale-105 shadow-rose-900/80'
                  : 'bg-gradient-to-tr from-purple-700 via-indigo-600 to-purple-600 border-purple-400/50 text-white shadow-purple-950/70 hover:scale-105'
                }`}
            >
              {isRecording ? (
                <MicOff className="w-8 h-8 animate-bounce" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </button>

            <div className="text-center">
              {isRecording ? (
                <span className="text-xs font-mono font-black text-rose-400 bg-rose-950/80 px-3 py-1 rounded-full border border-rose-700">
                  RECORDING: {formatSeconds(recordDuration)}
                </span>
              ) : (
                <span className="text-[11px] text-slate-300 font-medium">
                  Tap to record Hindi/Hinglish audio for loved ones
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Traveler Update & Post Bar */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-3 backdrop-blur-xl">
        <div className="flex items-center justify-between text-xs">
          <span className="font-black text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            <span>Post Travel Update</span>
          </span>
          <span className="text-[10px] text-slate-400">
            Posting as: <strong className="text-purple-300">{getTravellerById(selectedSpeakerId)?.name}</strong>
          </span>
        </div>

        <form onSubmit={e => handleCreatePost(e)} className="space-y-2">
          <div className="relative">
            <textarea
              rows={2}
              value={quickPostText}
              onChange={e => setQuickPostText(e.target.value)}
              placeholder="e.g. Arrived in Delhi, booked Innova cab to Haridwar, having tea at Cheetal..."
              className="w-full p-3 rounded-2xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Photo Preview if attached */}
          {postPhotoPreviewUrl && (
            <div className="relative inline-block rounded-xl overflow-hidden border border-purple-500/40 bg-black/40 my-1">
              <img
                src={postPhotoPreviewUrl}
                alt="Selected moment"
                className="w-24 h-24 object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white hover:bg-rose-500 shadow-md tap-active"
                title="Remove photo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Hidden File Input for Camera/Gallery */}
          <input
            type="file"
            ref={photoInputRef}
            accept="image/*"
            capture="environment"
            onChange={handlePhotoSelect}
            className="hidden"
          />

          {/* Preset 1-Tap Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => handleQuickPreset('Arrived at Delhi Airport / Station safely. Luggage collected, proceeding to cab.', 'GENERAL', 'Arrival')}
              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold whitespace-nowrap flex items-center gap-1 tap-active border border-white/5"
            >
              <span>📍 Arrived Delhi</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('Toyota Innova Crysta cab boarded. AC comfortable, luggage stowed in boot.', 'CAB', 'Cab Boarded')}
              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold whitespace-nowrap flex items-center gap-1 tap-active border border-white/5"
            >
              <span>🚕 Cab Boarded</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('Highway tea and breakfast halt. Elders stretching legs with warm ginger tea.', 'MEAL', 'Tea Break')}
              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold whitespace-nowrap flex items-center gap-1 tap-active border border-white/5"
            >
              <span>☕ Tea Halt</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('Haridwar hotel check-in completed. Warm rooms ready, fathers taking rest.', 'HOTEL', 'Checked In')}
              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold whitespace-nowrap flex items-center gap-1 tap-active border border-white/5"
            >
              <span>🏨 Hotel In</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('Badrinath temple darshan & pooja completed with great peace. Jai Badri Vishal!', 'DARSHAN', 'Darshan Done')}
              className="px-2.5 py-1 rounded-xl bg-amber-950/80 hover:bg-amber-900 text-amber-200 text-[10px] font-bold whitespace-nowrap flex items-center gap-1 tap-active border border-amber-700/50"
            >
              <span>🛕 Darshan Done</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <select
                value={selectedSpeakerId}
                onChange={e => setSelectedSpeakerId(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-[11px] text-slate-300 font-medium focus:outline-none"
              >
                {TRAVELLERS_CONFIG.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name}{t.id === defaultSpeakerId ? ' (You)' : ''}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 tap-active transition-all ${
                  postPhotoFile
                    ? 'bg-purple-950/80 border-purple-500 text-purple-200'
                    : 'bg-slate-950 border-white/10 text-slate-300 hover:text-white'
                }`}
                title="Attach photo from highway or shrine"
              >
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>{postPhotoFile ? 'Photo Attached' : 'Photo'}</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={(!quickPostText.trim() && !postPhotoFile) || isPosting}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-black flex items-center gap-1.5 tap-active min-h-[42px] shadow-lg shadow-purple-950/80"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isPosting ? 'Posting...' : 'Publish to Feed'}</span>
            </button>
          </div>
        </form>
      </div>

      {toastNote && (
        <div className="p-2.5 rounded-2xl bg-purple-950/90 border border-purple-700 text-center text-xs font-bold text-purple-200 shadow-xl animate-in fade-in">
          {toastNote}
        </div>
      )}

      {/* Filter Control Header */}
      <div className="flex flex-col gap-2 pt-1">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Family Journey Timeline</span>
            <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-slate-800 text-slate-300">
              {filteredFeed.length} updates
            </span>
          </div>

          {/* Family Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-xl border border-white/10">
            {(['ALL', 'DUO_A', 'DUO_B'] as const).map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setSelectedDuoFilter(f)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all tap-active ${selectedDuoFilter === f
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                  }`}
              >
                {f === 'ALL' ? 'All' : f === 'DUO_A' ? 'Family A' : 'Family B'}
              </button>
            ))}
          </div>
        </div>

        {/* Type Filter Chips */}
        <div className="flex items-center justify-between gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[10px]">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setTypeFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all tap-active ${typeFilter === 'ALL' ? 'bg-white text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                }`}
            >
              All Stream
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('MILESTONE')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all tap-active ${typeFilter === 'MILESTONE' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                }`}
            >
              🏁 Milestones
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('VOICE_NOTE')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all tap-active ${typeFilter === 'VOICE_NOTE' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                }`}
            >
              🎙️ Voice Notes
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('TRANSIT_UPDATE')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all tap-active ${typeFilter === 'TRANSIT_UPDATE' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                }`}
            >
              🚗 Cab & Transit
            </button>
          </div>

          {feedItems.length > 0 && (
            <button
              type="button"
              onClick={handleClearAllFeed}
              className="px-2.5 py-1 rounded-lg font-bold bg-rose-950/50 hover:bg-rose-900/70 text-rose-300 hover:text-white border border-rose-800/60 transition-all tap-active shrink-0 flex items-center gap-1 ml-auto"
              title="Clear all updates from feed and cloud"
            >
              <Trash2 className="w-3 h-3 text-rose-400" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-purple-500 before:via-amber-500 before:to-emerald-500">
        {filteredFeed.map(item => {
          const speaker = getTravellerById(item.speakerId);
          const isVoice = item.type === 'VOICE_NOTE';
          const isMilestone = item.type === 'MILESTONE';
          const isTransit = item.type === 'TRANSIT_UPDATE';

          return (
            <div key={item.id} className="relative group">
              {/* Timeline Node Icon */}
              <div className={`absolute -left-6 top-3 w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-lg border-2 ${isMilestone
                  ? 'bg-amber-500 border-amber-300 text-slate-950 shadow-amber-500/50'
                  : isVoice
                    ? 'bg-purple-600 border-purple-400 text-white shadow-purple-500/50'
                    : isTransit
                      ? 'bg-emerald-500 border-emerald-300 text-slate-950 shadow-emerald-500/50'
                      : 'bg-slate-800 border-slate-600 text-slate-200'
                }`}>
                {isMilestone ? '🏁' : isVoice ? '🎙️' : isTransit ? '🚗' : '📍'}
              </div>

              {/* Feed Card */}
              {isVoice && item.metadata ? (
                <AudioWaveformCard
                  update={{
                    id: item.id.replace('voice-feed-', ''),
                    speakerId: item.speakerId,
                    transcription: item.metadata.transcription || item.description,
                    summary: item.metadata.summary || item.title,
                    recordedAt: item.timestamp,
                    locationName: item.locationName,
                    audioUrl: item.metadata.audioUrl
                  }}
                  isPlaying={playingAudioId === item.id}
                  onTogglePlay={togglePlayAudio}
                  onDelete={handleDeleteVoiceLog}
                />
              ) : (
                <div className={`p-4 rounded-3xl border shadow-xl backdrop-blur-xl transition-all ${isMilestone
                    ? 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-stone-950 border-amber-600/40'
                    : isTransit
                      ? 'bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border-emerald-600/40'
                      : 'bg-slate-900/90 border-white/10'
                  }`}>
                  {/* Top Meta Header */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0 ${speaker?.duoId === 'DUO_A' ? 'bg-indigo-600' : 'bg-emerald-600'
                        }`}>
                        {speaker?.name?.charAt(0) || 'P'}
                      </div>
                      <span className="text-xs font-bold text-white truncate">
                        {speaker?.name || 'Pilgrim'}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-mono ${speaker?.duoId === 'DUO_A' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}>
                        {speaker?.duoId === 'DUO_A' ? 'Family A' : 'Family B'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 shrink-0 font-mono">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  {/* Title & Badge */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className={`text-sm font-black leading-snug ${isMilestone ? 'text-amber-300' : isTransit ? 'text-emerald-300' : 'text-white'
                      }`}>
                      {item.title}
                    </h4>
                    {item.statusBadge && (
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${isMilestone ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          isTransit ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                            'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                        {item.statusBadge}
                      </span>
                    )}
                  </div>

                  {/* Description / Content */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-2 font-medium">
                    {item.description}
                  </p>

                  {/* Highway / Shrine Photo Moment if attached */}
                  {item.metadata?.photoUrl && (
                    <div className="mb-2.5">
                      <button
                        type="button"
                        onClick={() => setViewingFeedPhoto({
                          url: item.metadata!.photoUrl!,
                          title: item.title,
                          location: item.locationName
                        })}
                        className="relative group block w-full rounded-2xl overflow-hidden border border-white/10 bg-black/40 tap-active max-h-56"
                      >
                        <img
                          src={item.metadata.photoUrl}
                          alt={item.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white text-[10px]">
                          <span className="flex items-center gap-1 font-bold">
                            <Camera className="w-3 h-3 text-amber-400" />
                            <span>Tap to enlarge</span>
                          </span>
                          <span className="p-1 rounded-md bg-black/50 backdrop-blur-sm">
                            <ExternalLink className="w-3 h-3" />
                          </span>
                        </div>
                      </button>
                    </div>
                  )}

                  {/* Footer Location & Details */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 truncate text-slate-300">
                      <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
                      <span className="truncate">{item.locationName}</span>
                    </span>

                    {/* Cab info if available */}
                    {item.metadata?.cabPlate && (
                      <span className="font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800">
                        {item.metadata.cabPlate}
                      </span>
                    )}

                    {/* Delete action for any feed post */}
                    <button
                      type="button"
                      onClick={() => handleDeleteFeedItem(item.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1 tap-active ml-auto"
                      title="Delete this update"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredFeed.length === 0 && (
          <div className="p-8 text-center rounded-3xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs">
            No updates found matching the filter. Use the input above to share a milestone or cab update.
          </div>
        )}
      </div>

      {/* Hidden Audio Element for playback */}
      <audio ref={audioPlayerRef} className="hidden" preload="none" />

      {/* Feed Photo Enlarge Modal */}
      {viewingFeedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
          onClick={() => setViewingFeedPhoto(null)}
        >
          <div
            className="relative max-w-lg w-full bg-slate-900 border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2 min-w-0">
                <Camera className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="truncate">
                  <h4 className="text-xs font-black text-white truncate">{viewingFeedPhoto.title}</h4>
                  <p className="text-[10px] text-slate-400 truncate">{viewingFeedPhoto.location}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingFeedPhoto(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center tap-active"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2 flex-1 overflow-auto flex items-center justify-center bg-black/80 min-h-[260px]">
              <img
                src={viewingFeedPhoto.url}
                alt={viewingFeedPhoto.title}
                className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain shadow-lg"
              />
            </div>

            <div className="p-3 border-t border-white/10 bg-slate-950 flex items-center justify-between">
              <a
                href={viewingFeedPhoto.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 tap-active"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Full Resolution</span>
              </a>
              <button
                type="button"
                onClick={() => setViewingFeedPhoto(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold tap-active"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
