// TripTrack — Official IndiGo Return Flight Engine & Dual-PNR Connection Tracker
// Grounded in Confirmed PNRs VGLHWK (Sons) and L8CM7C (Elders) for 02-Oct-2026 Journey

export interface FlightPassenger {
  id: string;
  name: string;
  category: 'Senior Citizen' | 'Adult';
  pnr: string;
  duo: 'DUO_A' | 'DUO_B';
  role: 'Elder' | 'Son / Coordinator';
  leg1Seat: string; // DED-DEL
  leg2Seat: string; // DEL-RPR
}

export interface FlightLegSchedule {
  flightNo: string;
  aircraft: string;
  originAirport: string;
  originCode: string;
  originTerminal?: string;
  destinationAirport: string;
  destinationCode: string;
  destinationTerminal?: string;
  scheduledDeparture: string;
  bagDropCloses: string;
  scheduledArrival: string;
  durationMinutes: number;
}

export const INDIGO_FLIGHT_DATA = {
  date: '02 Oct 2026',
  sonPnr: 'VGLHWK',
  elderPnr: 'L8CM7C',
  passengers: [
    {
      id: 'pax-sanjay',
      name: 'SANJAY SHRIVASTAV',
      category: 'Senior Citizen',
      pnr: 'L8CM7C',
      duo: 'DUO_B',
      role: 'Elder',
      leg1Seat: '27F (Window)',
      leg2Seat: '27A (Window)'
    },
    {
      id: 'pax-rajnish',
      name: 'RAJNISH SHRIVASTAVA',
      category: 'Senior Citizen',
      pnr: 'L8CM7C',
      duo: 'DUO_A',
      role: 'Elder',
      leg1Seat: '27E (Middle)',
      leg2Seat: '27B (Middle)'
    },
    {
      id: 'pax-shreyas',
      name: 'SHREYAS SHRIVASTAVA',
      category: 'Adult',
      pnr: 'VGLHWK',
      duo: 'DUO_B',
      role: 'Son / Coordinator',
      leg1Seat: '28F (Window)',
      leg2Seat: '28A (Window)'
    },
    {
      id: 'pax-utkarsh',
      name: 'UTKARSH SHRIVASTAVA',
      category: 'Adult',
      pnr: 'VGLHWK',
      duo: 'DUO_A',
      role: 'Son / Coordinator',
      leg1Seat: '28E (Middle)',
      leg2Seat: '28B (Middle)'
    }
  ] as FlightPassenger[],
  legs: {
    leg1: {
      flightNo: '6E 2476',
      aircraft: 'Airbus A320',
      originAirport: 'Dehradun Jolly Grant Airport',
      originCode: 'DED',
      destinationAirport: 'Delhi Indira Gandhi International Airport',
      destinationCode: 'DEL',
      destinationTerminal: 'Terminal 2 (T2)',
      scheduledDeparture: '13:15',
      bagDropCloses: '12:15',
      scheduledArrival: '14:10',
      durationMinutes: 55
    } as FlightLegSchedule,
    transit: {
      location: 'Delhi (DEL)',
      arrivalTerminal: 'Terminal 2 (T2)',
      departureTerminal: 'Terminal 1 (T1)',
      scheduledLayoverMinutes: 130, // 14:10 to 16:20
      shuttleType: 'Inter-Terminal Shuttle Bus / Airport Coach',
      elderAdvice: 'Baggage checked through to Raipur. Transfer from T2 to T1 via airport shuttle coach and re-clear security at T1.'
    },
    leg2: {
      flightNo: '6E 734',
      aircraft: 'Airbus A320',
      originAirport: 'Delhi Indira Gandhi International Airport',
      originCode: 'DEL',
      originTerminal: 'Terminal 1 (T1)',
      destinationAirport: 'Raipur Swami Vivekananda Airport',
      destinationCode: 'RPR',
      scheduledDeparture: '16:20',
      bagDropCloses: '15:20',
      scheduledArrival: '18:10',
      durationMinutes: 110
    } as FlightLegSchedule
  }
};

export type ConnectionHealth = 'HEALTHY' | 'CAUTION' | 'CRITICAL';

export interface ConnectionEvaluation {
  health: ConnectionHealth;
  scheduledLayoverMinutes: number;
  actualLayoverRemainingMinutes: number;
  badgeLabel: string;
  badgeColor: string;
  actionGuidance: string;
}

export function evaluateConnection(leg1DelayMinutes: number = 0): ConnectionEvaluation {
  const scheduled = INDIGO_FLIGHT_DATA.legs.transit.scheduledLayoverMinutes; // 130 mins
  const remaining = Math.max(0, scheduled - leg1DelayMinutes);

  if (remaining >= 90) {
    return {
      health: 'HEALTHY',
      scheduledLayoverMinutes: scheduled,
      actualLayoverRemainingMinutes: remaining,
      badgeLabel: 'Healthy Connection',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      actionGuidance: 'Comfortable transfer time. Deplane at T2, take the airport shuttle bus to T1, and relax before boarding 6E 734.'
    };
  }

  if (remaining >= 60) {
    return {
      health: 'CAUTION',
      scheduledLayoverMinutes: scheduled,
      actualLayoverRemainingMinutes: remaining,
      badgeLabel: 'Layover Caution',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      actionGuidance: 'Proceed directly to T2 exit and board the inter-terminal shuttle to T1 immediately without stopping at T2 cafes.'
    };
  }

  return {
    health: 'CRITICAL',
    scheduledLayoverMinutes: scheduled,
    actualLayoverRemainingMinutes: remaining,
    badgeLabel: 'Tight Terminal Connection!',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    actionGuidance: 'Inform IndiGo cabin crew before landing and approach IndiGo Transit Desk at T2 for priority golf buggy / expedited T1 security escort.'
  };
}

export interface LiveFlightStatus {
  statusText: string;
  activeLeg: 'PRE_FLIGHT' | 'LEG1' | 'TRANSIT_DEL' | 'LEG2' | 'COMPLETED';
  progressPercent: number;
  leg1DelayMinutes: number;
  leg2DelayMinutes: number;
  connection: ConnectionEvaluation;
  isSimulated?: boolean;
}

export function computeFlightStatus(
  simulatedTime?: Date,
  leg1DelayMinutes: number = 0,
  leg2DelayMinutes: number = 0
): LiveFlightStatus {
  const now = simulatedTime || new Date();
  const leg1Dep = new Date('2026-10-02T13:15:00+05:30').getTime();
  const leg1Arr = new Date('2026-10-02T14:10:00+05:30').getTime() + (leg1DelayMinutes * 60000);
  const leg2Dep = new Date('2026-10-02T16:20:00+05:30').getTime();
  const leg2Arr = new Date('2026-10-02T18:10:00+05:30').getTime() + (leg2DelayMinutes * 60000);
  const nowEpoch = now.getTime();

  const connection = evaluateConnection(leg1DelayMinutes);

  if (nowEpoch < leg1Dep) {
    return {
      statusText: 'Scheduled: Dehradun Bag Drop Closes at 12:15 PM',
      activeLeg: 'PRE_FLIGHT',
      progressPercent: 0,
      leg1DelayMinutes,
      leg2DelayMinutes,
      connection,
      isSimulated: true
    };
  }

  if (nowEpoch >= leg1Dep && nowEpoch < leg1Arr) {
    const elapsed = nowEpoch - leg1Dep;
    const leg1Duration = leg1Arr - leg1Dep;
    const progressPercent = Math.min(45, Math.round((elapsed / leg1Duration) * 45));
    return {
      statusText: 'Airborne: 6E 2476 cruising to Delhi (DEL T2)',
      activeLeg: 'LEG1',
      progressPercent,
      leg1DelayMinutes,
      leg2DelayMinutes,
      connection,
      isSimulated: true
    };
  }

  if (nowEpoch >= leg1Arr && nowEpoch < leg2Dep) {
    return {
      statusText: `Delhi Transit: T2 to T1 Transfer (${connection.actualLayoverRemainingMinutes}m left)`,
      activeLeg: 'TRANSIT_DEL',
      progressPercent: 50,
      leg1DelayMinutes,
      leg2DelayMinutes,
      connection,
      isSimulated: true
    };
  }

  if (nowEpoch >= leg2Dep && nowEpoch < leg2Arr) {
    const elapsed = nowEpoch - leg2Dep;
    const leg2Duration = leg2Arr - leg2Dep;
    const progressPercent = Math.min(95, 50 + Math.round((elapsed / leg2Duration) * 45));
    return {
      statusText: 'Airborne: 6E 734 cruising to Raipur (RPR)',
      activeLeg: 'LEG2',
      progressPercent,
      leg1DelayMinutes,
      leg2DelayMinutes,
      connection,
      isSimulated: true
    };
  }

  return {
    statusText: 'Landed at Raipur (RPR). Luggage pickup & cab drive home to Durg!',
    activeLeg: 'COMPLETED',
    progressPercent: 100,
    leg1DelayMinutes,
    leg2DelayMinutes,
    connection,
    isSimulated: true
  };
}
