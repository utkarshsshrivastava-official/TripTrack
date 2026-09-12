import React, { useState } from 'react';
import { DuoId } from './shared/types';
import { useNetworkStatus } from './shared/hooks/useNetworkStatus';
import { Header } from './components/Header';
import { BottomNav, ActiveTab } from './components/BottomNav';
import { EmergencyModal } from './components/EmergencyModal';
import { ItineraryPreview } from './modules/itinerary/ItineraryPreview';
import { VaultPreview } from './modules/vault/VaultPreview';
import { TrackingPreview } from './modules/tracking/TrackingPreview';
import { GullakPreview } from './modules/gullak/GullakPreview';
import { VoiceFeedPreview } from './modules/voice-feed/VoiceFeedPreview';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('itinerary');
  const [activeDuo, setActiveDuo] = useState<DuoId | 'ALL'>('ALL');
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);

  const { isOnline, queuedCount, isSyncing, triggerSync } = useNetworkStatus();

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
        />

        {/* Main Scrollable View Area with safe dock padding */}
        <main className="flex-1 px-3 py-3 overflow-y-auto">
          {activeTab === 'itinerary' && <ItineraryPreview activeDuo={activeDuo} />}
          {activeTab === 'vault' && <VaultPreview activeDuo={activeDuo} />}
          {activeTab === 'tracking' && <TrackingPreview activeDuo={activeDuo} isOnline={isOnline} />}
          {activeTab === 'gullak' && <GullakPreview activeDuo={activeDuo} />}
          {activeTab === 'voice' && <VoiceFeedPreview activeDuo={activeDuo} />}
        </main>

        {/* Docked Mobile Bottom Navigation */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* High-Contrast Elder Emergency Modal */}
        <EmergencyModal
          isOpen={isEmergencyOpen}
          onClose={() => setIsEmergencyOpen(false)}
        />
      </div>
    </div>
  );
};

export default App;
