import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { DuoId } from '../../../shared/types';
import { TRAVELLERS_CONFIG } from '../../../shared/config/travellers.config';
import { Maximize2, Crosshair, Radio } from 'lucide-react';

interface FamilyMapProps {
  activeDuo: DuoId | 'ALL';
  onDuoChange?: (duo: DuoId | 'ALL') => void;
  selectedTravellerId?: string;
  onSelectTraveller?: (id: string) => void;
  className?: string;
}

interface Waypoint {
  name: string;
  coords: [number, number];
  altitudeMeters: number;
  highlight?: boolean;
  desc?: string;
}

const PILGRIMAGE_WAYPOINTS: Waypoint[] = [
  { name: "Haridwar (Ganga Aarti)", coords: [29.9457, 78.1642], altitudeMeters: 314, desc: "Plains gateway; sacred Ganga bathing ghats." },
  { name: "Rishikesh (Triveni Ghat)", coords: [30.0869, 78.2676], altitudeMeters: 372, desc: "Foothills transition before mountain ascent." },
  { name: "Devprayag (Alaknanda-Bhagirathi)", coords: [30.1460, 78.5990], altitudeMeters: 830, desc: "Birthplace of holy Ganga River." },
  { name: "Srinagar (Garhwal Valley)", coords: [30.2223, 78.7845], altitudeMeters: 560, desc: "Broad valley rest halt & emergency fuel." },
  { name: "Rudraprayag (Mandakini Sangam)", coords: [30.2858, 78.9811], altitudeMeters: 895, desc: "Confluence point towards Kedarnath & Badrinath split." },
  { name: "Karnaprayag (Pindar Sangam)", coords: [30.2589, 79.2192], altitudeMeters: 1450, desc: "Historic pilgrimage milestone." },
  { name: "Nandaprayag (Nandakini Sangam)", coords: [30.3308, 79.3195], altitudeMeters: 1358, desc: "Fourth Prayag confluence." },
  { name: "Pipalkoti (Roadside Halt)", coords: [30.4297, 79.4312], altitudeMeters: 1259, desc: "Pre-climb lunch & vehicle check." },
  { name: "Joshimath (Acclimatization Base)", coords: [30.5564, 79.5663], altitudeMeters: 1890, highlight: true, desc: "Winter seat of Badrinath; key acclimatization halt." },
  { name: "Vishnuprayag (Dhauliganga Sangam)", coords: [30.5645, 79.5712], altitudeMeters: 1372, desc: "Fifth Prayag; entrance to upper gorge." },
  { name: "Govindghat", coords: [30.6258, 79.5615], altitudeMeters: 1828, desc: "Valley of Flowers & Hemkund Sahib diversion." },
  { name: "Pandukeshwar (Yog Dhyan Badri)", coords: [30.6397, 79.5490], altitudeMeters: 1829, desc: "Ancient temple dedicated to King Pandu." },
  { name: "Hanuman Chatti (Barrier)", coords: [30.6974, 79.5078], altitudeMeters: 2400, highlight: true, desc: "High-Altitude Acclimatization check (>2,000m)." },
  { name: "Badrinath Dham (Sanctum)", coords: [30.7447, 79.4930], altitudeMeters: 3130, highlight: true, desc: "Main Temple Sanctum & Tapt Kund hot sulphur springs." },
  { name: "Mana (First Indian Village)", coords: [30.7712, 79.4960], altitudeMeters: 3200, desc: "Indo-Tibetan border village, Saraswati river origin & Vyas Gufa." }
];

export const FamilyMap: React.FC<FamilyMapProps> = ({
  activeDuo,
  onDuoChange,
  className
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [activeFocus, setActiveFocus] = useState<'badrinath' | 'joshimath' | 'full'>('badrinath');

  // Realistic live telemetry locations for pilgrims along the route
  const pilgrimPositions: Record<string, { coords: [number, number]; locationName: string; battery: number; altitude: number }> = {
    'traveller-utkarsh': { coords: [30.7447, 79.4930], locationName: 'Badrinath Temple Valley', battery: 88, altitude: 3130 },
    'traveller-rajnish': { coords: [30.7441, 79.4925], locationName: 'Badrinath Temple Valley (With Utkarsh)', battery: 92, altitude: 3130 },
    'traveller-shreyas': { coords: [30.5564, 79.5663], locationName: 'Joshimath Base Camp', battery: 78, altitude: 1890 },
    'traveller-sanjay': { coords: [30.5558, 79.5658], locationName: 'Joshimath Base Camp (With Shreyas)', battery: 84, altitude: 1890 }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize map centered at Joshimath / Badrinath corridor
      const map = L.map(mapContainerRef.current, {
        center: [30.65, 79.53],
        zoom: 10,
        zoomControl: false,
        attributionControl: false
      });

      // Free OpenStreetMap standard tiles with CSS dark inversion (zero-cost, zero-watermark)
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        className: 'dark-tiles',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      // Add route polyline
      const polylineCoords = PILGRIMAGE_WAYPOINTS.map(w => w.coords);

      // Outer glow line for night/mountain visibility
      L.polyline(polylineCoords, {
        color: '#f59e0b',
        weight: 8,
        opacity: 0.25,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      // Core route dashed neon line
      L.polyline(polylineCoords, {
        color: '#fbbf24',
        weight: 3.5,
        opacity: 0.95,
        dashArray: '8, 8',
        lineCap: 'round'
      }).addTo(map);

      // Waypoint circle dots
      PILGRIMAGE_WAYPOINTS.forEach((wp) => {
        const isHighAlt = wp.altitudeMeters >= 2000;
        const circle = L.circleMarker(wp.coords, {
          radius: wp.highlight ? 7 : 4.5,
          fillColor: isHighAlt ? '#f43f5e' : (wp.highlight ? '#f59e0b' : '#38bdf8'),
          color: '#020617',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.95
        });

        circle.bindPopup(`
          <div style="font-family: inherit; min-width: 170px;">
            <div style="font-size: 13px; font-weight: 800; color: #f8fafc; margin-bottom: 2px;">
              ${wp.name}
            </div>
            <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 4px;">
              <span style="font-family: monospace; font-size: 11px; font-weight: 800; color: ${isHighAlt ? '#fda4af' : '#7dd3fc'};">
                ⛰️ ${wp.altitudeMeters}m
              </span>
              ${isHighAlt ? '<span style="font-size: 9px; padding: 1px 5px; border-radius: 9999px; background: #881337; color: #fecdd3; font-weight: 800; letter-spacing: 0.05em;">COLD ZONE</span>' : ''}
            </div>
            <div style="font-size: 11px; color: #94a3b8; line-height: 1.35;">
              ${wp.desc || ''}
            </div>
          </div>
        `);

        circle.addTo(map);
      });

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
      }
    };
  }, []);

  // Update Pilgrim Avatar Pins whenever activeDuo changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    TRAVELLERS_CONFIG.forEach((traveller) => {
      // Filter out if not matching active Duo
      if (activeDuo !== 'ALL' && traveller.duoId !== activeDuo) {
        return;
      }

      const info = pilgrimPositions[traveller.id] || {
        coords: [30.7447, 79.4930] as [number, number],
        locationName: 'Badrinath Valley',
        battery: 85,
        altitude: 3130
      };

      const initial = traveller.name.charAt(0);
      const isSenior = traveller.isSeniorCitizen;
      const batteryPercent = info.battery;

      // Calculate SVG stroke offset for concentric battery ring (radius 18, circumference ~113.1)
      const circumference = 113.1;
      const strokeDashoffset = circumference - (circumference * batteryPercent) / 100;
      const batteryStrokeColor = batteryPercent > 50 ? '#22c55e' : batteryPercent > 20 ? '#f59e0b' : '#ef4444';

      const markerHtml = `
        <div style="
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 46px;
          height: 46px;
          cursor: pointer;
        ">
          <!-- Live Radar Breath Halo -->
          <div style="
            position: absolute;
            inset: -6px;
            border-radius: 9999px;
            background-color: ${traveller.avatarColor};
            opacity: 0.35;
            animation: ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>

          <!-- Secondary Glow Ring -->
          <div style="
            position: absolute;
            inset: -2px;
            border-radius: 9999px;
            border: 1.5px solid ${traveller.avatarColor};
            opacity: 0.6;
          "></div>

          <!-- Concentric Battery Ring SVG -->
          <svg style="position: absolute; width: 44px; height: 44px; transform: rotate(-90deg);" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="18" fill="none" stroke="#1e293b" stroke-width="3" />
            <circle cx="22" cy="22" r="18" fill="none" stroke="${batteryStrokeColor}" stroke-width="3"
              stroke-dasharray="${circumference}"
              stroke-dashoffset="${strokeDashoffset}"
              stroke-linecap="round"
            />
          </svg>
          
          <!-- Avatar Center -->
          <div style="
            position: relative;
            width: 32px;
            height: 32px;
            border-radius: 9999px;
            background-color: ${traveller.avatarColor};
            border: 2px solid #ffffff;
            box-shadow: 0 4px 14px rgba(0,0,0,0.7);
            color: #ffffff;
            font-weight: 900;
            font-size: 13px;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            ${initial}
            ${isSenior ? '<span style="position: absolute; -bottom: 2px; -right: 2px; font-size: 10px; background: #ffffff; color: #020617; border-radius: 9999px; width: 14px; height: 14px; display: flex; align-items: center; justify-content: center; font-weight: 900; box-shadow: 0 1px 3px rgba(0,0,0,0.5);">👴</span>' : ''}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-pilgrim-pin',
        iconSize: [46, 46],
        iconAnchor: [23, 23],
        popupAnchor: [0, -22]
      });

      const marker = L.marker(info.coords, { icon: customIcon });

      marker.bindPopup(`
        <div style="font-family: inherit; min-width: 200px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="display: inline-block; width: 10px; height: 10px; border-radius: 9999px; background: ${traveller.avatarColor};"></span>
              <strong style="font-size: 14px; color: #ffffff;">${traveller.name}</strong>
            </div>
            <span style="font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 9999px; background: ${traveller.avatarColor}33; color: ${traveller.avatarColor}; border: 1px solid ${traveller.avatarColor}66;">
              ${traveller.duoId === 'DUO_A' ? 'Family A' : 'Family B'}
            </span>
          </div>

          <div style="font-size: 11px; color: #cbd5e1; margin-bottom: 6px; display: flex; align-items: center; gap: 4px;">
            <span>📍</span>
            <span>${info.locationName}</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 10px; font-family: monospace; color: #94a3b8; background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: 6px; margin-top: 6px;">
            <div>🔋 Battery: <strong style="color: ${batteryStrokeColor};">${batteryPercent}%</strong></div>
            <div>⛰️ Alt: <strong style="color: #38bdf8;">${info.altitude}m</strong></div>
            <div>🩸 Blood: <strong style="color: #f87171;">${traveller.bloodGroup}</strong></div>
            <div>👥 Role: <strong style="color: #cbd5e1;">${traveller.relation}</strong></div>
          </div>

          ${traveller.isSeniorCitizen ? `
            <div style="margin-top: 8px; padding: 5px 8px; border-radius: 8px; background: #451a03; border: 1px solid #78350f; font-size: 10px; color: #fed7aa; display: flex; items-center; gap: 4px;">
              <span>⚠️</span>
              <span><strong>Senior Care:</strong> Warm water hydration & 2,000m pacing active</span>
            </div>
          ` : ''}
        </div>
      `);

      marker.addTo(markersLayerRef.current!);
    });
  }, [activeDuo]);

  const focusBadrinath = () => {
    setActiveFocus('badrinath');
    mapInstanceRef.current?.flyTo([30.7447, 79.4930], 12, { duration: 1.2 });
  };

  const focusJoshimath = () => {
    setActiveFocus('joshimath');
    mapInstanceRef.current?.flyTo([30.5564, 79.5663], 12, { duration: 1.2 });
  };

  const focusEntireRoute = () => {
    setActiveFocus('full');
    mapInstanceRef.current?.flyTo([30.40, 78.85], 8, { duration: 1.2 });
  };

  const handleCenterUser = () => {
    if (activeDuo === 'DUO_B') {
      focusJoshimath();
    } else {
      focusBadrinath();
    }
  };

  return (
    <div className={`relative w-full h-full min-h-[420px] bg-slate-950 overflow-hidden ${className || ''}`}>
      {/* Leaflet Map Canvas */}
      <div
        ref={mapContainerRef}
        className="w-full h-full min-h-[420px] absolute inset-0 z-0"
      />

      {/* Floating Top Control Bar (Frosted Glass Panel) */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2 pointer-events-auto">
        {/* Left: Active Live Indicator & Duo Pill */}
        <div className="flex items-center gap-1.5 glass-panel px-2.5 py-1.5 rounded-2xl shadow-xl">
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="tracking-wide">LIVE GPS</span>
          </div>

          {onDuoChange && (
            <div className="flex items-center gap-1 border-l border-white/10 pl-2 ml-1">
              {(['ALL', 'DUO_A', 'DUO_B'] as const).map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => onDuoChange(d)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all tap-active ${
                    activeDuo === d
                      ? 'bg-temple-gold text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {d === 'ALL' ? 'All' : d === 'DUO_A' ? 'Fam A' : 'Fam B'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Quick Camera Focus Pills */}
        <div className="flex items-center gap-1 glass-panel p-1 rounded-2xl shadow-xl">
          <button
            type="button"
            onClick={focusBadrinath}
            className={`px-2 py-1 rounded-xl text-[10px] font-extrabold transition-all tap-active ${
              activeFocus === 'badrinath'
                ? 'bg-temple-gold text-slate-950 shadow'
                : 'text-amber-300 hover:bg-slate-800/60'
            }`}
          >
            Dham
          </button>
          <button
            type="button"
            onClick={focusJoshimath}
            className={`px-2 py-1 rounded-xl text-[10px] font-extrabold transition-all tap-active ${
              activeFocus === 'joshimath'
                ? 'bg-sky-500 text-slate-950 shadow'
                : 'text-sky-300 hover:bg-slate-800/60'
            }`}
          >
            Base
          </button>
          <button
            type="button"
            onClick={focusEntireRoute}
            className={`p-1.5 rounded-xl text-slate-300 hover:text-white transition-all tap-active ${
              activeFocus === 'full' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60'
            }`}
            title="Fit Entire Circuit"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Floating Center Re-Center Crosshair Button */}
      <button
        type="button"
        onClick={handleCenterUser}
        className="absolute top-16 right-3 z-10 p-2.5 rounded-2xl glass-panel text-white hover:text-temple-gold shadow-2xl border border-white/10 tap-active"
        title="Center on Pilgrim"
      >
        <Crosshair className="w-4 h-4 text-temple-gold" />
      </button>

      {/* Floating Map Legend Indicator */}
      <div className="absolute top-16 left-3 z-10 glass-panel px-2.5 py-1 rounded-xl text-[10px] text-slate-300 flex items-center gap-2.5 pointer-events-none shadow-lg">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="font-mono text-[9px] text-rose-300">&gt;2,000m</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="font-mono text-[9px] text-amber-200">NH-7 Polyline</span>
        </div>
      </div>
    </div>
  );
};
