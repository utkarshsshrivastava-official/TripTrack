/**
 * Real-time Device Location & Reverse-Geocoding Service
 * Detects real hardware GPS coordinates and resolves human-readable locality.
 * Works offline with zero-signal proximity algorithms across Himalayan waypoints.
 */

export interface DetectedLocation {
  name: string;
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  isLiveGps: boolean;
  timestamp: string;
}

const STORAGE_KEY = 'triptrack_last_detected_location';

// Known Waypoints on Pilgrimage Corridor (Chhattisgarh to Uttarakhand)
const CORRIDOR_WAYPOINTS = [
  { name: 'Durg, Chhattisgarh', lat: 21.1904, lng: 81.2849, radiusKm: 35 },
  { name: 'Bhilai, Chhattisgarh', lat: 21.2144, lng: 81.3807, radiusKm: 25 },
  { name: 'Raipur, Chhattisgarh', lat: 21.2514, lng: 81.6296, radiusKm: 35 },
  { name: 'New Delhi / NDLS', lat: 28.6139, lng: 77.2090, radiusKm: 40 },
  { name: 'Meerut Expressway', lat: 28.9845, lng: 77.7064, radiusKm: 25 },
  { name: 'Muzaffarnagar', lat: 29.4727, lng: 77.7085, radiusKm: 25 },
  { name: 'Roorkee, Uttarakhand', lat: 29.8543, lng: 77.8880, radiusKm: 20 },
  { name: 'Haridwar / Har Ki Pauri', lat: 29.9457, lng: 78.1642, radiusKm: 20 },
  { name: 'Rishikesh / Tapovan', lat: 30.0869, lng: 78.2676, radiusKm: 20 },
  { name: 'Devprayag Sangam', lat: 30.1459, lng: 78.5989, radiusKm: 15 },
  { name: 'Srinagar Garhwal', lat: 30.2224, lng: 78.7844, radiusKm: 15 },
  { name: 'Rudraprayag Sangam', lat: 30.2844, lng: 78.9811, radiusKm: 15 },
  { name: 'Karnaprayag', lat: 30.2587, lng: 79.2173, radiusKm: 15 },
  { name: 'Nandaprayag', lat: 30.3308, lng: 79.3242, radiusKm: 15 },
  { name: 'Chamoli / Gopeshwar', lat: 30.4037, lng: 79.3364, radiusKm: 15 },
  { name: 'Pipalkoti', lat: 30.4300, lng: 79.4300, radiusKm: 12 },
  { name: 'Joshimath', lat: 30.5574, lng: 79.5665, radiusKm: 15 },
  { name: 'Govindghat', lat: 30.6250, lng: 79.5890, radiusKm: 12 },
  { name: 'Pandukeshwar', lat: 30.6380, lng: 79.5930, radiusKm: 10 },
  { name: 'Hanuman Chatti', lat: 30.7020, lng: 79.5050, radiusKm: 8 },
  { name: 'Badrinath Dham', lat: 30.7447, lng: 79.4930, radiusKm: 10 },
  { name: 'Mana Village (Last Indian Village)', lat: 30.7725, lng: 79.4958, radiusKm: 8 },
];

/**
 * Haversine distance in kilometers
 */
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
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
 * Find closest known pilgrimage landmark
 */
function findNearestCorridorLandmark(lat: number, lon: number): string | null {
  let closest: (typeof CORRIDOR_WAYPOINTS)[0] | null = null;
  let minDistance = Infinity;

  for (const wp of CORRIDOR_WAYPOINTS) {
    const dist = calculateDistanceKm(lat, lon, wp.lat, wp.lng);
    if (dist < minDistance && dist <= wp.radiusKm) {
      minDistance = dist;
      closest = wp;
    }
  }

  return closest ? closest.name : null;
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
  const landmark = findNearestCorridorLandmark(lat, lon);
  if (landmark) return landmark;

  // Generic GPS representation
  return `GPS: ${lat.toFixed(3)}°N, ${lon.toFixed(3)}°E`;
}

/**
 * Detect hardware GPS and resolve live location name
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

        const placeName = await reverseGeocode(lat, lon);
        const result: DetectedLocation = {
          name: placeName,
          latitude: lat,
          longitude: lon,
          accuracyMeters: accuracy,
          isLiveGps: true,
          timestamp: new Date().toISOString()
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
        timeout: 5000,
        maximumAge: 120000 // Cache for 2 minutes
      }
    );
  });
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
