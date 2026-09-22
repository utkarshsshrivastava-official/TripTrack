import React, { useState, useEffect } from 'react';
import { 
  X, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Car, 
  CheckCircle2, 
  Copy, 
  Share2, 
  Sparkles, 
  MapPin, 
  Save, 
  Check 
} from 'lucide-react';
import { CabAgency, HillCabInspectionItem, LogisticsInfo } from '../../../shared/types';
import { HARIDWAR_CAB_AGENCIES_DIRECTORY, HILL_CAB_INSPECTION_DEFAULTS } from '../../../shared/config/trip.config';

interface HaridwarCabHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncDriverLogistics: (driverInfo: {
    driverName: string;
    driverPhone: string;
    vehiclePlate: string;
    vehicleModel: string;
    pickupLocation: string;
  }) => Promise<void>;
  currentLogistics?: LogisticsInfo;
}

export const HaridwarCabHubModal: React.FC<HaridwarCabHubModalProps> = ({
  isOpen,
  onClose,
  onSyncDriverLogistics,
  currentLogistics
}) => {
  const [activeTab, setActiveTab] = useState<'directory' | 'inspection' | 'handover'>('directory');
  const [vehicleFilter, setVehicleFilter] = useState<'ALL' | 'INNOVA' | 'ERTIGA'>('ALL');
  
  // Inspection checklist state
  const [inspectionItems, setInspectionItems] = useState<HillCabInspectionItem[]>(() => {
    try {
      const saved = localStorage.getItem('triptrack_cab_inspection');
      if (saved) return JSON.parse(saved);
    } catch {}
    return HILL_CAB_INSPECTION_DEFAULTS;
  });

  // Driver handover form state
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleModel, setVehicleModel] = useState('Toyota Innova Crysta');
  const [pickupLocation, setPickupLocation] = useState('Haridwar Hotel Porch');
  const [isSaving, setIsSaving] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  useEffect(() => {
    if (currentLogistics) {
      if (currentLogistics.driverName) setDriverName(currentLogistics.driverName);
      if (currentLogistics.driverPhone && currentLogistics.driverPhone !== 'Pre-arranged in Haridwar') {
        setDriverPhone(currentLogistics.driverPhone);
      }
      if (currentLogistics.identifier && currentLogistics.identifier.includes('UK-')) {
        setVehiclePlate(currentLogistics.identifier);
      }
      if (currentLogistics.pickupLocation) setPickupLocation(currentLogistics.pickupLocation);
    }
  }, [currentLogistics]);

  // Persist inspection checks
  const toggleInspection = (id: string) => {
    setInspectionItems(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item);
      try {
        localStorage.setItem('triptrack_cab_inspection', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  if (!isOpen) return null;

  const filteredAgencies = HARIDWAR_CAB_AGENCIES_DIRECTORY.filter(agency => {
    if (vehicleFilter === 'INNOVA') return agency.estimatedPricing.innovaCrysta;
    if (vehicleFilter === 'ERTIGA') return agency.estimatedPricing.ertiga;
    return true;
  });

  const passedCount = inspectionItems.filter(i => i.checked).length;
  const isAllPassed = passedCount === inspectionItems.length;

  // Generate WhatsApp inquiry link for an agency
  const getWhatsAppInquiryUrl = (agency: CabAgency) => {
    const text = encodeURIComponent(
      `Namaste, we need an Innova Crysta / Ertiga for 4 passengers (including 2 senior fathers in their 60s) for a 3-Day Haridwar to Badrinath Dham round-trip.\n\n` +
      `📅 Schedule: Departure Sep 26 (05:30 AM), Return Sep 28 evening.\n` +
      `Route: Haridwar → Devprayag → Rudraprayag → Joshimath → Badrinath → Mana → Dhari Devi → Haridwar.\n\n` +
      `Please share your best all-inclusive quote (including toll, parking, green card & driver allowance). We require an experienced mountain driver.`
    );
    return `https://wa.me/${agency.whatsapp}?text=${text}`;
  };

  // Generate complete handover text for the assigned driver
  const generateHandoverBriefing = () => {
    return (
      `🏔️ *TripTrack — Badrinath Dham Hill Cab Handover Briefing*\n\n` +
      `🚕 *Vehicle:* ${vehicleModel} (${vehiclePlate || 'Assigned Cab'})\n` +
      `👤 *Driver Name:* ${driverName || 'Mountain Driver'}\n` +
      `📞 *Driver Phone:* ${driverPhone || 'N/A'}\n` +
      `📍 *Pickup:* ${pickupLocation} on Sep 26 at 05:30 AM sharp\n\n` +
      `👥 *Passengers (4 Pilgrims):*\n` +
      `• Sanjay Ji (Senior Elder / Father - Family B)\n` +
      `• Rajnish Ji (Senior Elder / Father - Family A)\n` +
      `• Shreyas (Son / Coordinator: +91 98765 43210)\n` +
      `• Utkarsh (Son / Coordinator: +91 98765 43211)\n\n` +
      `🗺️ *3-Day Planned Itinerary:*\n` +
      `• *Day 1 (Sep 26):* 05:30 Haridwar departure → Devprayag (halt) → Srinagar (breakfast) → Rudraprayag → Joshimath/Badrinath base before 18:00 dusk.\n` +
      `• *Day 2 (Sep 27):* Badrinath Temple Darshan & Brahma Kapal Tarpan → Mana Village (Vyas Gufa) → Night stay.\n` +
      `• *Day 3 (Sep 28):* 07:00 Descent → Maa Dhari Devi Temple Darshan (Kalyasaur) → Rudraprayag Sangam → Haridwar hotel check-in.\n\n` +
      `⚠️ *Elder Safety Rules:*\n` +
      `1. Middle row captain seats reserved for senior fathers.\n` +
      `2. Strict NO NIGHT DRIVING after 18:30 dusk on NH-7 curves.\n` +
      `3. Steady, gentle driving speed on curves.`
    );
  };

  const handleCopyHandover = () => {
    navigator.clipboard.writeText(generateHandoverBriefing());
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const handleSendWhatsAppDriver = () => {
    const cleanPhone = driverPhone.replace(/\D/g, '');
    const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const text = encodeURIComponent(generateHandoverBriefing());
    window.open(`https://wa.me/${targetPhone || ''}?text=${text}`, '_blank');
  };

  const handleSyncToItinerary = async () => {
    if (!driverPhone && !vehiclePlate) return;
    try {
      setIsSaving(true);
      await onSyncDriverLogistics({
        driverName: driverName.trim(),
        driverPhone: driverPhone.trim(),
        vehiclePlate: vehiclePlate.trim(),
        vehicleModel: vehicleModel.trim(),
        pickupLocation: pickupLocation.trim()
      });
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to sync driver logistics:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white leading-tight">Haridwar Hill Cab & Agency Hub</h3>
              <p className="text-xs text-amber-300/90 font-medium">Badrinath 3-Day Round-Trip (Sep 26 – Sep 28)</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center tap-active"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Navigation Tabs */}
        <div className="grid grid-cols-3 p-1.5 mx-4 mt-3 rounded-2xl bg-slate-950 border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('directory')}
            className={`py-2 text-[11px] font-bold rounded-xl transition-all ${
              activeTab === 'directory'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📞 Agencies ({filteredAgencies.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('inspection')}
            className={`py-2 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeTab === 'inspection'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Inspection ({passedCount}/8)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('handover')}
            className={`py-2 text-[11px] font-bold rounded-xl transition-all ${
              activeTab === 'handover'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📋 Driver Handover
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-5 overflow-y-auto no-scrollbar space-y-4 flex-1">
          {/* --- TAB 1: AGENCY DIRECTORY --- */}
          {activeTab === 'directory' && (
            <div className="space-y-3.5">
              {/* Fair Rate Benchmark Guide Banner */}
              <div className="rounded-2xl bg-gradient-to-r from-amber-950/40 to-slate-950 border border-amber-500/30 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Standard 3-Day Round Trip Rates
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Haridwar ↔ Badrinath</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">Maruti Ertiga (SUV)</span>
                    <span className="text-sm font-black text-white">₹16k – ₹19k</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">Innova Crysta (Captain Seats)</span>
                    <span className="text-sm font-black text-amber-300">₹22k – ₹26k</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  💡 <strong className="text-amber-300">Must Include:</strong> All hill road tolls, Uttarakhand border Green Card, parking, and Driver DA (₹400/day).
                </p>
              </div>

              {/* Vehicle Type Filter Chips */}
              <div className="flex items-center gap-1.5 pb-1">
                <span className="text-[11px] font-bold text-slate-400 mr-1">Filter:</span>
                {(['ALL', 'INNOVA', 'ERTIGA'] as const).map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setVehicleFilter(f)}
                    className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-all tap-active ${
                      vehicleFilter === f
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {f === 'ALL' ? 'All Vehicles' : f === 'INNOVA' ? 'Innova Crysta' : 'Maruti Ertiga'}
                  </button>
                ))}
              </div>

              {/* Agency List */}
              <div className="space-y-3">
                {filteredAgencies.map((agency) => (
                  <div
                    key={agency.id}
                    className="rounded-2xl bg-slate-950 border border-slate-800/90 p-4 space-y-3 shadow-md hover:border-slate-700 transition-all"
                  >
                    {/* Agency Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-black text-white leading-tight">
                            {agency.name}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            ★ {agency.rating}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>{agency.location} • {agency.distanceFromStation}</span>
                        </p>
                      </div>

                      <span className="shrink-0 text-[10px] font-semibold px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300">
                        {agency.trustedBadge}
                      </span>
                    </div>

                    {/* Price Estimates */}
                    <div className="flex flex-wrap gap-2 text-xs">
                      <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                        <span className="text-slate-400 font-mono text-[10px]">Ertiga: </span>
                        <span className="font-bold text-white">{agency.estimatedPricing.ertiga}</span>
                      </div>
                      <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                        <span className="text-slate-400 font-mono text-[10px]">Innova Crysta: </span>
                        <span className="font-bold text-amber-300">{agency.estimatedPricing.innovaCrysta}</span>
                      </div>
                    </div>

                    {/* Notes */}
                    <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-900/50 p-2 rounded-xl border border-slate-800/60">
                      {agency.notes}
                    </p>

                    {/* 1-Tap Action Buttons: Direct Call & WhatsApp */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <a
                        href={`tel:${agency.phone}`}
                        className="min-h-touch py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 tap-active shadow-sm"
                      >
                        <Phone className="w-4 h-4 text-sky-400" />
                        <span>Call Direct</span>
                      </a>

                      <a
                        href={getWhatsAppInquiryUrl(agency)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-touch py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 tap-active shadow-sm"
                      >
                        <MessageSquare className="w-4 h-4 text-white" />
                        <span>WhatsApp Quote</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- TAB 2: VEHICLE & DRIVER INSPECTION --- */}
          {activeTab === 'inspection' && (
            <div className="space-y-4">
              {/* Score Indicator */}
              <div className="rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-300">Elder Dignity & Safety Score</div>
                  <div className="text-lg font-black text-white mt-0.5 flex items-center gap-2">
                    <span className={isAllPassed ? 'text-emerald-400' : 'text-amber-400'}>
                      {passedCount} / 8 Checks Passed
                    </span>
                    {isAllPassed && <CheckCircle2 className="w-5 h-5 text-emerald-400 inline" />}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {isAllPassed ? 'Vehicle fully approved for senior fathers!' : 'Verify remaining checkpoints with agency before paying advance.'}
                  </div>
                </div>

                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border font-black text-sm ${
                  isAllPassed
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                    : 'bg-amber-500/20 border-amber-500 text-amber-400'
                }`}>
                  {Math.round((passedCount / 8) * 100)}%
                </div>
              </div>

              {/* Checklist Items */}
              <div className="space-y-2">
                {inspectionItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleInspection(item.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all tap-active flex items-start gap-3 ${
                      item.checked
                        ? 'bg-emerald-950/25 border-emerald-500/50 text-white'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      item.checked
                        ? 'bg-emerald-500 text-slate-950'
                        : 'border border-slate-700 bg-slate-900'
                    }`}>
                      {item.checked && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className={`text-xs font-bold leading-snug ${item.checked ? 'text-emerald-200' : 'text-white'}`}>
                          {item.title}
                        </h4>
                        {item.critical && (
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30 shrink-0">
                            Critical
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* --- TAB 3: 1-TAP DRIVER HANDOVER --- */}
          {activeTab === 'handover' && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-amber-950/20 border border-amber-500/20 p-3.5 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <Share2 className="w-4 h-4" />
                  Assign Driver & Dispatch Itinerary
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Enter your assigned driver details. Send the full Badrinath route briefing on WhatsApp and sync details across the app for all family members.
                </p>
              </div>

              {/* Driver Form */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Driver Name</label>
                    <input
                      type="text"
                      value={driverName}
                      onChange={e => setDriverName(e.target.value)}
                      placeholder="e.g. Ramesh Negi"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Driver Phone</label>
                    <input
                      type="tel"
                      value={driverPhone}
                      onChange={e => setDriverPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Vehicle Model</label>
                    <select
                      value={vehicleModel}
                      onChange={e => setVehicleModel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 focus:outline-none"
                    >
                      <option value="Toyota Innova Crysta">Toyota Innova Crysta</option>
                      <option value="Maruti Suzuki Ertiga">Maruti Suzuki Ertiga</option>
                      <option value="Mahindra Scorpio">Mahindra Scorpio</option>
                      <option value="Toyota Innova (Classic)">Toyota Innova (Classic)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Number Plate</label>
                    <input
                      type="text"
                      value={vehiclePlate}
                      onChange={e => setVehiclePlate(e.target.value)}
                      placeholder="e.g. UK-08 TA 1234"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 focus:outline-none uppercase font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Pickup Porch Address</label>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={e => setPickupLocation(e.target.value)}
                    placeholder="e.g. Hotel Gangotri Porch, Devpura, Haridwar"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleSendWhatsAppDriver}
                  className="w-full min-h-touch py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 tap-active"
                >
                  <MessageSquare className="w-4 h-4 text-white" />
                  <span>Send Itinerary to Driver on WhatsApp</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleCopyHandover}
                    className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 tap-active"
                  >
                    {copySuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                    <span>{copySuccess ? 'Copied!' : 'Copy Briefing'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={handleSyncToItinerary}
                    className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 tap-active disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 stroke-[2.5]" />
                    <span>{syncSuccess ? 'Synced to App!' : isSaving ? 'Saving...' : 'Sync to Itinerary'}</span>
                  </button>
                </div>
              </div>

              {/* Preview Box */}
              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-3.5 space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Preview WhatsApp Briefing:
                </span>
                <div className="text-[11px] text-slate-300 font-mono whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto no-scrollbar bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                  {generateHandoverBriefing()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HaridwarCabHubModal;
