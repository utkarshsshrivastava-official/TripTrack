import { localDB, OfflineRouteAlertRecord } from '../../../shared/db/dexie';

export interface RouteAlert extends OfflineRouteAlertRecord {}

export interface CorridorStretchHealth {
  id: string;
  stretch: string;
  status: 'CLEAR' | 'CAUTION' | 'BLOCKED';
  activeAlertCount: number;
  criticalNotice?: string;
}

export const CORRIDOR_STRETCHES = [
  'Haridwar - Rishikesh',
  'Rishikesh - Devprayag',
  'Devprayag - Rudraprayag',
  'Rudraprayag - Chamoli',
  'Chamoli - Joshimath',
  'Joshimath - Badrinath'
] as const;

// Curated high-fidelity seeds for NH-7 Himalayan pilgrimage corridor (Sep 2026)
const INITIAL_ROUTE_ALERTS: RouteAlert[] = [
  {
    id: 'alert-sirobagarh-01',
    stretch: 'Devprayag - Rudraprayag',
    location: 'Sirobagarh (NH-7 Km 92)',
    eventType: 'ONE_WAY_TRAFFIC',
    severity: 'MODERATE',
    status: 'OPEN_CAUTION',
    headline: 'Intermittent falling rocks near Sirobagarh; Single lane operating',
    summary: 'BRO personnel and heavy JCB excavators deployed on site. Heavy vehicles halted periodically; light cars and passenger traveler taxis flagged through in batches. Expect 20-30 min slow movement.',
    broClearanceETA: 'Continuous Patrol / Excavator on standby',
    source: 'BRO Project Shivalik / Uttarakhand Police',
    timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    isFamilyReport: false,
    isSynced: true
  },
  {
    id: 'alert-patalganga-02',
    stretch: 'Chamoli - Joshimath',
    location: 'Patalganga / Langsu',
    eventType: 'CLEAR',
    severity: 'NORMAL',
    status: 'ALL_CLEAR',
    headline: 'Patalganga landslide zone cleared; NH-7 traffic moving normally',
    summary: 'Debris from morning shower cleared completely by Border Roads Organisation. Road surface dry and double-lane traffic restored between Chamoli and Pipalkoti.',
    broClearanceETA: 'Cleared at 11:30 AM',
    source: 'SDRF Chamoli Control Room',
    timestamp: new Date(Date.now() - 85 * 60 * 1000).toISOString(),
    isFamilyReport: false,
    isSynced: true
  },
  {
    id: 'alert-joshimath-badri-03',
    stretch: 'Joshimath - Badrinath',
    location: 'Near Govindghat / Pandukeshwar',
    eventType: 'WEATHER_WARNING',
    severity: 'ADVISORY',
    status: 'OPEN_CAUTION',
    headline: 'High-altitude mist & dense fog advisory between Hanuman Chatti and Dham',
    summary: 'Visibility reduced to under 40 meters. Drivers advised to turn on fog lamps, maintain 30 km/h speed limit, and avoid overtaking on mountain hairpin bends.',
    broClearanceETA: 'Advisory in effect until 18:00 hrs',
    source: 'Uttarakhand State Disaster Management Authority (USDMA)',
    timestamp: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    isFamilyReport: false,
    isSynced: true
  }
];

export async function getRouteAlertsFromDexie(): Promise<RouteAlert[]> {
  try {
    const alerts = await localDB.offlineRouteAlerts.toArray();
    if (alerts.length === 0) {
      // Seed default alerts for offline resilience
      await localDB.offlineRouteAlerts.bulkPut(INITIAL_ROUTE_ALERTS);
      return INITIAL_ROUTE_ALERTS;
    }
    return alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (err) {
    console.warn('Dexie route alerts read failure', err);
    return INITIAL_ROUTE_ALERTS;
  }
}

export async function saveRouteAlertToDexie(alert: RouteAlert): Promise<void> {
  try {
    await localDB.offlineRouteAlerts.put(alert);
  } catch (err) {
    console.error('Failed to save route alert in Dexie', err);
  }
}

export async function fetchLiveRouteAlerts(apiBaseUrl: string = ''): Promise<{
  alerts: RouteAlert[];
  stretches: CorridorStretchHealth[];
  isOnline: boolean;
}> {
  try {
    const res = await fetch(`${apiBaseUrl}/api/alerts/route-status`, {
      headers: {
        'x-family-pin': localStorage.getItem('triptrack_family_pin') || '2026'
      }
    });

    if (res.ok) {
      const data = await res.json();
      const serverAlerts: RouteAlert[] = data.alerts || [];

      // Preserve local unsynced family reports when merging with server
      const localAlerts = await localDB.offlineRouteAlerts.toArray();
      const unsyncedReports = localAlerts.filter(a => a.isFamilyReport && !a.isSynced);

      const merged = [...unsyncedReports, ...serverAlerts];
      await localDB.offlineRouteAlerts.clear();
      await localDB.offlineRouteAlerts.bulkPut(merged);

      return {
        alerts: merged.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
        stretches: data.stretches || computeCorridorStretchHealth(merged),
        isOnline: true
      };
    }
  } catch (err) {
    console.warn('Network offline or route alerts fetch failed; reading from Dexie', err);
  }

  // Fallback to local Dexie
  const localAlerts = await getRouteAlertsFromDexie();
  return {
    alerts: localAlerts,
    stretches: computeCorridorStretchHealth(localAlerts),
    isOnline: false
  };
}

export async function submitFamilySpotterReport(
  report: Omit<RouteAlert, 'id' | 'timestamp' | 'isSynced'>,
  apiBaseUrl: string = ''
): Promise<RouteAlert> {
  const newReport: RouteAlert = {
    ...report,
    id: `spotter-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    isFamilyReport: true,
    isSynced: false
  };

  // Immediate local save in Dexie
  await saveRouteAlertToDexie(newReport);

  // Optimistic background sync if online
  try {
    const res = await fetch(`${apiBaseUrl}/api/alerts/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-family-pin': localStorage.getItem('triptrack_family_pin') || '2026'
      },
      body: JSON.stringify(newReport)
    });

    if (res.ok) {
      newReport.isSynced = true;
      await saveRouteAlertToDexie(newReport);
    }
  } catch (err) {
    console.log('Queued family road report locally in Dexie; will sync on reconnect.');
  }

  return newReport;
}

export function computeCorridorStretchHealth(alerts: RouteAlert[]): CorridorStretchHealth[] {
  return CORRIDOR_STRETCHES.map((stretchName, idx) => {
    const relevantAlerts = alerts.filter(a => a.stretch === stretchName);
    const hasCritical = relevantAlerts.some(a => a.severity === 'CRITICAL' || a.status === 'ACTIVE_BLOCK');
    const hasCaution = relevantAlerts.some(a => a.severity === 'MODERATE' || a.status === 'OPEN_CAUTION' || a.status === 'CLEARING_IN_PROGRESS');

    let status: CorridorStretchHealth['status'] = 'CLEAR';
    let criticalNotice: string | undefined = undefined;

    if (hasCritical) {
      status = 'BLOCKED';
      const critical = relevantAlerts.find(a => a.severity === 'CRITICAL' || a.status === 'ACTIVE_BLOCK');
      criticalNotice = critical ? critical.headline : 'Road obstruction reported';
    } else if (hasCaution) {
      status = 'CAUTION';
      const caution = relevantAlerts.find(a => a.severity === 'MODERATE' || a.status === 'OPEN_CAUTION');
      criticalNotice = caution ? caution.headline : 'Slow movement / Caution advised';
    }

    return {
      id: `stretch-${idx + 1}`,
      stretch: stretchName,
      status,
      activeAlertCount: relevantAlerts.length,
      criticalNotice
    };
  });
}
