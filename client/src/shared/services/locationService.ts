/**
 * Real-time Device Location & Reverse-Geocoding Service
 * Detects real hardware GPS coordinates, continuous highway telemetry, and resolves human-readable locality.
 * Works offline with zero-signal proximity algorithms across Himalayan waypoints.
 */

import { PILGRIMAGE_WAYPOINTS, PilgrimageWaypoint } from '../config/pilgrimageRoute.config';

export interface DetectedLocation {
  name: string;
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  isLiveGps: boolean;
  timestamp: string;
  speedKmH?: number | null;
  headingDegrees?: number | null;
  altitudeMeters?: number | null;
}

export interface WaypointProximityResult {
  waypoint: PilgrimageWaypoint | null;
  distanceKm: number;
  isInsideThreshold: boolean;
  thresholdKm: number;
}

const STORAGE_KEY = 'triptrack_last_detected_location';

/**
 * Haversine distance in kilometers
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find closest known pilgrimage landmark from PILGRIMAGE_WAYPOINTS
 */
export function findNearestCorridorLandmark(lat: number, lon: number): { waypoint: PilgrimageWaypoint; distanceKm: number } | null {
  let closest: PilgrimageWaypoint | null = null;
  let minDistance = Infinity;

  for (const wp of PILGRIMAGE_WAYPOINTS) {
    const dist = calculateDistanceKm(lat, lon, wp.coords[0], wp.coords[1]);
    if (dist < minDistance) {
      minDistance = dist;
      closest = wp;
    }
  }

  return closest ? { waypoint: closest, distanceKm: minDistance } : null;
}

/**
 * Check if coordinates are within proximity threshold of any pilgrimage waypoint
 */
export function checkWaypointProximity(lat: number, lon: number, thresholdKm = 2.0): WaypointProximityResult {
  const nearest = findNearestCorridorLandmark(lat, lon);
  if (!nearest) {
    return { waypoint: null, distanceKm: Infinity, isInsideThreshold: false, thresholdKm };
  }

  return {
    waypoint: nearest.waypoint,
    distanceKm: Math.round(nearest.distanceKm * 10) / 10,
    isInsideThreshold: nearest.distanceKm <= thresholdKm,
    thresholdKm
  };
}

/**
 * Reverse-geocode latitude and longitude to a human-readable city/place name.
 */
export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  // Check online OSM Nominatim first
  if (typeof navigator !== 'undefined' && navigator.onLine) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`;
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept-Language': 'en'
        }
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};
        
        const locality =
          addr.suburb ||
          addr.neighbourhood ||
          addr.town ||
          addr.village ||
          addr.city ||
          addr.county ||
          addr.district;

        const region = addr.state || addr.country;

        if (locality && region) {
          return `${locality}, ${region}`;
        }
        if (locality) return locality;
        if (data.display_name) {
          const parts = data.display_name.split(',');
          return parts.slice(0, 2).join(',').trim();
        }
      }
    } catch {
      // Network timeout or blocked by CORS — fallback to landmark distance
    }
  }

  // Offline / fallback: check distance against pilgrimage waypoints
  const nearest = findNearestCorridorLandmark(lat, lon);
  if (nearest && nearest.distanceKm <= 35) {
    return nearest.waypoint.name;
  }

  // Generic GPS representation
  return `GPS: ${lat.toFixed(3)}°N, ${lon.toFixed(3)}°E`;
}

/**
 * Detect single-shot hardware GPS and resolve live location name
 */
export async function detectDeviceLocation(): Promise<DetectedLocation> {
  return new Promise((resolve) => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      const cached = getLastKnownLocation();
      resolve(cached || {
        name: 'Home Base',
        latitude: 21.1904,
        longitude: 81.2849,
        isLiveGps: false,
        timestamp: new Date().toISOString()
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const accuracy = Math.round(pos.coords.accuracy);
        const speed = pos.coords.speed !== null ? Math.round(pos.coords.speed * 3.6) : null;
        const heading = pos.coords.heading;
        const altitude = pos.coords.altitude ? Math.round(pos.coords.altitude) : null;

        const placeName = await reverseGeocode(lat, lon);
        const result: DetectedLocation = {
          name: placeName,
          latitude: lat,
          longitude: lon,
          accuracyMeters: accuracy,
          isLiveGps: true,
          timestamp: new Date().toISOString(),
          speedKmH: speed,
          headingDegrees: heading,
          altitudeMeters: altitude
        };

        saveLastKnownLocation(result);
        resolve(result);
      },
      () => {
        // Permission denied or GPS timeout
        const cached = getLastKnownLocation();
        resolve(cached || {
          name: 'Home Base',
          latitude: 21.1904,
          longitude: 81.2849,
          isLiveGps: false,
          timestamp: new Date().toISOString()
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 6000,
        maximumAge: 60000
      }
    );
  });
}

/**
 * Continuous Real-Time GPS Tracking for Highway Cab Navigation
 * Returns an unwatch cleanup function.
 */
export function watchDeviceLocation(
  onUpdate: (location: DetectedLocation) => void,
  onError?: (err: GeolocationPositionError) => void
): () => void {
  if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
    return () => {};
  }

  let lastReverseGeocodeTime = 0;
  let lastCachedName = 'Locating...';

  const watchId = navigator.geolocation.watchPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const accuracy = Math.round(pos.coords.accuracy);
      const speed = pos.coords.speed !== null ? Math.round(pos.coords.speed * 3.6) : null;
      const heading = pos.coords.heading;
      const altitude = pos.coords.altitude ? Math.round(pos.coords.altitude) : null;

      // Throttle reverse geocoding to once every 45 seconds or on major movement
      const now = Date.now();
      if (now - lastReverseGeocodeTime > 45000 || lastCachedName === 'Locating...') {
        lastReverseGeocodeTime = now;
        reverseGeocode(lat, lon).then(name => {
          lastCachedName = name;
        });
      }

      const telemetry: DetectedLocation = {
        name: lastCachedName,
        latitude: lat,
        longitude: lon,
        accuracyMeters: accuracy,
        isLiveGps: true,
        timestamp: new Date().toISOString(),
        speedKmH: speed,
        headingDegrees: heading,
        altitudeMeters: altitude
      };

      saveLastKnownLocation(telemetry);
      onUpdate(telemetry);
    },
    (err) => {
      if (onError) onError(err);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 10000
    }
  );

  return () => {
    navigator.geolocation.clearWatch(watchId);
  };
}

/**
 * Cache detected location locally
 */
export function saveLastKnownLocation(loc: DetectedLocation) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
  } catch {
    // Storage access restricted
  }
}

/**
 * Retrieve cached location if available
 */
export function getLastKnownLocation(): DetectedLocation | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
