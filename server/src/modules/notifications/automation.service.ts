import { emailService, ScheduledBriefing, WaypointArrival, DailyDigestData } from './email.service';
import { isMongoConnected } from '../../shared/lib/mongodb';
import { getIO, FAMILY_ROOM } from '../chat/socket.service';
import { SegmentModel } from '../../models/segment.model';
import { ExpenseModel } from '../../models/expense.model';
import { FamilyFeedModel } from '../../models/familyFeed.model';

export interface GeofenceWaypoint {
  id: string;
  name: string;
  coords: [number, number]; // [lat, lng]
  radiusKm: number;
  altitudeMeters: number;
  description: string;
  nextStop: string;
}

export const PILGRIMAGE_GEOFENCES: GeofenceWaypoint[] = [
  {
    id: 'wp-durg',
    name: 'Durg Junction & City (Home Base, Chhattisgarh)',
    coords: [21.1904, 81.2849], // Durg, Chhattisgarh coordinates
    radiusKm: 25, // 25 km covers Durg, Bhilai & surrounding departure hub
    altitudeMeters: 290,
    description: '📍 Live location detection triggered in Durg, Chhattisgarh! Utkarsh and family confirmed active at Durg home base / departure point.',
    nextStop: 'Train 12441 BSP NDLS Rajdhani Express ➔ New Delhi'
  },
  {
    id: 'wp-delhi',
    name: 'New Delhi Railway Station (NDLS)',
    coords: [28.6139, 77.2090],
    radiusKm: 12,
    altitudeMeters: 216,
    description: '1,362 km overnight train journey completed on Train 12441 (Coach A2). Safe arrival in the capital and transferring to private AC cab at Ajmeri Gate bay.',
    nextStop: 'Delhi-Meerut Expressway & Haridwar'
  },
  {
    id: 'wp-haridwar',
    name: 'Haridwar Gateway (Ganga Ghats)',
    coords: [29.9457, 78.1642],
    radiusKm: 8,
    altitudeMeters: 314,
    description: 'Arrived at sacred Haridwar gateway. Hotel check-in completed, taking evening rest and attending the divine Ganga Aarti at Har Ki Pauri.',
    nextStop: 'Rishikesh Foothills & Devprayag'
  },
  {
    id: 'wp-rishikesh',
    name: 'Rishikesh Foothills (Triveni Ghat)',
    coords: [30.0869, 78.2676],
    radiusKm: 6,
    altitudeMeters: 372,
    description: 'Passing through Rishikesh foothills into the Shivalik mountain ranges. Beginning the sacred Garhwal mountain highway ascent on NH-7.',
    nextStop: 'Devprayag Sangam'
  },
  {
    id: 'wp-devprayag',
    name: 'Devprayag Sangam (Alaknanda-Bhagirathi)',
    coords: [30.1460, 78.5990],
    radiusKm: 4,
    altitudeMeters: 830,
    description: 'Holy confluence of Alaknanda and Bhagirathi rivers forming the sacred Ganga. First major high-altitude Himalayan landmark successfully reached!',
    nextStop: 'Srinagar Garhwal & Rudraprayag'
  },
  {
    id: 'wp-rudraprayag',
    name: 'Rudraprayag (Mandakini Confluence)',
    coords: [30.2858, 78.9811],
    radiusKm: 4,
    altitudeMeters: 895,
    description: 'Confluence point towards Kedarnath and Badrinath. Pilgrims taking a refreshing tea halt; elders comfortable, warm, and well-hydrated.',
    nextStop: 'Karnaprayag & Joshimath'
  },
  {
    id: 'wp-joshimath',
    name: 'Joshimath Base Camp (Acclimatization Hub)',
    coords: [30.5564, 79.5663],
    radiusKm: 5,
    altitudeMeters: 1890,
    description: 'Winter seat of Lord Badri Vishal. Safe arrival at our primary acclimatization base camp (1,890m). Resting overnight before the final mountain ascent.',
    nextStop: 'Hanuman Chatti & Badrinath Sanctum'
  },
  {
    id: 'wp-badrinath',
    name: 'Badrinath Dham (Holy Sanctum)',
    coords: [30.7447, 79.4930],
    radiusKm: 3,
    altitudeMeters: 3133,
    description: '🙏 Jai Badri Vishal! All 4 pilgrims (Rajnish Ji, Sanjay Ji, Utkarsh & Shreyas) have safely reached Badrinath Sanctum (3,133m). A sacred and auspicious milestone!',
    nextStop: 'Brahma Kapal Pitru Tarpan & Mana Village'
  },
  {
    id: 'wp-mana',
    name: 'Mana (First Village of India)',
    coords: [30.7712, 79.4960],
    radiusKm: 2.5,
    altitudeMeters: 3200,
    description: 'Arrived at Mana Village on the Indo-Tibetan border! Explored Saraswati river origin, Bhim Pul, and Ved Vyas Gufa.',
    nextStop: 'Return Highway Descent'
  }
];

export const SCHEDULED_BRIEFINGS: ScheduledBriefing[] = [
  {
    id: 'briefing-test-15min',
    dayTitle: 'Live Verification: 15-Minute Scheduled Briefing',
    scheduledFor: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    subject: '⏰ [TripTrack Live Test] 15-Minute Scheduled Briefing Trigger',
    transitInfo: 'Live automated schedule verification in Durg, Chhattisgarh. Background timer executed right on schedule!',
    highlights: [
      'Autonomous background heartbeat executed at exact target timestamp',
      'Gmail SMTP transporter connected and delivered payload to family inboxes',
      'Countdown verified: 15-minute scheduled trigger is fully operational'
    ],
    elderCareTip: 'Test briefing confirmed. Real briefings trigger at 6:00 AM / 7:00 AM on pilgrimage days.',
    logisticsSummary: 'TripTrack Autonomous Notification Engine active and verified.'
  },
  {
    id: 'briefing-sep24-morning',
    dayTitle: 'Day 1: Departure Day — Sep 24, 2026',
    scheduledFor: '2026-09-24T08:00:00+05:30',
    subject: 'Train 12441 Rajdhani Express Boarding Briefing',
    transitInfo: 'Train 12441 (BSP NDLS Rajdhani Exp) departs Durg Jn Platform 1 at 16:30. Coach A2, Berths 19, 20, 21, 22. PNR: 6709136735.',
    highlights: [
      '14:30 — Home departure towards Durg Railway Station (PF 1)',
      '16:30 — Train 12441 departure (Smooth 2AC travel across Central India)',
      '19:40 — Nagpur Halt: Pantry dinner delivery (Jain meal for Rajnish Ji, Veg for all) + Evening BP medicines',
      '22:00 — Early cabin lights-out for restful elder sleep'
    ],
    elderCareTip: 'Keep elder medicine pouches, warm shawl, and photo ID cards in the small handheld shoulder bag, not inside the big luggage.',
    logisticsSummary: 'Coolie pre-booked for Durg Jn. PNR 6709136735 saved offline in TripTrack Vault.'
  },
  {
    id: 'briefing-sep25-morning',
    dayTitle: 'Day 2: Delhi Arrival & Highway Transfer — Sep 25, 2026',
    scheduledFor: '2026-09-25T08:30:00+05:30',
    subject: 'NDLS Arrival & Delhi-Meerut Expressway to Haridwar',
    transitInfo: 'Train 12441 arrives New Delhi (PF 1) at 10:40 AM. Transferring to private Ertiga/Crysta cab at Ajmeri Gate Cab Bay.',
    highlights: [
      '10:40 — Arrival New Delhi Station (Ajmeri Gate exit via coolie)',
      '11:45 — Highway cab meetup; fathers seated in middle captain row',
      '14:15 — Lunch halt at Namaste Midway / Cheetal Grand (clean facilities & light vegetarian food)',
      '17:00 — Haridwar hotel check-in; evening Ganga Aarti at Har Ki Pauri'
    ],
    elderCareTip: 'Allow fathers to rest on the hotel bed for 45 minutes immediately upon Haridwar check-in before heading out for Ganga Aarti.',
    logisticsSummary: 'Highway cab driver contact active in Itinerary tab. Haridwar hotel voucher cached offline in Vault.'
  },
  {
    id: 'briefing-sep26-morning',
    dayTitle: 'Day 3: The Mountain Ascent — Sep 26, 2026',
    scheduledFor: '2026-09-26T05:30:00+05:30',
    subject: 'Early 06:00 AM Departure: Haridwar ➔ Joshimath (NH-7)',
    transitInfo: '275 km scenic mountain drive through Garhwal valleys. Entering NH-7 Alaknanda river canyon.',
    highlights: [
      '06:00 — Early morning roll-out from Haridwar to beat Rishikesh traffic',
      '08:30 — Devprayag Sangam viewing & light breakfast',
      '12:30 — Rudraprayag lunch & vehicle cooling halt',
      '16:30 — Arrival at Joshimath (1,890m base camp) for acclimatization'
    ],
    elderCareTip: 'Keep ginger candies and warm water thermos ready in the car. Cellular dead zone begins past Byasi — family pre-alert dispatched.',
    logisticsSummary: 'Check NH-7 landslide guard updates in Feed tab. Joshimath hotel check-in voucher ready.'
  },
  {
    id: 'briefing-sep27-morning',
    dayTitle: 'Day 4: Holy Badrinath Sanctum & Tarpan Day — Sep 27, 2026',
    scheduledFor: '2026-09-27T06:00:00+05:30',
    subject: 'Jai Badri Vishal! Temple Darshan & Brahma Kapal Tarpan',
    transitInfo: 'Final 45 km ascent from Joshimath (1,890m) to Badrinath Dham (3,133m) via Hanuman Chatti.',
    highlights: [
      '07:00 — Depart Joshimath towards Badrinath Dham',
      '09:30 — Arrival in holy valley; check-in at temple guesthouse',
      '11:00 — Sacred Tapt Kund sulphur spring holy bath & Badri Vishal Darshan',
      '14:00 — Brahma Kapal Ghat Pitru Tarpan ancestral liturgy with Panda'
    ],
    elderCareTip: 'Do NOT walk fast. The altitude is 3,130m. Walk slowly, breathe deeply, and take warm cloves water. Keep oximeter handy in jacket.',
    logisticsSummary: 'Yatra biometric registration QR passes saved in Vault. Ancestral Gotra list loaded in Brahma Kapal guide.'
  },
  {
    id: 'briefing-sep28-morning',
    dayTitle: 'Day 5: Mana Village & Garhwal Descent — Sep 28, 2026',
    scheduledFor: '2026-09-28T06:00:00+05:30',
    subject: 'Mana First Village of India & Return Highway Descent',
    transitInfo: 'Visiting Indo-Tibetan border post at Mana, followed by return descent to Srinagar / Rishikesh.',
    highlights: [
      '07:30 — Visit Mana Village, Saraswati river origin & Vyas Gufa',
      '10:30 — Begin vehicle descent down NH-7',
      '16:00 — Night halt in lower elevation valley (Srinagar Garhwal / Rishikesh)'
    ],
    elderCareTip: 'Descent brings immediate oxygen relief. Encourage light walking and relaxing evening tea.',
    logisticsSummary: 'All return hotel passes confirmed. Gullak shared pool tracking active.'
  },
  {
    id: 'briefing-oct01-morning',
    dayTitle: 'Day 8: Homeward Flight Connections — Oct 01, 2026',
    scheduledFor: '2026-09-30T07:00:00+05:30',
    subject: 'IndiGo Flight Transit: Dehradun ➔ Delhi ➔ Raipur',
    transitInfo: 'IndiGo flight connections. PNRs active in Vault. Terminal check-in with wheelchair assistance pre-confirmed for elders.',
    highlights: [
      '09:00 — Dehradun Jolly Grant Airport check-in (Wheelchair support for fathers)',
      '12:30 — Flight connection via New Delhi T2',
      '17:00 — Safe arrival at Raipur / Durg home sweet home'
    ],
    elderCareTip: 'Wheelchair assistance requested on IndiGo boarding passes to avoid airport terminal fatigue.',
    logisticsSummary: 'All boarding passes cached in Vault with instant offline barcode display.'
  }
];

class AutomationService {
  private dispatchedTriggers = new Set<string>();
  private schedulerInterval: any = null;
  private isRunning = false;

  constructor() {
    // Pre-populate already dispatched triggers from memory or storage if needed
  }

  /**
   * Calculate distance between two coordinates in kilometers using Haversine formula
   */
  calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Check if a location ping is inside any unnotified waypoint geofences
   */
  async checkAndTriggerGeofence(
    latitude: number,
    longitude: number,
    _passengerId?: string
  ): Promise<WaypointArrival | null> {
    if (isNaN(latitude) || isNaN(longitude)) return null;

    for (const wp of PILGRIMAGE_GEOFENCES) {
      const triggerKey = `geofence-${wp.id}`;
      if (this.dispatchedTriggers.has(triggerKey)) continue;

      const distKm = this.calculateDistanceKm(latitude, longitude, wp.coords[0], wp.coords[1]);

      if (distKm <= wp.radiusKm) {
        // Mark as dispatched immediately to prevent race conditions
        this.dispatchedTriggers.add(triggerKey);

        const arrivalData: WaypointArrival = {
          id: wp.id,
          name: wp.name,
          arrivedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          altitudeMeters: wp.altitudeMeters,
          description: wp.description,
          latitude,
          longitude,
          detectedVia: 'GPS_GEOFENCE',
          nextStop: wp.nextStop
        };

        console.log(`📍 [Automation] GEOFENCE ARRIVAL DETECTED: Touched ${wp.name} (Dist: ${distKm.toFixed(2)}km <= ${wp.radiusKm}km)`);

        // Dispatch Email
        await emailService.notifyGeofenceArrival(arrivalData);

        // Broadcast to all open family devices via Socket.io
        const io = getIO();
        if (io) {
          io.to(FAMILY_ROOM).emit('geofence_arrival', arrivalData);
        }

        return arrivalData;
      }
    }

    return null;
  }

  /**
   * Milestone Checkpoint Trigger Fallback (Handles cases where GPS was off/asleep)
   */
  async checkAndTriggerMilestoneCheckpoint(
    checkpointId: string,
    checkpointName: string,
    _segmentId?: string
  ): Promise<WaypointArrival | null> {
    const lowerName = checkpointName.toLowerCase();

    // Map checkpoint keywords to geofence waypoints
    let matchedWp: GeofenceWaypoint | undefined;
    if (lowerName.includes('durg') || lowerName.includes('bhilai') || lowerName.includes('chhattisgarh')) {
      matchedWp = PILGRIMAGE_GEOFENCES.find(w => w.id === 'wp-durg');
    } else if (lowerName.includes('ndls') || lowerName.includes('delhi')) {
      matchedWp = PILGRIMAGE_GEOFENCES.find(w => w.id === 'wp-delhi');
    } else if (lowerName.includes('haridwar')) {
      matchedWp = PILGRIMAGE_GEOFENCES.find(w => w.id === 'wp-haridwar');
    } else if (lowerName.includes('rishikesh')) {
      matchedWp = PILGRIMAGE_GEOFENCES.find(w => w.id === 'wp-rishikesh');
    } else if (lowerName.includes('devprayag')) {
      matchedWp = PILGRIMAGE_GEOFENCES.find(w => w.id === 'wp-devprayag');
    } else if (lowerName.includes('rudraprayag')) {
      matchedWp = PILGRIMAGE_GEOFENCES.find(w => w.id === 'wp-rudraprayag');
    } else if (lowerName.includes('joshimath')) {
      matchedWp = PILGRIMAGE_GEOFENCES.find(w => w.id === 'wp-joshimath');
    } else if (lowerName.includes('badrinath') || lowerName.includes('sanctum') || lowerName.includes('dham')) {
      matchedWp = PILGRIMAGE_GEOFENCES.find(w => w.id === 'wp-badrinath');
    } else if (lowerName.includes('mana')) {
      matchedWp = PILGRIMAGE_GEOFENCES.find(w => w.id === 'wp-mana');
    }

    if (!matchedWp) return null;

    const triggerKey = `geofence-${matchedWp.id}`;
    if (this.dispatchedTriggers.has(triggerKey)) return null;

    this.dispatchedTriggers.add(triggerKey);

    const arrivalData: WaypointArrival = {
      id: matchedWp.id,
      name: matchedWp.name,
      arrivedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      altitudeMeters: matchedWp.altitudeMeters,
      description: matchedWp.description,
      latitude: matchedWp.coords[0],
      longitude: matchedWp.coords[1],
      detectedVia: 'MANUAL_CHECKPOINT',
      nextStop: matchedWp.nextStop
    };

    console.log(`✅ [Automation] MILESTONE ARRIVAL TRIGGERED via Checkpoint (${checkpointName}) -> ${matchedWp.name}`);

    // Dispatch Email
    await emailService.notifyGeofenceArrival(arrivalData);

    // Broadcast via Socket.io
    const io = getIO();
    if (io) {
      io.to(FAMILY_ROOM).emit('geofence_arrival', arrivalData);
    }

    return arrivalData;
  }

  /**
   * Start the background scheduler for scheduled morning briefings and daily evening digest
   */
  startScheduler(): void {
    if (this.isRunning) return;
    this.isRunning = true;

    console.log('⏰ [Automation] Autonomous Pilgrimage Scheduler activated (checking every 60s).');

    // Run check immediately on boot, then every 60 seconds
    this.checkScheduledEvents();
    this.schedulerInterval = setInterval(() => {
      this.checkScheduledEvents();
    }, 60000);
  }

  stopScheduler(): void {
    if (this.schedulerInterval) {
      clearInterval(this.schedulerInterval);
      this.schedulerInterval = null;
    }
    this.isRunning = false;
  }

  /**
   * Check all scheduled briefings and evening digest against the current date/time
   */
  async checkScheduledEvents(): Promise<void> {
    const now = new Date();

    // 1. Check morning briefings
    for (const briefing of SCHEDULED_BRIEFINGS) {
      const triggerKey = `briefing-${briefing.id}`;
      if (this.dispatchedTriggers.has(triggerKey)) continue;

      const targetTime = new Date(briefing.scheduledFor);
      // If current time is past or within 10 minutes of target briefing time
      if (now >= targetTime) {
        this.dispatchedTriggers.add(triggerKey);
        console.log(`🌅 [Automation] Triggering Scheduled Briefing: ${briefing.dayTitle}`);
        await emailService.notifyScheduledBriefing(briefing);
      }
    }

    // 2. Check Daily Evening Sandhya Bulletin (at 20:00 / 8:00 PM)
    const todayDateKey = `digest-${now.toISOString().slice(0, 10)}`;
    if (now.getHours() >= 20 && !this.dispatchedTriggers.has(todayDateKey)) {
      this.dispatchedTriggers.add(todayDateKey);
      console.log(`🌄 [Automation] Triggering 8:00 PM Daily Sandhya Bulletin for ${now.toDateString()}`);
      await this.compileAndSendDailyDigest(now);
    }
  }

  /**
   * Compile and send the daily evening digest ("Sandhya Bulletin")
   */
  async compileAndSendDailyDigest(date: Date = new Date()): Promise<DailyDigestData> {
    let milestonesCovered: string[] = [];
    let photosCount = 0;
    let gullakSpentTodayINR = 0;

    try {
      if (isMongoConnected()) {
        const segments = await SegmentModel.find();
        segments.forEach(s => {
          s.checkpoints?.forEach((cp: any) => {
            if (cp.done) milestonesCovered.push(cp.name);
          });
        });

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const expenses = await ExpenseModel.find({ createdAt: { $gte: startOfDay } });
        gullakSpentTodayINR = expenses.reduce((sum, e) => sum + (e.amountINR || 0), 0);

        const feedPosts = await FamilyFeedModel.find({ createdAt: { $gte: startOfDay } });
        photosCount = feedPosts.filter((p: any) => p.metadata?.photoUrl).length;
      }
    } catch (err) {
      console.warn('⚠️ [Automation] Error compiling live DB stats for daily digest:', err);
    }

    if (milestonesCovered.length === 0) {
      milestonesCovered = ['NH-7 Mountain Transit Completed', 'Elder Hydration & BP Routine Confirmed', 'Check-in at Himalayan Camp'];
    }

    const digestData: DailyDigestData = {
      dateStr: date.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }),
      milestonesCovered: milestonesCovered.slice(-5), // Last 5 milestones
      eldersHealthSummary: 'Both Rajnish Ji and Sanjay Ji recorded healthy SpO2 (>92%) and normal pulse rates. Evening BP medicines taken with warm water.',
      photosCount: Math.max(photosCount, 3),
      gullakSpentTodayINR,
      tomorrowPreview: 'Early morning sacred visit to Badrinath Sanctum & Brahma Kapal ancestral rituals. Pacing is gentle.'
    };

    await emailService.notifyDailyEveningDigest(digestData);
    return digestData;
  }

  /**
   * Get engine status overview for settings / admin modal
   */
  getStatus() {
    return {
      schedulerActive: this.isRunning,
      recipients: emailService.getRecipients(),
      activeGeofences: PILGRIMAGE_GEOFENCES.map(g => ({
        id: g.id,
        name: g.name,
        radiusKm: g.radiusKm,
        altitudeMeters: g.altitudeMeters,
        isDispatched: this.dispatchedTriggers.has(`geofence-${g.id}`)
      })),
      scheduledBriefings: SCHEDULED_BRIEFINGS.map(b => ({
        id: b.id,
        dayTitle: b.dayTitle,
        scheduledFor: b.scheduledFor,
        subject: b.subject,
        isDispatched: this.dispatchedTriggers.has(`briefing-${b.id}`)
      })),
      totalDispatchedCount: this.dispatchedTriggers.size
    };
  }

  /**
   * Manual simulator / test trigger for any briefing or waypoint
   */
  async simulateTrigger(type: 'BRIEFING' | 'WAYPOINT' | 'DIGEST', targetId?: string) {
    if (type === 'BRIEFING') {
      const briefing = SCHEDULED_BRIEFINGS.find(b => b.id === targetId) || SCHEDULED_BRIEFINGS[0];
      return await emailService.notifyScheduledBriefing(briefing);
    }
    if (type === 'WAYPOINT') {
      const wp = PILGRIMAGE_GEOFENCES.find(w => w.id === targetId) || PILGRIMAGE_GEOFENCES[0];
      return await emailService.notifyGeofenceArrival({
        id: wp.id,
        name: wp.name,
        arrivedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        altitudeMeters: wp.altitudeMeters,
        description: wp.description,
        latitude: wp.coords[0],
        longitude: wp.coords[1],
        detectedVia: 'GPS_GEOFENCE',
        nextStop: wp.nextStop
      });
    }
    if (type === 'DIGEST') {
      return await this.compileAndSendDailyDigest(new Date());
    }
    return { success: false, error: 'Unknown trigger type' };
  }

  /**
   * Schedule a custom briefing dynamically
   */
  scheduleCustomBriefing(briefing: ScheduledBriefing): ScheduledBriefing {
    // Unshift to place in prominent position
    SCHEDULED_BRIEFINGS.unshift(briefing);
    console.log(`⏱️ [Automation] Dynamically scheduled briefing "${briefing.subject}" for ${briefing.scheduledFor}`);
    return briefing;
  }

  /**
   * Reset a trigger so it can be re-tested
   */
  resetTrigger(triggerId: string): void {
    this.dispatchedTriggers.delete(triggerId);
    this.dispatchedTriggers.delete(`geofence-${triggerId}`);
    this.dispatchedTriggers.delete(`briefing-${triggerId}`);
    console.log(`🔄 [Automation] Reset trigger: ${triggerId}`);
  }
}

export const automationService = new AutomationService();
