import { localDB } from '../../../shared/db/dexie';
import { LocationPing } from '../../../shared/types';
import { TRAVELLERS_CONFIG } from '../../../shared/config/travellers.config';

export interface TelemetrySnapshot {
  latitude: number;
  longitude: number;
  altitudeMeters: number;
  batteryLevel: number;
  accuracyMeters?: number;
}

/**
 * Capture hardware GPS coordinates and Battery level with safe fallbacks
 */
export async function captureDeviceTelemetry(): Promise<TelemetrySnapshot> {
  let latitude = 30.7447; // Badrinath Dham latitude
  let longitude = 79.4930; // Badrinath Dham longitude
  let altitudeMeters = 3130;
  let batteryLevel = 85;
  let accuracyMeters: number | undefined;

  // 1. Geolocation
  if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 6000,
          maximumAge: 60000
        });
      });
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      if (position.coords.altitude) {
        altitudeMeters = Math.round(position.coords.altitude);
      }
      accuracyMeters = Math.round(position.coords.accuracy);
    } catch {
      // Mountain canyon GPS shadow fallback (defaults to high-altitude valley coordinates)
    }
  }

  // 2. Battery Status API
  if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
    try {
      const batteryManager: any = await (navigator as any).getBattery();
      batteryLevel = Math.round(batteryManager.level * 100);
    } catch {
      // Browser does not support getBattery or permission restricted
    }
  }

  return {
    latitude,
    longitude,
    altitudeMeters,
    batteryLevel,
    accuracyMeters
  };
}

/**
 * Broadcast pilgrim check-in beacon, storing locally in Dexie and syncing if online
 */
export async function broadcastPilgrimBeacon(
  passengerId: string,
  checkpointName: string,
  vitalNote: string,
  isOnline: boolean
): Promise<LocationPing> {
  const telemetry = await captureDeviceTelemetry();

  const ping: LocationPing = {
    passengerId: passengerId || TRAVELLERS_CONFIG[0].id,
    latitude: telemetry.latitude,
    longitude: telemetry.longitude,
    altitudeMeters: telemetry.altitudeMeters,
    batteryLevel: telemetry.batteryLevel,
    checkpointName,
    elderVitalsNote: vitalNote,
    deviceTimestamp: new Date().toISOString(),
    isSynced: isOnline
  };

  // Always save to local Dexie outbox
  await localDB.queuedPings.add({
    passengerId: ping.passengerId,
    latitude: ping.latitude,
    longitude: ping.longitude,
    altitudeMeters: ping.altitudeMeters,
    batteryLevel: ping.batteryLevel,
    checkpointName: ping.checkpointName,
    elderVitalsNote: ping.elderVitalsNote,
    deviceTimestamp: ping.deviceTimestamp
  });

  // If online, immediately sync to server
  if (isOnline) {
    try {
      await fetch('/api/telemetry/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ping)
      });
    } catch (err) {
      console.warn('⚡ Telemetry beacon saved to Dexie; backend sync deferred', err);
    }
  }

  return ping;
}
