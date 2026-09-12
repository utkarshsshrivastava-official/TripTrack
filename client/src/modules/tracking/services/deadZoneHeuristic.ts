export type DeadZoneStatusLevel = 'NORMAL' | 'EXPECTED_MOUNTAIN_SHADOW' | 'EXTENDED_SILENCE';

export interface ShadowGuardAssessment {
  level: DeadZoneStatusLevel;
  minutesElapsed: number;
  badgeText: string;
  badgeColor: string;
  title: string;
  reassuranceMessage: string;
  nextExpectedTower: string;
  estimatedSignalRestoreETA: string;
  isMountainCanyonSegment: boolean;
}

/**
 * Heuristic detector for mountain cellular dead-zone shadows along NH-7
 */
export function evaluateMountainShadow(
  lastPingTimestamp: string | number | Date,
  activeSegmentId: string = 'seg-3',
  currentAltitude: number = 1890
): ShadowGuardAssessment {
  const lastTime = new Date(lastPingTimestamp).getTime();
  const now = Date.now();
  const minutesElapsed = Math.max(0, Math.floor((now - lastTime) / (1000 * 60)));

  // Mountain canyon segments with known cellular blackouts
  const isMountainCanyonSegment = ['seg-3', 'seg-4', 'seg-5'].includes(activeSegmentId) || currentAltitude > 1000;

  if (minutesElapsed < 90) {
    return {
      level: 'NORMAL',
      minutesElapsed,
      badgeText: 'Live Signal Connected',
      badgeColor: 'emerald',
      title: 'Active Network Coverage',
      reassuranceMessage: 'Recent beacon received. Telemetry and voice notes syncing in real time.',
      nextExpectedTower: 'Approaching nearest roadside cell relay',
      estimatedSignalRestoreETA: 'Normal transmission active',
      isMountainCanyonSegment
    };
  }

  if (minutesElapsed <= 180) {
    return {
      level: 'EXPECTED_MOUNTAIN_SHADOW',
      minutesElapsed,
      badgeText: 'Expected Mountain Terrain Shadow',
      badgeColor: 'amber',
      title: 'Cellular Dead Zone Reassurance Active',
      reassuranceMessage: 
        'In the deep Alaknanda river gorges between Srinagar and Joshimath, vertical rock faces block mobile signals. Delays of 2.0 to 2.5 hours are standard and expected. Pilgrim passes, vehicle permits, and GPS logs remain safely stored on device.',
      nextExpectedTower: activeSegmentId === 'seg-3' ? 'Joshimath Base Valley (Tower Coverage)' : 'Badrinath Dham Sanctum (BSNL / Jio Tower)',
      estimatedSignalRestoreETA: '~30–45 mins upon reaching open valley',
      isMountainCanyonSegment: true
    };
  }

  return {
    level: 'EXTENDED_SILENCE',
    minutesElapsed,
    badgeText: 'Extended Terrain Silence',
    badgeColor: 'orange',
    title: 'High-Altitude Pass In Transit',
    reassuranceMessage: 
      'Over 3 hours since last radio ping. Vehicles travel in organized convoys through Vishnuprayag and Govindghat. State Police and Yatra checkposts monitor gate entries continuously.',
    nextExpectedTower: 'Badrinath Main Temple Checkpoint Gate',
    estimatedSignalRestoreETA: 'Next milestone checkpoint verification',
    isMountainCanyonSegment: true
  };
}
