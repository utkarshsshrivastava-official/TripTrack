import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { DuoId } from '../../../shared/types';
import { TRAVELLERS_CONFIG } from '../../../shared/config/travellers.config';
import { 
  PILGRIMAGE_WAYPOINTS, 
  CELLULAR_DEAD_ZONES, 
  PilgrimageWaypoint 
} from '../../../shared/config/pilgrimageRoute.config';
import { DetectedLocation } from '../../../shared/services/locationService';
import { RouteProfilePoint } from '../services/elevationOxygenService';
import { 
  Maximize2, 
  Crosshair, 
  Play, 
  Square,
  SignalZero
} from 'lucide-react';

export type MapTileLayerType = 'SATELLITE' | 'TOPO' | 'DARK';

interface FamilyMapProps {
  activeDuo: DuoId | 'ALL';
  onDuoChange?: (duo: DuoId | 'ALL') => void;
  selectedTravellerId?: string;
  onSelectTraveller?: (id: string) => void;
  className?: string;
  liveLocation?: DetectedLocation | null;
  isFollowMe?: boolean;
  onSelectWaypoint?: (waypoint: PilgrimageWaypoint) => void;
  scrubbedPoint?: RouteProfilePoint | null;
}

export const FamilyMap: React.FC<FamilyMapProps> = ({
  activeDuo,
  onDuoChange,
  className,
  liveLocation,
  isFollowMe = false,
  onSelectWaypoint,
  scrubbedPoint
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const liveGpsMarkerRef = useRef<L.Marker | null>(null);
  const liveGpsAccuracyRef = useRef<L.Circle | null>(null);
  const scrubMarkerRef = useRef<L.Marker | null>(null);

  const [activeLayer, setActiveLayer] = useState<MapTileLayerType>('SATELLITE');
  const [activeFocus, setActiveFocus] = useState<'badrinath' | 'joshimath' | 'full'>('full');
  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const tourTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Simulated fallback pilgrim locations if hardware GPS is not available for all 4
  const pilgrimPositions: Record<string, { coords: [number, number]; locationName: string; battery: number; altitude: number }> = {
    'traveller-utkarsh': { 
      coords: liveLocation ? [liveLocation.latitude, liveLocation.longitude] : [30.7447, 79.4930], 
      locationName: liveLocation?.name || 'Badrinath Temple Valley', 
      battery: 88, 
      altitude: liveLocation?.altitudeMeters || 3130 
    },
    'traveller-rajnish': { 
      coords: liveLocation ? [liveLocation.latitude - 0.0003, liveLocation.longitude - 0.0002] : [30.7441, 79.4925], 
      locationName: 'With Utkarsh', 
      battery: 92, 
      altitude: 3130 
    },
    'traveller-shreyas': { coords: [30.5564, 79.5663], locationName: 'Joshimath Base Camp', battery: 78, altitude: 1890 },
    'traveller-sanjay': { coords: [30.5558, 79.5658], locationName: 'Joshimath Base Camp', battery: 84, altitude: 1890 }
  };

  /**
   * Helper to switch tile providers
   */
  const switchTileLayer = useCallback((layerType: MapTileLayerType) => {
    if (!mapInstanceRef.current) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    let url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    let className = 'satellite-tiles';
    let attribution = '&copy; Esri World Imagery';

    if (layerType === 'TOPO') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';
      className = 'topo-tiles';
      attribution = '&copy; Esri World Topo';
    } else if (layerType === 'DARK') {
      url = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
      className = 'dark-tiles';
      attribution = '&copy; OpenStreetMap';
    }

    const newLayer = L.tileLayer(url, {
      maxZoom: 18,
      className,
      attribution
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newLayer;
    setActiveLayer(layerType);
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center midway in the Alaknanda valley
      const map = L.map(mapContainerRef.current, {
        center: [30.45, 79.25],
        zoom: 9,
        zoomControl: false,
        attributionControl: false
      });

      // Default to Satellite Imagery for rich aesthetics
      const defaultTile = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18, className: 'satellite-tiles' }
      ).addTo(map);

      tileLayerRef.current = defaultTile;

      // Outer glow line for night/mountain visibility
      const polylineCoords = PILGRIMAGE_WAYPOINTS.map(w => w.coords);

      L.polyline(polylineCoords, {
        color: '#f59e0b',
        weight: 9,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      // Core route dashed neon line
      L.polyline(polylineCoords, {
        color: '#fbbf24',
        weight: 4,
        opacity: 0.95,
        dashArray: '8, 8',
        lineCap: 'round'
      }).addTo(map);

      // Dead-Zone Canyon Overlays
      CELLULAR_DEAD_ZONES.forEach(dz => {
        const isBlackout = dz.severity === 'COMPLETE_BLACKOUT';
        const dzPolyline = L.polyline(dz.coords, {
          color: isBlackout ? '#ef4444' : '#f97316',
          weight: 7,
          opacity: 0.65,
          dashArray: '4, 6'
        }).addTo(map);

        dzPolyline.bindPopup(`
          <div style="font-family: inherit; min-width: 180px;">
            <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 4px;">
              <span style="font-size: 13px;">📵</span>
              <strong style="font-size: 12px; color: ${isBlackout ? '#fca5a5' : '#fed7aa'};">
                ${dz.name}
              </strong>
            </div>
            <div style="font-size: 10px; color: #94a3b8; line-height: 1.35;">
              ${dz.reassuranceNote}
            </div>
          </div>
        `);
      });

      // Waypoint circle dots & interactive popups
      PILGRIMAGE_WAYPOINTS.forEach((wp) => {
        const isHighAlt = wp.altitudeMeters >= 2000;
        const circle = L.circleMarker(wp.coords, {
          radius: wp.highlight ? 8 : 5.5,
          fillColor: isHighAlt ? '#f43f5e' : (wp.highlight ? '#f59e0b' : '#38bdf8'),
          color: '#020617',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.95
        });

        // Click opens the Sacred Landmark Drawer if handler exists
        circle.on('click', () => {
          if (onSelectWaypoint) {
            onSelectWaypoint(wp);
          }
        });

        circle.bindTooltip(`
          <div style="font-family: inherit; font-size: 11px; font-weight: 800; color: #ffffff;">
            ${wp.name} • ⛰️ ${wp.altitudeMeters}m
          </div>
        `, { direction: 'top', offset: [0, -6] });

        circle.addTo(map);
      });

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;
    }

    return () => {
      if (tourTimeoutRef.current) clearTimeout(tourTimeoutRef.current);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
      }
    };
  }, [onSelectWaypoint]);

  // Update Pilgrim Avatar Pins whenever activeDuo or liveLocation changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    TRAVELLERS_CONFIG.forEach((traveller) => {
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
            ${isSenior ? '<span style="position: absolute; bottom: -2px; right: -2px; font-size: 10px; background: #ffffff; color: #020617; border-radius: 9999px; width: 14px; height: 14px; display: flex; align-items: center; justify-content: center; font-weight: 900; box-shadow: 0 1px 3px rgba(0,0,0,0.5);">👴</span>' : ''}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-pilgrim-pin',
        iconSize: [46, 46],
        iconAnchor: [23, 23]
      });

      const marker = L.marker(info.coords, { icon: customIcon });

      marker.bindPopup(`
        <div style="font-family: inherit; min-width: 200px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="display: inline-block; width: 10px; height: 10px; border-radius: 9999px; background: ${traveller.avatarColor};"></span>
              <strong style="font-size: 14px; color: #ffffff;">${traveller.name}</strong>
            </div>
            <span style="font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 9999px; background: ${traveller.avatarColor}33; color: ${traveller.avatarColor};">
              ${traveller.duoId === 'DUO_A' ? 'Family A' : 'Family B'}
            </span>
          </div>

          <div style="font-size: 11px; color: #cbd5e1; margin-bottom: 6px;">
            📍 ${info.locationName}
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 10px; font-family: monospace; color: #94a3b8; background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: 6px;">
            <div>🔋 <strong style="color: ${batteryStrokeColor};">${batteryPercent}%</strong></div>
            <div>⛰️ <strong style="color: #38bdf8;">${info.altitude}m</strong></div>
            <div>🩸 <strong style="color: #f87171;">${traveller.bloodGroup}</strong></div>
            <div>👥 <strong style="color: #cbd5e1;">${traveller.relation}</strong></div>
          </div>
        </div>
      `);

      marker.addTo(markersLayerRef.current!);
    });
  }, [activeDuo, liveLocation]);

  // Live Hardware GPS Pin Rendering & Follow-Me Auto-Pan
  useEffect(() => {
    if (!mapInstanceRef.current || !liveLocation) return;

    const coords: [number, number] = [liveLocation.latitude, liveLocation.longitude];
    const heading = liveLocation.headingDegrees ?? 0;

    // Follow-Me Auto-Pan Lock
    if (isFollowMe) {
      mapInstanceRef.current.panTo(coords, { animate: true, duration: 1.0 });
    }

    // Accuracy Circle
    if (liveLocation.accuracyMeters && liveLocation.accuracyMeters < 500) {
      if (!liveGpsAccuracyRef.current) {
        liveGpsAccuracyRef.current = L.circle(coords, {
          radius: liveLocation.accuracyMeters,
          fillColor: '#38bdf8',
          fillOpacity: 0.12,
          stroke: false
        }).addTo(mapInstanceRef.current);
      } else {
        liveGpsAccuracyRef.current.setLatLng(coords);
        liveGpsAccuracyRef.current.setRadius(liveLocation.accuracyMeters);
      }
    }

    // Vehicle Navigation Pin HTML with Direction Bearing
    const vehicleIconHtml = `
      <div style="
        position: relative;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <!-- Live Ripple Pulse -->
        <div style="
          position: absolute;
          inset: -4px;
          border-radius: 9999px;
          background-color: #38bdf8;
          opacity: 0.4;
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>

        <!-- Heading Bearing Indicator -->
        <div style="
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(${heading}deg);
        ">
          <div style="
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-bottom: 9px solid #38bdf8;
            margin-top: -24px;
          "></div>
        </div>

        <!-- Center Vehicle Blue Pin -->
        <div style="
          width: 24px;
          height: 24px;
          border-radius: 9999px;
          background: #0284c7;
          border: 2.5px solid #ffffff;
          box-shadow: 0 0 12px rgba(56, 189, 248, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 11px;
        ">
          🚗
        </div>
      </div>
    `;

    const vehicleIcon = L.divIcon({
      html: vehicleIconHtml,
      className: 'live-gps-vehicle-pin',
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    if (!liveGpsMarkerRef.current) {
      liveGpsMarkerRef.current = L.marker(coords, { icon: vehicleIcon, zIndexOffset: 1000 })
        .addTo(mapInstanceRef.current);
    } else {
      liveGpsMarkerRef.current.setLatLng(coords);
      liveGpsMarkerRef.current.setIcon(vehicleIcon);
    }
  }, [liveLocation, isFollowMe]);

  // Synchronous Crosshair Marker for Elevation Scrubber
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (!scrubbedPoint) {
      if (scrubMarkerRef.current) {
        mapInstanceRef.current.removeLayer(scrubMarkerRef.current);
        scrubMarkerRef.current = null;
      }
      return;
    }

    const coords = scrubbedPoint.coords;

    const crosshairIcon = L.divIcon({
      html: `
        <div style="
          width: 28px;
          height: 28px;
          border-radius: 9999px;
          border: 2px dashed #f59e0b;
          background: rgba(245, 158, 11, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 1.5s infinite;
        ">
          <div style="width: 8px; height: 8px; border-radius: 9999px; background: #f59e0b;"></div>
        </div>
      `,
      className: 'scrubber-crosshair',
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    if (!scrubMarkerRef.current) {
      scrubMarkerRef.current = L.marker(coords, { icon: crosshairIcon, zIndexOffset: 900 })
        .addTo(mapInstanceRef.current);
    } else {
      scrubMarkerRef.current.setLatLng(coords);
    }

    // Smoothly pan to scrub point if far away
    mapInstanceRef.current.panTo(coords, { animate: true, duration: 0.5 });
  }, [scrubbedPoint]);

  // Cinematic Route Flyover Tour
  const startCinematicTour = () => {
    if (!mapInstanceRef.current) return;
    setIsTourRunning(true);

    const tourWaypoints = [
      { coords: [29.9457, 78.1642] as [number, number], zoom: 11, name: 'Haridwar' },
      { coords: [30.1460, 78.5990] as [number, number], zoom: 12, name: 'Devprayag Sangam' },
      { coords: [30.2858, 78.9811] as [number, number], zoom: 12, name: 'Rudraprayag' },
      { coords: [30.5564, 79.5663] as [number, number], zoom: 12, name: 'Joshimath Base' },
      { coords: [30.7447, 79.4930] as [number, number], zoom: 13, name: 'Badrinath Sanctum' },
      { coords: [30.7712, 79.4960] as [number, number], zoom: 13, name: 'Mana Border' }
    ];

    let step = 0;
    const executeStep = () => {
      if (step >= tourWaypoints.length) {
        setIsTourRunning(false);
        mapInstanceRef.current?.flyTo([30.45, 79.25], 9, { duration: 1.5 });
        return;
      }

      const current = tourWaypoints[step];
      mapInstanceRef.current?.flyTo(current.coords, current.zoom, { duration: 2.5 });
      step++;
      tourTimeoutRef.current = setTimeout(executeStep, 4500);
    };

    executeStep();
  };

  const stopCinematicTour = () => {
    if (tourTimeoutRef.current) clearTimeout(tourTimeoutRef.current);
    setIsTourRunning(false);
  };

  const focusBadrinath = () => {
    setActiveFocus('badrinath');
    mapInstanceRef.current?.flyTo([30.7447, 79.4930], 13, { duration: 1.2 });
  };

  const focusJoshimath = () => {
    setActiveFocus('joshimath');
    mapInstanceRef.current?.flyTo([30.5564, 79.5663], 12, { duration: 1.2 });
  };

  const focusEntireRoute = () => {
    setActiveFocus('full');
    mapInstanceRef.current?.flyTo([30.45, 79.25], 9, { duration: 1.2 });
  };

  const handleCenterUser = () => {
    if (liveLocation) {
      mapInstanceRef.current?.flyTo([liveLocation.latitude, liveLocation.longitude], 14, { duration: 1.0 });
    } else if (activeDuo === 'DUO_B') {
      focusJoshimath();
    } else {
      focusBadrinath();
    }
  };

  return (
    <div className={`relative w-full h-full min-h-[440px] bg-slate-950 overflow-hidden ${className || ''}`}>
      {/* Leaflet Map Canvas */}
      <div
        ref={mapContainerRef}
        className="w-full h-full min-h-[440px] absolute inset-0 z-0"
      />

      {/* Floating Top Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2 pointer-events-auto">
        {/* Left: Layer Switcher & Duo Pills */}
        <div className="flex items-center gap-1.5 glass-panel p-1.5 rounded-2xl shadow-xl">
          {/* Tile Layer Selector */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => switchTileLayer('SATELLITE')}
              className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all tap-active ${
                activeLayer === 'SATELLITE'
                  ? 'bg-temple-gold text-slate-950 shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="ESRI Photorealistic Satellite"
            >
              🛰️ Sat
            </button>
            <button
              type="button"
              onClick={() => switchTileLayer('TOPO')}
              className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all tap-active ${
                activeLayer === 'TOPO'
                  ? 'bg-sky-500 text-slate-950 shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="3D Topographic Terrain"
            >
              ⛰️ Topo
            </button>
            <button
              type="button"
              onClick={() => switchTileLayer('DARK')}
              className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all tap-active ${
                activeLayer === 'DARK'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Alpine Night Mode"
            >
              🌙 Dark
            </button>
          </div>

          {/* Duo Filter */}
          {onDuoChange && (
            <div className="flex items-center gap-0.5 border-l border-white/10 pl-1.5 ml-0.5">
              {(['ALL', 'DUO_A', 'DUO_B'] as const).map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => onDuoChange(d)}
                  className={`px-1.5 py-0.5 rounded-lg text-[9px] font-black transition-all tap-active ${
                    activeDuo === d
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {d === 'ALL' ? 'All' : d === 'DUO_A' ? 'A' : 'B'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Camera Focus & Cinematic Tour Pills */}
        <div className="flex items-center gap-1 glass-panel p-1 rounded-2xl shadow-xl">
          {/* Cinematic Flyover button */}
          <button
            type="button"
            onClick={isTourRunning ? stopCinematicTour : startCinematicTour}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold flex items-center gap-1 transition-all tap-active ${
              isTourRunning
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-slate-800 text-amber-300 hover:text-white border border-white/10'
            }`}
            title="Cinematic Route Flyover"
          >
            {isTourRunning ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
            <span>{isTourRunning ? 'Stop' : 'Tour'}</span>
          </button>

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
        title="Center on Vehicle / Pilgrim"
      >
        <Crosshair className="w-4 h-4 text-temple-gold" />
      </button>

      {/* Floating Map Legend Indicator */}
      <div className="absolute top-16 left-3 z-10 glass-panel px-2.5 py-1 rounded-xl text-[10px] text-slate-300 flex items-center gap-2 pointer-events-none shadow-lg">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="font-mono text-[9px] text-rose-300">&gt;2,000m</span>
        </div>
        <div className="flex items-center gap-1 border-l border-white/10 pl-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="font-mono text-[9px] text-amber-200">NH-7</span>
        </div>
        <div className="flex items-center gap-1 border-l border-white/10 pl-1.5">
          <SignalZero className="w-3 h-3 text-rose-400" />
          <span className="font-mono text-[9px] text-rose-300">Dead Zone</span>
        </div>
      </div>
    </div>
  );
};
