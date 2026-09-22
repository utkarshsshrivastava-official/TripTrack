import React, { useState, useEffect, useCallback } from 'react';
import { DuoId } from './shared/types';
import { useNetworkStatus } from './shared/hooks/useNetworkStatus';
import { useUserProfile } from './shared/hooks/useUserProfile';
import { initSocket } from './shared/services/socketClient';
import { syncExpensesWithCloud } from './modules/gullak/services/expenseStorage';
import { syncFamilyFeedWithCloud } from './modules/voice-feed/services/familyFeedStorage';
import { syncItineraryWithCloud } from './modules/itinerary/services/itineraryStorage';
import { syncWithCloudHistory } from './modules/chat/services/chatStorage';
import { Header } from './components/Header';
import { BottomDock, ActiveTab } from './components/BottomDock';
import { FloatingChatButton } from './components/FloatingChatButton';
import { AppSidebar } from './components/AppSidebar';
import { EmergencyModal } from './components/EmergencyModal';
import { ProfileLoginModal } from './components/ProfileLoginModal';
import { FamilyChatDrawer } from './modules/chat/components/FamilyChatDrawer';
import { OximeterLoggerModal } from './modules/health/components/OximeterLoggerModal';
import { HydrationMedsModal } from './modules/health/components/HydrationMedsModal';
import { MedicalDirectoryModal } from './modules/health/components/MedicalDirectoryModal';
import { OfflineSmsModal } from './modules/health/components/OfflineSmsModal';
import { BrahmaKapalGuideModal } from './modules/sacred/components/BrahmaKapalGuideModal';
import { PackingChecklistModal } from './modules/sacred/components/PackingChecklistModal';
import { OfflineStotraPlayer } from './modules/sacred/components/OfflineStotraPlayer';
import { YatraMemorialModal } from './modules/sacred/components/YatraMemorialModal';
import { EmailAlertsModal } from './components/EmailAlertsModal';
import { Bell, X } from 'lucide-react';
import { ChatNotificationToast, ChatToastData } from './components/ChatNotificationToast';
import { OfflineChatMessageRecord } from './shared/db/dexie';
import { playChatChime, triggerChatHaptic } from './shared/utils/soundEffects';
import { isPushSupported, getNotificationPermission, subscribeUserToWebPush } from './shared/services/pushNotificationManager';
import { ItineraryPreview } from './modules/itinerary/ItineraryPreview';
import { VaultPreview } from './modules/vault/VaultPreview';
import { TrackingPreview } from './modules/tracking/TrackingPreview';
import { GullakPreview } from './modules/gullak/GullakPreview';
import { VoiceFeedPreview } from './modules/voice-feed/VoiceFeedPreview';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('itinerary');
  const [activeDuo, setActiveDuo] = useState<DuoId | 'ALL'>('ALL');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Phase 6: Elder Health & Dead-Zone Modal States
  const [isOximeterOpen, setIsOximeterOpen] = useState<boolean>(false);
  const [isHydrationOpen, setIsHydrationOpen] = useState<boolean>(false);
  const [isMedicalDirOpen, setIsMedicalDirOpen] = useState<boolean>(false);
  const [isOfflineSmsOpen, setIsOfflineSmsOpen] = useState<boolean>(false);

  // Phase 7: Sacred Pilgrimage Suite & Audio Modal States
  const [isBrahmaKapalOpen, setIsBrahmaKapalOpen] = useState<boolean>(false);
  const [isPackingOpen, setIsPackingOpen] = useState<boolean>(false);
  const [isStotraOpen, setIsStotraOpen] = useState<boolean>(false);
  const [isMemorialOpen, setIsMemorialOpen] = useState<boolean>(false);
  const [isEmailAlertsOpen, setIsEmailAlertsOpen] = useState<boolean>(false);

  const { isOnline, queuedCount, isSyncing, triggerSync } = useNetworkStatus();
  const {
    activeUser,
    allProfiles,
    selectUser,
    updateGuestName,
    isModalOpen: isProfileModalOpen,
    setIsModalOpen: setIsProfileModalOpen
  } = useUserProfile();

  // Real-Time Chat & Notification States
  const [unreadChatCount, setUnreadChatCount] = useState<number>(0);
  const [chatToast, setChatToast] = useState<ChatToastData | null>(null);
  const [showPushBanner, setShowPushBanner] = useState<boolean>(false);

  const handleOpenChat = useCallback(() => {
    setIsChatOpen(true);
    setUnreadChatCount(0);
    setChatToast(null);

    // Prompt user to enable background lock screen notifications on chat interaction
    if (isPushSupported() && getNotificationPermission() === 'default') {
      subscribeUserToWebPush(activeUser).catch(() => {});
    }
  }, [activeUser]);

  // Show gentle one-time opt-in banner if phone hasn't enabled push notifications yet
  useEffect(() => {
    if (typeof window !== 'undefined' && isPushSupported() && getNotificationPermission() === 'default') {
      const dismissed = sessionStorage.getItem('triptrack_push_banner_dismissed');
      if (!dismissed) {
        const timer = setTimeout(() => setShowPushBanner(true), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleIncomingChatMessage = useCallback((msg: OfflineChatMessageRecord) => {
    // If chat drawer is currently closed, increment counter and trigger alert
    if (!isChatOpen) {
      setUnreadChatCount(prev => prev + 1);

      // Only alert if message is from another family member
      if (msg.senderId !== activeUser.id) {
        setChatToast({
          id: msg.id,
          senderName: msg.senderName,
          senderAvatarColor: msg.senderAvatarColor,
          text: msg.text,
          timestamp: msg.timestamp
        });
        playChatChime();
        triggerChatHaptic();
      }
    }
  }, [isChatOpen, activeUser.id]);

  // Handle Web Push click routing & Service Worker communication
  useEffect(() => {
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OPEN_CHAT') {
        handleOpenChat();
      }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    }

    // Direct URL entry from Android system notification drawer: /?openChat=true
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('openChat') === 'true') {
        handleOpenChat();
        window.history.replaceState({}, '', window.location.pathname);
      }
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      }
    };
  }, [handleOpenChat]);

  // Auto-subscribe standalone WebAPK/PWA to background Web Push if supported & permitted
  useEffect(() => {
    if (isPushSupported() && getNotificationPermission() === 'granted') {
      subscribeUserToWebPush(activeUser).catch(() => {});
    }
  }, [activeUser]);


  // Initialize and maintain persistent Socket.io connection with active profile
  useEffect(() => {
    initSocket(activeUser);
  }, [activeUser]);

  // Initial cloud sync across all data modules on mount
  useEffect(() => {
    if (isOnline) {
      Promise.allSettled([
        syncExpensesWithCloud(),
        syncFamilyFeedWithCloud(),
        syncItineraryWithCloud(),
        syncWithCloudHistory()
      ]).then(() => {
        console.log('🔄 [TripTrack Core] Initial multi-module cloud sync complete');
      });
    }
  }, [isOnline]);

  const handleUniversalSync = async () => {
    await triggerSync();
    if (navigator.onLine) {
      await Promise.allSettled([
        syncExpensesWithCloud(),
        syncFamilyFeedWithCloud(),
        syncItineraryWithCloud(),
        syncWithCloudHistory()
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center">
      {/* Mobile-First Frame: 100% on phones, max-w-md centered on desktop */}
      <div className="w-full max-w-md min-h-screen flex flex-col bg-slate-950 text-slate-100 shadow-2xl relative border-x border-slate-800/40">
        {/* Sticky Mobile Single-Tier App Bar */}
        <Header
          onOpenSidebar={() => setIsSidebarOpen(true)}
          activeDuo={activeDuo}
          setActiveDuo={setActiveDuo}
          isOnline={isOnline}
          queuedCount={queuedCount}
          isSyncing={isSyncing}
          onManualSync={handleUniversalSync}
          onOpenEmergency={() => setIsEmergencyOpen(true)}
          activeUser={activeUser}
        />

        {/* Lock Screen Push Notification Opt-in Prompt Banner */}
        {showPushBanner && (
          <div className="mx-3 mt-2 p-3 rounded-2xl bg-gradient-to-r from-emerald-950/95 via-slate-950/95 to-slate-900/95 border border-emerald-500/50 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-2.5 animate-fade-in z-30 relative">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                <Bell className="w-4 h-4 animate-bounce" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-stone-100 truncate">Enable Lock Screen Alerts</h4>
                <p className="text-[10px] text-stone-400 truncate">Get alerted even when phone is locked</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={async () => {
                  await subscribeUserToWebPush(activeUser);
                  setShowPushBanner(false);
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/30 active:scale-95 transition-all min-h-touch min-w-touch flex items-center justify-center"
              >
                Allow
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPushBanner(false);
                  sessionStorage.setItem('triptrack_push_banner_dismissed', 'true');
                }}
                className="p-1.5 text-stone-400 hover:text-stone-200 min-h-touch min-w-touch flex items-center justify-center"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Slide-out Navigation Drawer for Health, Sacred Liturgy & Diagnostics */}
        <AppSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeUser={activeUser}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenHealth={() => setIsOximeterOpen(true)}
          onOpenHydration={() => setIsHydrationOpen(true)}
          onOpenMedicalDirectory={() => setIsMedicalDirOpen(true)}
          onOpenOfflineSms={() => setIsOfflineSmsOpen(true)}
          onOpenBrahmaKapal={() => setIsBrahmaKapalOpen(true)}
          onOpenPackingChecklist={() => setIsPackingOpen(true)}
          onOpenSacredChants={() => setIsStotraOpen(true)}
          onOpenMemorial={() => setIsMemorialOpen(true)}
          onOpenEmailAlerts={() => setIsEmailAlertsOpen(true)}
          isOnline={isOnline}
          queuedCount={queuedCount}
          isSyncing={isSyncing}
          onManualSync={handleUniversalSync}
          onOpenEmergency={() => setIsEmergencyOpen(true)}
        />

        {/* Main Scrollable View Area with safe dock bottom padding */}
        <main className={`flex-1 ${activeTab === 'tracking' ? 'p-0 overflow-hidden relative flex flex-col' : 'px-3 pt-2 pb-[calc(6rem+env(safe-area-inset-bottom,0px))] overflow-y-auto'}`}>
          {activeTab === 'itinerary' && (
            <ItineraryPreview
              activeDuo={activeDuo}
              onOpenPackingChecklist={() => setIsPackingOpen(true)}
              onOpenBrahmaKapalGuide={() => setIsBrahmaKapalOpen(true)}
            />
          )}
          {activeTab === 'vault' && <VaultPreview activeDuo={activeDuo} />}
          {activeTab === 'tracking' && (
            <TrackingPreview
              activeDuo={activeDuo}
              isOnline={isOnline}
              onOpenOfflineSms={() => setIsOfflineSmsOpen(true)}
              onOpenMedicalDirectory={() => setIsMedicalDirOpen(true)}
              onOpenOximeter={() => setIsOximeterOpen(true)}
              onDuoChange={setActiveDuo}
            />
          )}
          {activeTab === 'gullak' && (
            <GullakPreview
              activeDuo={activeDuo}
              onOpenMemorial={() => setIsMemorialOpen(true)}
            />
          )}
          {activeTab === 'voice' && (
            <VoiceFeedPreview
              activeDuo={activeDuo}
              onOpenSacredChants={() => setIsStotraOpen(true)}
            />
          )}
        </main>

        {/* Top Floating Live Chat Banner Toast */}
        <ChatNotificationToast
          toast={chatToast}
          onOpenChat={handleOpenChat}
          onDismiss={() => setChatToast(null)}
        />

        {/* Floating Quick Chat Bubble (Bottom-Left) */}
        <FloatingChatButton 
          onClick={handleOpenChat} 
          unreadCount={unreadChatCount} 
        />

        {/* Floating Frosted Glass Bottom Dock */}
        <BottomDock activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* High-Contrast Elder Emergency Modal */}
        <EmergencyModal
          isOpen={isEmergencyOpen}
          onClose={() => setIsEmergencyOpen(false)}
          onOpenMedicalDirectory={() => setIsMedicalDirOpen(true)}
          onOpenOfflineSms={() => setIsOfflineSmsOpen(true)}
        />

        {/* Device Onboarding & Active Profile Switcher Modal */}
        <ProfileLoginModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          activeUser={activeUser}
          allProfiles={allProfiles}
          onSelectUser={selectUser}
          onUpdateGuestName={updateGuestName}
        />

        {/* In-Family Low-Latency Socket.io Chat Drawer */}
        <FamilyChatDrawer
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          activeUser={activeUser}
          onIncomingMessage={handleIncomingChatMessage}
        />

        {/* Phase 6.1 & 6.2: Pulse Oximeter Modal */}
        <OximeterLoggerModal
          isOpen={isOximeterOpen}
          onClose={() => setIsOximeterOpen(false)}
          defaultTravellerId={activeUser.isElder ? activeUser.id : undefined}
        />

        {/* Phase 6.3: Hydration & BP Medication Cadence Modal */}
        <HydrationMedsModal
          isOpen={isHydrationOpen}
          onClose={() => setIsHydrationOpen(false)}
        />

        {/* Phase 6.4: NH-7 Medical Relief Directory Modal */}
        <MedicalDirectoryModal
          isOpen={isMedicalDirOpen}
          onClose={() => setIsMedicalDirOpen(false)}
        />

        {/* Phase 6.5: Zero-Signal 2G SMS Dispatcher Modal */}
        <OfflineSmsModal
          isOpen={isOfflineSmsOpen}
          onClose={() => setIsOfflineSmsOpen(false)}
        />

        {/* Phase 7.1: Brahma Kapal Pitru Tarpan Liturgy & Panda Guide */}
        <BrahmaKapalGuideModal
          isOpen={isBrahmaKapalOpen}
          onClose={() => setIsBrahmaKapalOpen(false)}
        />

        {/* Phase 7.2: Segment-Aware Packing Checklist */}
        <PackingChecklistModal
          isOpen={isPackingOpen}
          onClose={() => setIsPackingOpen(false)}
        />

        {/* Phase 7.3: Offline Sacred Chants, Tanpura Synthesizer & Japa Counter */}
        <OfflineStotraPlayer
          isOpen={isStotraOpen}
          onClose={() => setIsStotraOpen(false)}
        />

        {/* Phase 7.4: Printable Yatra Memorial Certificate & 50/50 Settlement */}
        <YatraMemorialModal
          isOpen={isMemorialOpen}
          onClose={() => setIsMemorialOpen(false)}
        />

        {/* Phase 24: Autonomous Scheduled & Geofenced Email Alerts Modal */}
        <EmailAlertsModal
          isOpen={isEmailAlertsOpen}
          onClose={() => setIsEmailAlertsOpen(false)}
        />
      </div>
    </div>
  );
};

export default App;
