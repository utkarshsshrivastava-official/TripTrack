import { useState, useEffect, useMemo, useCallback } from 'react';
import { PILGRIMAGE_DAYS } from '../components/DaySelectorStrip';

export interface AutoPilotStatus {
  phase: 'PRE_TRIP' | 'DURING_TRIP' | 'POST_TRIP';
  todayDayId: string;
  isSimulated: boolean;
  preTripCountdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
  } | null;
  currentDateFormatted: string;
  currentTimeFormatted: string;
}

const PILGRIMAGE_DATES_MAP: Record<string, string> = {
  '2026-09-24': 'day-1',
  '2026-09-25': 'day-2',
  '2026-09-26': 'day-3',
  '2026-09-27': 'day-4',
  '2026-09-28': 'day-5',
  '2026-09-29': 'day-6',
  '2026-09-30': 'day-7',
  '2026-10-01': 'day-8',
  '2026-10-02': 'day-9'
};

const TRIP_START_EPOCH = new Date('2026-09-24T16:30:00+05:30').getTime();
const TRIP_END_EPOCH = new Date('2026-10-02T23:59:59+05:30').getTime();

export function useAutoPilot() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [simulatedDayId, setSimulatedDayId] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem('triptrack_simulated_day') || null;
    } catch {
      return null;
    }
  });
  const [isAutoPilotActive, setIsAutoPilotActive] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('triptrack_autopilot_active');
      return stored !== null ? JSON.parse(stored) : true;
    } catch {
      return true;
    }
  });

  // Ticking clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format today's date in YYYY-MM-DD
  const todayYMD = useMemo(() => {
    const y = currentTime.getFullYear();
    const m = String(currentTime.getMonth() + 1).padStart(2, '0');
    const d = String(currentTime.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [currentTime]);

  // Compute real auto-pilot status
  const realStatus: AutoPilotStatus = useMemo(() => {
    const nowMs = currentTime.getTime();
    const matchedDayId = PILGRIMAGE_DATES_MAP[todayYMD];

    // Formatted strings
    const dateFormatted = currentTime.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
    const timeFormatted = currentTime.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    if (nowMs < TRIP_START_EPOCH) {
      const diffSec = Math.max(0, Math.floor((TRIP_START_EPOCH - nowMs) / 1000));
      const days = Math.floor(diffSec / 86400);
      const hours = Math.floor((diffSec % 86400) / 3600);
      const minutes = Math.floor((diffSec % 3600) / 60);
      const seconds = diffSec % 60;

      return {
        phase: 'PRE_TRIP',
        todayDayId: 'day-1',
        isSimulated: false,
        preTripCountdown: { days, hours, minutes, seconds, totalSeconds: diffSec },
        currentDateFormatted: dateFormatted,
        currentTimeFormatted: timeFormatted
      };
    }

    if (nowMs > TRIP_END_EPOCH) {
      return {
        phase: 'POST_TRIP',
        todayDayId: 'day-9',
        isSimulated: false,
        preTripCountdown: null,
        currentDateFormatted: dateFormatted,
        currentTimeFormatted: timeFormatted
      };
    }

    // During trip
    return {
      phase: 'DURING_TRIP',
      todayDayId: matchedDayId || 'day-1',
      isSimulated: false,
      preTripCountdown: null,
      currentDateFormatted: dateFormatted,
      currentTimeFormatted: timeFormatted
    };
  }, [currentTime, todayYMD]);

  // Active status considering simulation
  const effectiveStatus: AutoPilotStatus = useMemo(() => {
    if (simulatedDayId) {
      const simDay = PILGRIMAGE_DAYS.find(d => d.id === simulatedDayId);
      return {
        ...realStatus,
        phase: 'DURING_TRIP',
        todayDayId: simulatedDayId,
        isSimulated: true,
        currentDateFormatted: simDay ? `${simDay.dateStr} (Simulated)` : realStatus.currentDateFormatted
      };
    }
    return realStatus;
  }, [simulatedDayId, realStatus]);

  // Set or clear simulation day
  const setSimulation = useCallback((dayId: string | null) => {
    setSimulatedDayId(dayId);
    try {
      if (dayId) {
        sessionStorage.setItem('triptrack_simulated_day', dayId);
      } else {
        sessionStorage.removeItem('triptrack_simulated_day');
      }
    } catch {}
  }, []);

  // Toggle Auto-Pilot active state
  const toggleAutoPilot = useCallback(() => {
    setIsAutoPilotActive(prev => {
      const next = !prev;
      try {
        localStorage.setItem('triptrack_autopilot_active', JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  return {
    status: effectiveStatus,
    realStatus,
    isAutoPilotActive,
    toggleAutoPilot,
    simulatedDayId,
    setSimulation
  };
}
