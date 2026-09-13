// TripTrack — Official IRCTC Ticket & Zero-Cost 12441 Rajdhani Engine
// Grounded in Confirmed PNR 6709136735 for 24-Sept-2026 Journey

export interface TrainPassenger {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  duo: 'DUO_A' | 'DUO_B';
  role: 'Elder' | 'Son / Coordinator';
  catering: 'VEG' | 'JAIN MEAL';
  coach: string;
  berthNo: number;
  berthType: 'LOWER' | 'UPPER';
  status: 'CONFIRMED';
}

export interface TrainStationSchedule {
  stationCode: string;
  stationName: string;
  state: string;
  distanceFromOriginKm: number;
  distanceFromDurgKm: number;
  scheduledArrival?: string;
  scheduledDeparture: string;
  haltMinutes: number;
  lat: number;
  lng: number;
  elderNote?: string;
  isBoardingPoint?: boolean;
  isDestination?: boolean;
}

export const RAJDHANI_TICKET_DATA = {
  pnr: '6709136735',
  trainNo: '12441',
  trainName: 'BSP NDLS RAJ EX',
  serviceClass: 'SECOND AC (2A)',
  quota: 'GENERAL (GN)',
  distanceKm: 1362,
  boardingStation: 'DURG (DURG)',
  boardingPlatform: 'Platform 1',
  destinationStation: 'NEW DELHI (NDLS)',
  departureDate: '24-Sept-2026',
  departureTime: '16:30',
  arrivalDate: '25-Sept-2026',
  arrivalTime: '10:40',
  bookingDate: '05-Sept-2026 17:37:33 HRS',
  coach: 'A2',
  passengers: [
    {
      id: 'pax-sanjay',
      name: 'SANJAY SHRIVASTA',
      age: 62,
      gender: 'M',
      duo: 'DUO_B',
      role: 'Elder',
      catering: 'VEG',
      coach: 'A2',
      berthNo: 19,
      berthType: 'LOWER',
      status: 'CONFIRMED'
    },
    {
      id: 'pax-shreyas',
      name: 'SHREYAS SHRIVAST',
      age: 28,
      gender: 'M',
      duo: 'DUO_B',
      role: 'Son / Coordinator',
      catering: 'VEG',
      coach: 'A2',
      berthNo: 20,
      berthType: 'UPPER',
      status: 'CONFIRMED'
    },
    {
      id: 'pax-rajnish',
      name: 'RAJNISH SHRIVAST',
      age: 65,
      gender: 'M',
      duo: 'DUO_A',
      role: 'Elder',
      catering: 'JAIN MEAL',
      coach: 'A2',
      berthNo: 21,
      berthType: 'LOWER',
      status: 'CONFIRMED'
    },
    {
      id: 'pax-utkarsh',
      name: 'UTKARSH SHRIVAST',
      age: 30,
      gender: 'M',
      duo: 'DUO_A',
      role: 'Son / Coordinator',
      catering: 'VEG',
      coach: 'A2',
      berthNo: 22,
      berthType: 'UPPER',
      status: 'CONFIRMED'
    }
  ] as TrainPassenger[]
};

export const RAJDHANI_12441_STATIONS: TrainStationSchedule[] = [
  {
    stationCode: 'BSP',
    stationName: 'Bilaspur Junction',
    state: 'Chhattisgarh',
    distanceFromOriginKm: 0,
    distanceFromDurgKm: 0,
    scheduledDeparture: '14:00',
    haltMinutes: 0,
    lat: 22.0797,
    lng: 82.1409,
    elderNote: 'Train originates from Bilaspur'
  },
  {
    stationCode: 'R',
    stationName: 'Raipur Junction',
    state: 'Chhattisgarh',
    distanceFromOriginKm: 111,
    distanceFromDurgKm: 0,
    scheduledArrival: '15:35',
    scheduledDeparture: '15:40',
    haltMinutes: 5,
    lat: 21.2514,
    lng: 81.6296,
    elderNote: 'Approaching Durg; families assemble at Durg PF 1'
  },
  {
    stationCode: 'DURG',
    stationName: 'Durg Junction',
    state: 'Chhattisgarh',
    distanceFromOriginKm: 148,
    distanceFromDurgKm: 0,
    scheduledArrival: '16:25',
    scheduledDeparture: '16:30',
    haltMinutes: 5,
    lat: 21.1904,
    lng: 81.2849,
    isBoardingPoint: true,
    elderNote: 'Board Coach A2 (Berths 19-22). Settle fathers in Lower Berths (19 & 21).'
  },
  {
    stationCode: 'RJN',
    stationName: 'Raj Nandgaon',
    state: 'Chhattisgarh',
    distanceFromOriginKm: 178,
    distanceFromDurgKm: 30,
    scheduledArrival: '16:53',
    scheduledDeparture: '16:55',
    haltMinutes: 2,
    lat: 21.0967,
    lng: 81.0347,
    elderNote: 'Luggage stowed securely under lower berths.'
  },
  {
    stationCode: 'G',
    stationName: 'Gondia Junction',
    state: 'Maharashtra',
    distanceFromOriginKm: 283,
    distanceFromDurgKm: 135,
    scheduledArrival: '18:03',
    scheduledDeparture: '18:05',
    haltMinutes: 2,
    lat: 21.4608,
    lng: 80.1963,
    elderNote: 'Entering Vidarbha stretch; evening snacks & hot tea served.'
  },
  {
    stationCode: 'NGP',
    stationName: 'Nagpur Junction',
    state: 'Maharashtra',
    distanceFromOriginKm: 412,
    distanceFromDurgKm: 264,
    scheduledArrival: '19:35',
    scheduledDeparture: '19:40',
    haltMinutes: 5,
    lat: 21.1524,
    lng: 79.0882,
    elderNote: 'Warm Pantry Dinner: Jain meal for Rajnish Ji, Veg for others. Evening BP medicines.'
  },
  {
    stationCode: 'BPL',
    stationName: 'Bhopal Junction',
    state: 'Madhya Pradesh',
    distanceFromOriginKm: 802,
    distanceFromDurgKm: 654,
    scheduledArrival: '00:05',
    scheduledDeparture: '00:10',
    haltMinutes: 5,
    lat: 23.2599,
    lng: 77.4126,
    elderNote: 'Night halt. AC cabin lights dimmed for deep sleep.'
  },
  {
    stationCode: 'VGLJ',
    stationName: 'V Lakshmibai Jhansi',
    state: 'Uttar Pradesh',
    distanceFromOriginKm: 1094,
    distanceFromDurgKm: 946,
    scheduledArrival: '04:30',
    scheduledDeparture: '04:35',
    haltMinutes: 5,
    lat: 25.4484,
    lng: 78.5685,
    elderNote: 'Pre-dawn transit across Bundelkhand.'
  },
  {
    stationCode: 'GWL',
    stationName: 'Gwalior Junction',
    state: 'Madhya Pradesh',
    distanceFromOriginKm: 1192,
    distanceFromDurgKm: 1044,
    scheduledArrival: '05:35',
    scheduledDeparture: '05:40',
    haltMinutes: 5,
    lat: 26.2183,
    lng: 78.1828,
    elderNote: 'Fathers wake up gently; washroom visits before morning rush.'
  },
  {
    stationCode: 'AGC',
    stationName: 'Agra Cantt',
    state: 'Uttar Pradesh',
    distanceFromOriginKm: 1310,
    distanceFromDurgKm: 1162,
    scheduledArrival: '07:10',
    scheduledDeparture: '07:12',
    haltMinutes: 2,
    lat: 27.1592,
    lng: 77.9942,
    elderNote: 'Morning tea, biscuits & newspapers served in coach.'
  },
  {
    stationCode: 'NDLS',
    stationName: 'New Delhi Railway Station',
    state: 'Delhi',
    distanceFromOriginKm: 1510,
    distanceFromDurgKm: 1362,
    scheduledArrival: '10:40',
    scheduledDeparture: '10:40',
    haltMinutes: 0,
    lat: 28.6431,
    lng: 77.2197,
    isDestination: true,
    elderNote: '1362 KM completed. Exit Platform 1 towards Ajmeri Gate cab bay for Haridwar transfer.'
  }
];

export interface LiveTrainStatus {
  status: 'PRE_BOARDING' | 'RUNNING' | 'ARRIVED';
  progressPercent: number;
  distanceCoveredKm: number;
  totalDistanceKm: number;
  lastStation: TrainStationSchedule;
  nextStation: TrainStationSchedule;
  speedKmh: number;
  delayMinutes: number;
  scheduledArrivalNdls: string;
  estimatedArrivalNdls: string;
  currentStretchDescription: string;
  isSimulated?: boolean;
}

export function computeTrainStatus(
  simulatedTime?: Date,
  delayMinutes: number = 0
): LiveTrainStatus {
  const now = simulatedTime || new Date();
  
  // Trip Date: Sep 24, 2026
  // Departure from Durg: 16:30 IST
  // Arrival at NDLS: Sep 25, 2026, 10:40 IST
  const departureEpoch = new Date('2026-09-24T16:30:00+05:30').getTime();
  const arrivalEpoch = new Date('2026-09-25T10:40:00+05:30').getTime() + (delayMinutes * 60000);
  const nowEpoch = now.getTime();

  const totalDurationMs = arrivalEpoch - departureEpoch;
  const totalDistanceKm = 1362;

  // Format Estimated Arrival
  const estimatedArrivalDate = new Date(new Date('2026-09-25T10:40:00+05:30').getTime() + (delayMinutes * 60000));
  const estimatedArrivalStr = estimatedArrivalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // If before departure date/time
  if (nowEpoch < departureEpoch) {
    return {
      status: 'PRE_BOARDING',
      progressPercent: 0,
      distanceCoveredKm: 0,
      totalDistanceKm,
      lastStation: RAJDHANI_12441_STATIONS[2], // DURG
      nextStation: RAJDHANI_12441_STATIONS[3], // RJN
      speedKmh: 0,
      delayMinutes,
      scheduledArrivalNdls: '10:40 AM',
      estimatedArrivalNdls: estimatedArrivalStr,
      currentStretchDescription: 'Awaiting departure from Durg Jn (PF 1)',
      isSimulated: true
    };
  }

  // If completed
  if (nowEpoch >= arrivalEpoch) {
    return {
      status: 'ARRIVED',
      progressPercent: 100,
      distanceCoveredKm: totalDistanceKm,
      totalDistanceKm,
      lastStation: RAJDHANI_12441_STATIONS[RAJDHANI_12441_STATIONS.length - 2],
      nextStation: RAJDHANI_12441_STATIONS[RAJDHANI_12441_STATIONS.length - 1],
      speedKmh: 0,
      delayMinutes,
      scheduledArrivalNdls: '10:40 AM',
      estimatedArrivalNdls: estimatedArrivalStr,
      currentStretchDescription: 'Arrived at New Delhi (PF 1). Ajmeri Gate Cab Bay transfer.',
      isSimulated: true
    };
  }

  // In Transit
  const elapsedMs = nowEpoch - departureEpoch;
  const rawProgress = Math.min(1, Math.max(0, elapsedMs / totalDurationMs));
  const progressPercent = Math.round(rawProgress * 100);
  const distanceCoveredKm = Math.round(rawProgress * totalDistanceKm);

  // Find active stretch along the Durg -> NDLS stations
  const durgStations = RAJDHANI_12441_STATIONS.slice(2);
  let lastStation = durgStations[0];
  let nextStation = durgStations[1];

  for (let i = 0; i < durgStations.length - 1; i++) {
    if (distanceCoveredKm >= durgStations[i].distanceFromDurgKm && distanceCoveredKm < durgStations[i + 1].distanceFromDurgKm) {
      lastStation = durgStations[i];
      nextStation = durgStations[i + 1];
      break;
    }
  }

  // Realistic Rajdhani cruising speed between 75 and 115 km/h
  const speedKmh = rawProgress > 0.02 && rawProgress < 0.98 ? 92 : 45;

  return {
    status: 'RUNNING',
    progressPercent,
    distanceCoveredKm,
    totalDistanceKm,
    lastStation,
    nextStation,
    speedKmh,
    delayMinutes,
    scheduledArrivalNdls: '10:40 AM',
    estimatedArrivalNdls: estimatedArrivalStr,
    currentStretchDescription: `Cruising between ${lastStation.stationName} and ${nextStation.stationName}`,
    isSimulated: true
  };
}
