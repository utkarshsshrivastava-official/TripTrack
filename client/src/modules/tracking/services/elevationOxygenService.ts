/**
 * Elevation & Atmospheric Oxygen Calculation Service
 * Models barometric hypoxia pressure, slope gradient, and elder pacing advisories along NH-7.
 */

import { PILGRIMAGE_WAYPOINTS, PilgrimageWaypoint } from '../../../shared/config/pilgrimageRoute.config';

export interface RouteProfilePoint {
  progressPercent: number; // 0 to 100
  distanceKm: number;
  altitudeMeters: number;
  effectiveOxygenPercent: number;
  gradientPercent: number; // Slope steepness
  coords: [number, number];
  nearestWaypoint: PilgrimageWaypoint;
  altitudeZone: 'NORMAL' | 'ACCLIMATIZATION' | 'HIGH_ALTITUDE' | 'ALPINE_EXTREME';
  elderMedicalNotice: string;
}

/**
 * Calculates effective atmospheric oxygen fraction compared to sea level (100%)
 * Standard barometric approximation: P / P0 = e^(-h / 8400)
 */
export function calculateEffectiveOxygenPercent(altitudeMeters: number): number {
  if (altitudeMeters <= 0) return 100;
  const ratio = Math.exp(-altitudeMeters / 8400);
  return Math.round(ratio * 100);
}

/**
 * Get altitude danger zone
 */
export function getAltitudeZone(altitudeMeters: number): RouteProfilePoint['altitudeZone'] {
  if (altitudeMeters >= 3000) return 'ALPINE_EXTREME';
  if (altitudeMeters >= 2400) return 'HIGH_ALTITUDE';
  if (altitudeMeters >= 1500) return 'ACCLIMATIZATION';
  return 'NORMAL';
}

/**
 * Interpolate route metrics along the 322 km Haridwar -> Mana corridor
 */
export function interpolateRouteAtProgress(progressPercent: number): RouteProfilePoint {
  const clampedProgress = Math.max(0, Math.min(100, progressPercent));
  const totalWaypoints = PILGRIMAGE_WAYPOINTS.length;
  const totalDistanceKm = PILGRIMAGE_WAYPOINTS[totalWaypoints - 1].distanceFromHaridwarKm;
  const targetDistanceKm = (clampedProgress / 100) * totalDistanceKm;

  // Find surrounding waypoint segment
  let segIndex = 0;
  for (let i = 0; i < totalWaypoints - 1; i++) {
    if (
      targetDistanceKm >= PILGRIMAGE_WAYPOINTS[i].distanceFromHaridwarKm &&
      targetDistanceKm <= PILGRIMAGE_WAYPOINTS[i + 1].distanceFromHaridwarKm
    ) {
      segIndex = i;
      break;
    }
  }

  const wpA = PILGRIMAGE_WAYPOINTS[segIndex];
  const wpB = PILGRIMAGE_WAYPOINTS[Math.min(segIndex + 1, totalWaypoints - 1)];

  const segDist = wpB.distanceFromHaridwarKm - wpA.distanceFromHaridwarKm;
  const fraction = segDist > 0 ? (targetDistanceKm - wpA.distanceFromHaridwarKm) / segDist : 0;

  // Linear interpolation for coords and altitude
  const lat = wpA.coords[0] + (wpB.coords[0] - wpA.coords[0]) * fraction;
  const lon = wpA.coords[1] + (wpB.coords[1] - wpA.coords[1]) * fraction;
  const altitude = Math.round(wpA.altitudeMeters + (wpB.altitudeMeters - wpA.altitudeMeters) * fraction);

  // Slope gradient in % (rise / run * 100)
  const riseMeters = wpB.altitudeMeters - wpA.altitudeMeters;
  const runMeters = segDist * 1000;
  const gradient = runMeters > 0 ? Math.round((riseMeters / runMeters) * 100) : 0;

  const oxygenPercent = calculateEffectiveOxygenPercent(altitude);
  const zone = getAltitudeZone(altitude);

  // Nearest waypoint
  const nearest = fraction < 0.5 ? wpA : wpB;

  let elderMedicalNotice = 'Normal plains elevation. Rest comfortably in vehicle.';
  if (zone === 'ACCLIMATIZATION') {
    elderMedicalNotice = 'Acclimatization zone (1,500m - 2,400m). Sip warm water every 30 mins; take motion sickness pills if sensitive to curves.';
  } else if (zone === 'HIGH_ALTITUDE') {
    elderMedicalNotice = 'High Altitude Warning (>2,400m). Atmospheric oxygen down to ~75%. Cover head/ears with woolen caps. No heavy meals.';
  } else if (zone === 'ALPINE_EXTREME') {
    elderMedicalNotice = 'Extreme Sacred Alpine (>3,000m). Oxygen at ~69%. Walk at half normal pace; rest every 25 steps; monitor SpO2 with oximeter.';
  }

  return {
    progressPercent: clampedProgress,
    distanceKm: Math.round(targetDistanceKm),
    altitudeMeters: altitude,
    effectiveOxygenPercent: oxygenPercent,
    gradientPercent: gradient,
    coords: [lat, lon],
    nearestWaypoint: nearest,
    altitudeZone: zone,
    elderMedicalNotice
  };
}

/**
 * Generate discrete profile points for plotting the SVG elevation ribbon
 */
export function generateElevationProfile(samples = 40): RouteProfilePoint[] {
  const points: RouteProfilePoint[] = [];
  for (let i = 0; i <= samples; i++) {
    const pct = (i / samples) * 100;
    points.push(interpolateRouteAtProgress(pct));
  }
  return points;
}
