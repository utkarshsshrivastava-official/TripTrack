/**
 * Offline Map Tile Pre-Caching Service
 * Pre-downloads and stores Leaflet tiles into browser CacheStorage for zero-signal mountain canyons.
 */

const TILE_CACHE_NAME = 'triptrack-pilgrimage-tiles-v1';

// Bounding box covering Haridwar to Badrinath/Mana corridor
const CORRIDOR_BOUNDS = {
  minLat: 29.85,
  maxLat: 30.85,
  minLon: 78.10,
  maxLon: 79.60
};

export interface DownloadProgress {
  totalTiles: number;
  cachedTiles: number;
  percent: number;
  isComplete: boolean;
  error?: string;
}

/**
 * Convert lat/lon to OSM tile coordinates at zoom z
 */
function deg2num(lat_deg: number, lon_deg: number, zoom: number): [number, number] {
  const lat_rad = (lat_deg * Math.PI) / 180;
  const n = 2.0 ** zoom;
  const xtile = Math.floor(((lon_deg + 180.0) / 360.0) * n);
  const ytile = Math.floor(((1.0 - Math.asinh(Math.tan(lat_rad)) / Math.PI) / 2.0) * n);
  return [xtile, ytile];
}

/**
 * Pre-cache tiles for zooms 8, 9, 10, 11 (covers high-level route overview without exceeding memory)
 */
export async function downloadCorridorOfflineTiles(
  onProgress?: (progress: DownloadProgress) => void
): Promise<DownloadProgress> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    throw new Error('CacheStorage is not supported in this browser');
  }

  const cache = await caches.open(TILE_CACHE_NAME);
  const zoomLevels = [8, 9, 10, 11];
  const tileUrls: string[] = [];

  for (const z of zoomLevels) {
    const [minX, maxY] = deg2num(CORRIDOR_BOUNDS.maxLat, CORRIDOR_BOUNDS.minLon, z);
    const [maxX, minY] = deg2num(CORRIDOR_BOUNDS.minLat, CORRIDOR_BOUNDS.maxLon, z);

    for (let x = Math.min(minX, maxX); x <= Math.max(minX, maxX); x++) {
      for (let y = Math.min(minY, maxY); y <= Math.max(minY, maxY); y++) {
        // Standard OSM tile URL
        tileUrls.push(`https://tile.openstreetmap.org/${z}/${x}/${y}.png`);
      }
    }
  }

  const totalTiles = tileUrls.length;
  let cachedCount = 0;

  // Process in small parallel chunks to avoid network choke
  const CHUNK_SIZE = 6;
  for (let i = 0; i < tileUrls.length; i += CHUNK_SIZE) {
    const chunk = tileUrls.slice(i, i + CHUNK_SIZE);
    await Promise.all(
      chunk.map(async (url) => {
        try {
          const match = await cache.match(url);
          if (!match) {
            const response = await fetch(url, { mode: 'cors' });
            if (response.ok) {
              await cache.put(url, response);
            }
          }
        } catch {
          // Ignore individual tile failures
        } finally {
          cachedCount++;
          if (onProgress) {
            const percent = Math.round((cachedCount / totalTiles) * 100);
            onProgress({
              totalTiles,
              cachedTiles: cachedCount,
              percent,
              isComplete: false
            });
          }
        }
      })
    );
  }

  const finalProgress: DownloadProgress = {
    totalTiles,
    cachedTiles: cachedCount,
    percent: 100,
    isComplete: true
  };

  if (onProgress) onProgress(finalProgress);
  return finalProgress;
}

/**
 * Check if offline tiles are cached
 */
export async function getOfflineTileCacheStatus(): Promise<{ isCached: boolean; tileCount: number }> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return { isCached: false, tileCount: 0 };
  }

  try {
    const exists = await caches.has(TILE_CACHE_NAME);
    if (!exists) return { isCached: false, tileCount: 0 };

    const cache = await caches.open(TILE_CACHE_NAME);
    const keys = await cache.keys();
    return { isCached: keys.length > 50, tileCount: keys.length };
  } catch {
    return { isCached: false, tileCount: 0 };
  }
}
