/**
 * Mountain Microclimate Weather Service (Open-Meteo Zero-Cost API)
 * Elevation-calibrated live weather for Himalayan pilgrimage nodes.
 * Works 100% free with local caching and offline fallback.
 */

export interface WaypointWeather {
  temperatureC: number;
  feelsLikeC: number;
  weatherCode: number;
  conditionLabel: string;
  conditionIcon: string;
  rainMmPerHour: number;
  windSpeedKmh: number;
  relativeHumidity: number;
  isSnowZone: boolean;
  timestamp: string;
}

const WEATHER_CACHE_KEY = 'triptrack_mountain_weather_cache';
const CACHE_TTL_MS = 20 * 60 * 1000; // 20 minutes

/**
 * Map WMO weather interpretation codes to readable labels & icons
 */
export function interpretWeatherCode(code: number): { label: string; icon: string; isSnow: boolean } {
  if (code === 0) return { label: 'Clear Sky', icon: '☀️', isSnow: false };
  if (code === 1 || code === 2) return { label: 'Mainly Clear', icon: '🌤️', isSnow: false };
  if (code === 3) return { label: 'Overcast', icon: '☁️', isSnow: false };
  if (code === 45 || code === 48) return { label: 'Mountain Fog', icon: '🌫️', isSnow: false };
  if (code >= 51 && code <= 55) return { label: 'Light Drizzle', icon: '🌦️', isSnow: false };
  if (code >= 61 && code <= 65) return { label: 'Mountain Rain', icon: '🌧️', isSnow: false };
  if (code >= 71 && code <= 77) return { label: 'Snow Flurries', icon: '❄️', isSnow: true };
  if (code >= 80 && code <= 82) return { label: 'Rain Showers', icon: '🌧️', isSnow: false };
  if (code >= 85 && code <= 86) return { label: 'Snow Showers', icon: '🌨️', isSnow: true };
  if (code >= 95 && code <= 99) return { label: 'Ghat Thunderstorm', icon: '⛈️', isSnow: false };
  return { label: 'Partly Cloudy', icon: '⛅', isSnow: false };
}

/**
 * Fetch live microclimate for given coordinates via Open-Meteo
 */
export async function fetchLiveMicroclimate(lat: number, lon: number, altitudeMeters = 1000): Promise<WaypointWeather> {
  const cacheKey = `${lat.toFixed(2)}_${lon.toFixed(2)}`;
  const cached = getCachedWeather(cacheKey);
  if (cached) return cached;

  if (typeof navigator !== 'undefined' && navigator.onLine) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=auto`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const current = data.current || {};
        const weatherInfo = interpretWeatherCode(current.weather_code ?? 0);

        const result: WaypointWeather = {
          temperatureC: Math.round(current.temperature_2m ?? (altitudeMeters > 2500 ? 8 : 22)),
          feelsLikeC: Math.round(current.apparent_temperature ?? (altitudeMeters > 2500 ? 6 : 21)),
          weatherCode: current.weather_code ?? 0,
          conditionLabel: weatherInfo.label,
          conditionIcon: weatherInfo.icon,
          rainMmPerHour: current.precipitation ?? 0,
          windSpeedKmh: Math.round(current.wind_speed_10m ?? 8),
          relativeHumidity: Math.round(current.relative_humidity_2m ?? 65),
          isSnowZone: weatherInfo.isSnow || (altitudeMeters >= 3000 && (current.temperature_2m ?? 10) <= 2),
          timestamp: new Date().toISOString()
        };

        saveWeatherToCache(cacheKey, result);
        return result;
      }
    } catch {
      // Fetch error - fallback to altitude estimation
    }
  }

  // Realistic offline estimation based on mountain altitude lapse rate (~6.5°C per 1,000m)
  const baseHaridwarTemp = 28;
  const tempLapse = Math.round(baseHaridwarTemp - ((altitudeMeters - 314) / 1000) * 6.5);
  const isHighAlt = altitudeMeters >= 2500;

  return {
    temperatureC: tempLapse,
    feelsLikeC: tempLapse - (isHighAlt ? 3 : 1),
    weatherCode: isHighAlt ? 1 : 0,
    conditionLabel: isHighAlt ? 'Cool Mountain Breeze' : 'Sunny & Pleasant',
    conditionIcon: isHighAlt ? '🏔️' : '☀️',
    rainMmPerHour: 0,
    windSpeedKmh: isHighAlt ? 16 : 8,
    relativeHumidity: 55,
    isSnowZone: altitudeMeters >= 3100 && tempLapse <= 2,
    timestamp: new Date().toISOString()
  };
}

function getCachedWeather(key: string): WaypointWeather | null {
  try {
    const raw = localStorage.getItem(`${WEATHER_CACHE_KEY}_${key}`);
    if (!raw) return null;
    const item = JSON.parse(raw);
    if (Date.now() - new Date(item.timestamp).getTime() < CACHE_TTL_MS) {
      return item;
    }
    return null;
  } catch {
    return null;
  }
}

function saveWeatherToCache(key: string, data: WaypointWeather) {
  try {
    localStorage.setItem(`${WEATHER_CACHE_KEY}_${key}`, JSON.stringify(data));
  } catch {
    // quota exceeded or restricted
  }
}
