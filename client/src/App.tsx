import React, { useState } from 'react';
import { DuoId } from './shared/types';
import { useNetworkStatus } from './shared/hooks/useNetworkStatus';
import { useUserProfile } from './shared/hooks/useUserProfile';
import { Header } from './components/Header';
import { BottomNav, ActiveTab } from './components/BottomNav';
import { EmergencyModal } from './components/EmergencyModal';
import { ProfileLoginModal } from './components/ProfileLoginModal';
import { FamilyChatDrawer } from './modules/chat/components/FamilyChatDrawer';
import { OximeterLoggerModal } from './modules/health/components/OximeterLoggerModal';
import { HydrationMedsModal } from './modules/health/components/HydrationMedsModal';
import { MedicalDirectoryModal } from './modules/health/components/MedicalDirectoryModal';
import { OfflineSmsModal } from './modules/health/components/OfflineSmsModal';
import { ItineraryPreview } from './modules/itinerary/ItineraryPreview';
import { VaultPreview } from './modules/vault/VaultPreview';
import { TrackingPreview } from './modules/tracking/TrackingPreview';
import { GullakPreview } from './modules/gullak/GullakPreview';
import { VoiceFeedPreview } from './modules/voice-feed/VoiceFeedPreview';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('itinerary');
  const [activeDuo, setActiveDuo] = useState<DuoId | 'ALL'>('ALL');
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Phase 6: Elder Health & Dead-Zone Modal States
  const [isOximeterOpen, setIsOximeterOpen] = useState<boolean>(false);
  const [isHydrationOpen, setIsHydrationOpen] = useState<boolean>(false);
  const [isMedicalDirOpen, setIsMedicalDirOpen] = useState<boolean>(false);
  const [isOfflineSmsOpen, setIsOfflineSmsOpen] = useState<boolean>(false);

  const { isOnline, queuedCount, isSyncing, triggerSync } = useNetworkStatus();
  const {
    activeUser,
    allProfiles,
    selectUser,
    updateGuestName,
    isModalOpen: isProfileModalOpen,
    setIsModalOpen: setIsProfileModalOpen
  } = useUserProfile();

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center">
      {/* Mobile-First Frame: 100% on phones, max-w-md centered on desktop */}
      <div className="w-full max-w-md min-h-screen flex flex-col bg-alpine-950 text-slate-100 shadow-2xl relative border-x border-slate-800/40">
        {/* Sticky Mobile App Bar */}
        <Header
          activeDuo={activeDuo}
          setActiveDuo={setActiveDuo}
          isOnline={isOnline}
          queuedCount={queuedCount}
          isSyncing={isSyncing}
          onManualSync={triggerSync}
          onOpenEmergency={() => setIsEmergencyOpen(true)}
          activeUser={activeUser}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenChat={() => setIsChatOpen(true)}
          onOpenHealth={() => setIsOximeterOpen(true)}
          onOpenHydration={() => setIsHydrationOpen(true)}
        />

        {/* Main Scrollable View Area with safe dock padding */}
        <main className="flex-1 px-3 py-3 overflow-y-auto">
          {activeTab === 'itinerary' && <ItineraryPreview activeDuo={activeDuo} />}
          {activeTab === 'vault' && <VaultPreview activeDuo={activeDuo} />}
          {activeTab === 'tracking' && (
            <TrackingPreview
              activeDuo={activeDuo}
              isOnline={isOnline}
              onOpenOfflineSms={() => setIsOfflineSmsOpen(true)}
              onOpenMedicalDirectory={() => setIsMedicalDirOpen(true)}
              onOpenOximeter={() => setIsOximeterOpen(true)}
            />
          )}
          {activeTab === 'gullak' && <GullakPreview activeDuo={activeDuo} />}
          {activeTab === 'voice' && <VoiceFeedPreview activeDuo={activeDuo} />}
        </main>

        {/* Docked Mobile Bottom Navigation */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

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
      </div>
    </div>
  );
};

export default App;
