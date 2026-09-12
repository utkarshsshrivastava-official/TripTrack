import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { DuoId } from '../../../shared/types';
import { TRAVELLERS_CONFIG } from '../../../shared/config/travellers.config';
import { Compass, Maximize2, ShieldAlert } from 'lucide-react';

interface FamilyMapProps {
  activeDuo: DuoId | 'ALL';
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

export const FamilyMap: React.FC<FamilyMapProps> = ({ activeDuo }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Default positions for the two duos
  const pilgrimPositions: Record<string, { coords: [number, number]; locationName: string; battery: number }> = {
    'traveller-utkarsh': { coords: [30.7447, 79.4930], locationName: 'Badrinath Temple Valley', battery: 88 },
    'traveller-rajnish': { coords: [30.7441, 79.4925], locationName: 'Badrinath Temple Valley (With Utkarsh)', battery: 92 },
    'traveller-cousin': { coords: [30.5564, 79.5663], locationName: 'Joshimath Base Camp', battery: 78 },
    'traveller-uncle': { coords: [30.5558, 79.5658], locationName: 'Joshimath Base Camp (With Shreyas)', battery: 84 }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize map centered at Joshimath / Badrinath
      const map = L.map(mapContainerRef.current, {
        center: [30.65, 79.53],
        zoom: 9,
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
      
      // Outer glow line
      L.polyline(polylineCoords, {
        color: '#f59e0b',
        weight: 6,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      // Core route line
      L.polyline(polylineCoords, {
        color: '#fbbf24',
        weight: 3,
        opacity: 0.9,
        dashArray: '6, 6'
      }).addTo(map);

      // Waypoint circle dots
      PILGRIMAGE_WAYPOINTS.forEach((wp) => {
        const isHighAlt = wp.altitudeMeters >= 2000;
        const circle = L.circleMarker(wp.coords, {
          radius: wp.highlight ? 6 : 4,
          fillColor: isHighAlt ? '#f43f5e' : (wp.highlight ? '#fbbf24' : '#38bdf8'),
          color: '#0f172a',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9
        });

        circle.bindPopup(`
          <div style="font-family: inherit;">
            <div style="font-size: 12px; font-weight: 800; color: #f8fafc; margin-bottom: 2px;">
              ${wp.name}
            </div>
            <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 4px;">
              <span style="font-family: monospace; font-size: 11px; font-weight: 700; color: ${isHighAlt ? '#fda4af' : '#7dd3fc'};">
                ⛰️ ${wp.altitudeMeters}m
              </span>
              ${isHighAlt ? '<span style="font-size: 9px; padding: 1px 4px; border-radius: 4px; background: #881337; color: #fecdd3; font-weight: 700;">ACCLIMATIZATION ZONE</span>' : ''}
            </div>
            <div style="font-size: 11px; color: #94a3b8; line-height: 1.3;">
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
        battery: 85
      };

      const initial = traveller.name.charAt(0);
      const isSenior = traveller.isSeniorCitizen;

      const markerHtml = `
        <div style="
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
        ">
          <!-- Pulse ring for elder / coordinator -->
          <div style="
            position: absolute;
            inset: -4px;
            border-radius: 9999px;
            background-color: ${traveller.avatarColor};
            opacity: 0.35;
            animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
          
          <!-- Avatar circle -->
          <div style="
            position: relative;
            width: 32px;
            height: 32px;
            border-radius: 9999px;
            background-color: ${traveller.avatarColor};
            border: 2px solid #ffffff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.6);
            color: #ffffff;
            font-weight: 900;
            font-size: 13px;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            ${initial}
            ${isSenior ? '<span style="position: absolute; bottom: -2px; right: -2px; font-size: 9px; background: #ffffff; color: #0f172a; border-radius: 9999px; width: 12px; height: 12px; display: flex; align-items: center; justify-content: center; font-weight: 800;">👴</span>' : ''}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-pilgrim-pin',
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -18]
      });

      const marker = L.marker(info.coords, { icon: customIcon });

      marker.bindPopup(`
        <div style="font-family: inherit; min-width: 180px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <strong style="font-size: 13px; color: #ffffff;">${traveller.name}</strong>
            <span style="font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 9999px; background: ${traveller.avatarColor}33; color: ${traveller.avatarColor}; border: 1px solid ${traveller.avatarColor}66;">
              ${traveller.duoId === 'DUO_A' ? 'Duo A' : 'Duo B'}
            </span>
          </div>

          <div style="font-size: 11px; color: #cbd5e1; margin-bottom: 4px;">
            📍 ${info.locationName}
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; font-family: monospace; color: #94a3b8; border-top: 1px solid #334155; padding-top: 6px; margin-top: 4px;">
            <span>🔋 Battery: <strong style="color: #4ade80;">${info.battery}%</strong></span>
            <span>Blood: <strong style="color: #f87171;">${traveller.bloodGroup}</strong></span>
          </div>

          ${traveller.isSeniorCitizen ? `
            <div style="margin-top: 6px; padding: 4px 6px; border-radius: 6px; background: #451a03; border: 1px solid #78350f; font-size: 10px; color: #fed7aa;">
              ⚠️ <em>Acclimatization & Warm Water Pacing Active</em>
            </div>
          ` : ''}
        </div>
      `);

      marker.addTo(markersLayerRef.current!);
    });
  }, [activeDuo]);

  const focusBadrinath = () => {
    mapInstanceRef.current?.flyTo([30.7447, 79.4930], 12, { duration: 1.5 });
  };

  const focusJoshimath = () => {
    mapInstanceRef.current?.flyTo([30.5564, 79.5663], 12, { duration: 1.5 });
  };

  const focusEntireRoute = () => {
    mapInstanceRef.current?.flyTo([30.40, 78.85], 8, { duration: 1.5 });
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl relative">
      {/* Map Header Bar */}
      <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-temple-gold animate-spin-slow" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Live NH-7 Pilgrimage Map
          </span>
        </div>

        {/* Quick Zoom Shortcuts */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={focusBadrinath}
            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-amber-300 border border-slate-700 tap-active"
          >
            Badrinath
          </button>
          <button
            onClick={focusJoshimath}
            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-sky-300 border border-slate-700 tap-active"
          >
            Joshimath
          </button>
          <button
            onClick={focusEntireRoute}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 tap-active"
            title="Fit Entire Circuit"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-[360px] sm:h-[400px] z-0"
      />

      {/* Map Legend Overlay */}
      <div className="p-2.5 bg-slate-900/95 border-t border-slate-800 text-[10px] text-slate-300 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>&gt;2,000m Cold Zone</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Valley Trail</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-slate-400 font-mono">
          <ShieldAlert className="w-3 h-3 text-emerald-400" />
          <span>Zero-Cost OpenStreetMap</span>
        </div>
      </div>
    </div>
  );
};
